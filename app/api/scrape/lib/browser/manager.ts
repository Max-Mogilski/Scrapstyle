import puppeteerCore, { Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { existsSync } from "fs";

let browserInstance: Browser | null = null;

const isDev = process.env.NODE_ENV === "development";

const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v141.0.0/chromium-v141.0.0-pack.x64.tar";

const CHROME_PATHS = {
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  ],
  win32: [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
  ],
  linux: [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
    "/usr/bin/brave-browser",
  ],
};

function findLocalBrowser(): string | null {
  const platform = process.platform as keyof typeof CHROME_PATHS;
  const paths = CHROME_PATHS[platform] || CHROME_PATHS.linux;

  for (const browserPath of paths) {
    if (existsSync(browserPath)) {
      return browserPath;
    }
  }
  return null;
}

async function getExecutablePath(): Promise<string> {
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  if (isDev) {
    const localBrowser = findLocalBrowser();
    if (localBrowser) {
      return localBrowser;
    }
  }

  return await chromium.executablePath(CHROMIUM_PACK_URL);
}

export async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  const executablePath = await getExecutablePath();
  const isLocal = isDev && findLocalBrowser();

  browserInstance = await puppeteerCore.launch({
    args: isLocal ? [] : chromium.args,
    executablePath,
    headless: true,
  });

  return browserInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
