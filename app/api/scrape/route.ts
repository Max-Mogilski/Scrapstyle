import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { scrapeWithBrowser } from './lib/browser';
import { buildDataSummary, buildVisionPrompt, getInstructions } from './lib/prompt';
import { cleanAIOutput, removeBrandNames } from './lib/utils';
import { DEFAULT_MODELS, DEFAULT_PROVIDER, type AIProvider } from '@/app/lib/constants';
import type { ScreenshotData } from './lib/types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function toGeminiImages(screenshots: ScreenshotData) {
  return [
    { inlineData: { mimeType: 'image/jpeg', data: screenshots.top.toString('base64') } },
    { inlineData: { mimeType: 'image/jpeg', data: screenshots.middle.toString('base64') } },
    { inlineData: { mimeType: 'image/jpeg', data: screenshots.full.toString('base64') } },
  ];
}

function toOpenRouterImages(screenshots: ScreenshotData) {
  const asDataUrl = (buf: Buffer) => `data:image/jpeg;base64,${buf.toString('base64')}`;
  return [
    { type: 'image_url', image_url: { url: asDataUrl(screenshots.top) } },
    { type: 'image_url', image_url: { url: asDataUrl(screenshots.middle) } },
    { type: 'image_url', image_url: { url: asDataUrl(screenshots.full) } },
  ];
}

async function generateWithGemini(prompt: string, screenshots: ScreenshotData, apiKey: string, model?: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model: model || DEFAULT_MODELS.gemini });

  const imageParts = toGeminiImages(screenshots);

  const result = await geminiModel.generateContent([prompt, ...imageParts]);
  return result.response.text();
}

async function generateWithOpenRouter(prompt: string, screenshots: ScreenshotData, apiKey: string, model?: string) {
  const messages = [
    { role: 'system', content: [{ type: 'text', text: 'You are an expert UI/UX designer. Output Markdown only.' }] },
    {
      role: 'user',
      content: [{ type: 'text', text: prompt }, ...toOpenRouterImages(screenshots)],
    },
  ];

  const resp = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'ScrapeStyle',
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODELS.openrouter,
      messages,
      max_tokens: 4096,
    }),
  });

  if (resp.status === 401) throw new Error('Invalid API key');
  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`OpenRouter error (${resp.status}): ${detail}`);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content returned from model');

  if (Array.isArray(content)) {
    return content
      .map((part: { text?: string } | string) =>
        typeof part === 'string' ? part : part?.text || ''
      )
      .join('\n');
  }

  return content as string;
}

export async function POST(req: NextRequest) {
  try {
    const {
      url,
      apiKey,
      provider = DEFAULT_PROVIDER,
      model,
    }: { url: string; apiKey: string; provider?: AIProvider; model?: string } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const scrapeResult = await scrapeWithBrowser(url);

    const dataSummary = buildDataSummary(scrapeResult.extractedData);
    const prompt = buildVisionPrompt(dataSummary);

    let aiText: string;
    if (provider === 'openrouter') {
      aiText = await generateWithOpenRouter(prompt, scrapeResult.screenshots, apiKey, model);
    } else {
      aiText = await generateWithGemini(prompt, scrapeResult.screenshots, apiKey, model);
    }

    let generatedGuide = cleanAIOutput(aiText);
    generatedGuide = removeBrandNames(generatedGuide, url);

    const styleGuide = getInstructions() + generatedGuide;

    return NextResponse.json({
      styleGuide,
      designTokens: {
        colors: scrapeResult.extractedData.allColors,
        fonts: scrapeResult.extractedData.typography.body?.fontFamily
          ? [scrapeResult.extractedData.typography.body.fontFamily]
          : [],
        cssVariables: scrapeResult.extractedData.cssVariables,
      },
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
