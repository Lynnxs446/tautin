"use client";

import { LinkItem } from "@/lib/types";
import {
  ShoppingBagIcon,
  LinkIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  HeartIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  CameraIcon,
  PlayIcon,
  TvIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  TagIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

// =============================================
// Brand SVG Icons
// =============================================
function WhatsAppSvgIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.67-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramSvgIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokSvgIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.26.45-4.63 2.01-6.27 1.57-1.65 3.9-2.51 6.18-2.31.02 1.43.01 2.86.01 4.29-.98-.12-1.99.14-2.76.77-.85.67-1.33 1.73-1.25 2.82.04 1.09.61 2.09 1.54 2.66.93.57 2.12.61 3.09.11 1.03-.51 1.68-1.57 1.71-2.72.03-4.27.02-8.54.02-12.81z" />
    </svg>
  );
}

function ShopeeSvgIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.467 6.454a.75.75 0 00-.717-.534h-2.92a4.33 4.33 0 00-7.66 0H5.25a.75.75 0 00-.717.534l-2.25 7.5A.75.75 0 003 14.89l.86 4.301A2.25 2.25 0 006.126 21h11.748a2.25 2.25 0 002.267-1.809l.86-4.301a.75.75 0 00.657-.936l-2.191-7.5zM12 3.75a2.83 2.83 0 012.637 1.83H9.363A2.83 2.83 0 0112 3.75zM6.126 19.5a.75.75 0 01-.756-.603L4.654 15h14.692l-.716 3.897a.75.75 0 01-.756.603H6.126zm14.417-6H3.457l1.8-6h13.486l1.8 6z" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  WhatsApp: WhatsAppSvgIcon,
  Instagram: InstagramSvgIcon,
  TikTok: TikTokSvgIcon,
  Shopee: ShopeeSvgIcon,
  ShoppingBag: ShoppingBagIcon,
  Link: LinkIcon,
  Globe: GlobeAltIcon,
  Envelope: EnvelopeIcon,
  Phone: PhoneIcon,
  Chat: ChatBubbleLeftIcon,
  Star: StarIcon,
  Heart: HeartIcon,
  Music: MusicalNoteIcon,
  VideoCamera: VideoCameraIcon,
  Camera: CameraIcon,
  Play: PlayIcon,
  Tv: TvIcon,
  Book: BookOpenIcon,
  Briefcase: BriefcaseIcon,
  Store: BuildingStorefrontIcon,
  Tag: TagIcon,
  Cube: CubeIcon,
};

export function detectIconName(url: string = "", label: string = ""): string {
  const combined = (url + " " + label).toLowerCase();
  if (combined.includes("wa.me") || combined.includes("whatsapp") || combined.includes("wa.link") || combined.includes("wa")) {
    return "WhatsApp";
  }
  if (combined.includes("instagram") || combined.includes("instagr.am") || combined.includes("ig")) {
    return "Instagram";
  }
  if (combined.includes("tiktok") || combined.includes("vt.tiktok")) {
    return "TikTok";
  }
  if (combined.includes("shopee") || combined.includes("shp.ee")) {
    return "Shopee";
  }
  return "Link";
}

export function formatUrl(rawUrl: string = ""): string {
  let url = rawUrl.trim();
  if (!url) return "#";

  const lower = url.toLowerCase();
  if (lower.includes("wa.me/") || lower.includes("api.whatsapp.com/send")) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  }

  const isPhoneNumber = /^(\+?62|08|8)[0-9\s\-]+$/.test(url);
  if (isPhoneNumber) {
    let clean = url.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    } else if (clean.startsWith("8")) {
      clean = "628" + clean.slice(1);
    }
    return `https://wa.me/${clean}`;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
}

interface LinkButtonProps {
  link: LinkItem;
  btnBgType?: string;
  btnBgValue?: string;
  btnTextColor?: string;
}

export default function LinkButton({
  link,
  btnBgType = "color",
  btnBgValue = "#2A2A2A",
  btnTextColor = "#FFFFFF",
}: LinkButtonProps) {
  let iconKey = link.icon;
  if (!iconKey || iconKey === "Link" || !ICON_MAP[iconKey]) {
    iconKey = detectIconName(link.url, link.label);
  }

  const IconComponent = ICON_MAP[iconKey] ?? LinkIcon;
  const finalHref = formatUrl(link.url);

  const buttonStyle: React.CSSProperties =
    btnBgType === "image" && btnBgValue
      ? {
          backgroundImage: `url(${btnBgValue})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: btnTextColor || "#FFFFFF",
        }
      : {
          backgroundColor: btnBgValue || "#2A2A2A",
          color: btnTextColor || "#FFFFFF",
        };

  return (
    <a
      href={finalHref}
      target="_blank"
      rel="noopener noreferrer"
      className="link-button"
      style={buttonStyle}
    >
      <span className="link-button__icon">
        <IconComponent className="w-5 h-5" />
      </span>
      <span className="link-button__label">{link.label}</span>
    </a>
  );
}

export { ICON_MAP };
