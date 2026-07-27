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

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
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
  Instagram: CameraIcon,
  TikTok: PlayIcon,
  Shopee: ShoppingBagIcon,
};

interface LinkButtonProps {
  link: LinkItem;
  cardBgType: string;
  cardBgValue: string;
}

export default function LinkButton({
  link,
  cardBgType,
  cardBgValue,
}: LinkButtonProps) {
  const IconComponent = ICON_MAP[link.icon] ?? LinkIcon;

  const cardStyle: React.CSSProperties =
    cardBgType === "image" && cardBgValue
      ? {
          backgroundImage: `url(${cardBgValue})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { backgroundColor: cardBgValue || "#1E1E1E" };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-button"
      style={cardStyle}
    >
      <span className="link-button__icon">
        <IconComponent className="w-5 h-5" />
      </span>
      <span className="link-button__label">{link.label}</span>
    </a>
  );
}

export { ICON_MAP };
