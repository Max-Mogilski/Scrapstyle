import { siteConfig } from "@/app/config/site";
import { WebsiteIcon, XIcon, YouTubeIcon } from "@/app/components/ui/icons";

export default function Footer() {
  return (
    <footer className="w-full py-5 px-6 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-[var(--color-gray-500)]">
        <span>Open source under MIT</span>
        <div className="flex items-center gap-4">
          <SocialLink href={siteConfig.social.website} icon={<WebsiteIcon />} label="Website" />
          <SocialLink href={siteConfig.social.x} icon={<XIcon />} label="X" />
          <SocialLink href={siteConfig.social.youtube} icon={<YouTubeIcon />} label="YouTube" />
        </div>
      </div>
    </footer>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 hover:text-[var(--color-dark)] transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
