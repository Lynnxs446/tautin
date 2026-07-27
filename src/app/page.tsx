import { createClient } from "@/lib/supabase/server";
import { SiteSettings, LinkItem } from "@/lib/types";
import Image from "next/image";
import LinkButton from "@/components/home/LinkButton";

async function fetchSettings(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<SiteSettings> {
  const { data, error } = await supabase.from("settings").select("key, value");

  const defaults: SiteSettings = {
    brand_name: "Brand Name",
    tagline: "Your tagline here",
    footer_text: "© 2025 Brand Name. All rights reserved.",
    page_bg_type: "color",
    page_bg_value: "#0D0D0D",
    card_bg_type: "color",
    card_bg_value: "#1E1E1E",
    logo_url: "",
  };

  if (error || !data) return defaults;

  const map = Object.fromEntries(data.map((row) => [row.key, row.value]));
  return {
    brand_name: map.brand_name ?? defaults.brand_name,
    tagline: map.tagline ?? defaults.tagline,
    footer_text: map.footer_text ?? defaults.footer_text,
    page_bg_type: (map.page_bg_type as SiteSettings["page_bg_type"]) ?? defaults.page_bg_type,
    page_bg_value: map.page_bg_value ?? defaults.page_bg_value,
    card_bg_type: (map.card_bg_type as SiteSettings["card_bg_type"]) ?? defaults.card_bg_type,
    card_bg_value: map.card_bg_value ?? defaults.card_bg_value,
    logo_url: map.logo_url ?? defaults.logo_url,
  };
}

async function fetchLinks(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<LinkItem[]> {
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error || !data) return [];
  return data as LinkItem[];
}

export const revalidate = 0; 

export default async function HomePage() {
  const supabase = await createClient();
  const [settings, links] = await Promise.all([
    fetchSettings(supabase),
    fetchLinks(supabase),
  ]);

  const pageBgStyle: React.CSSProperties =
    settings.page_bg_type === "image" && settings.page_bg_value
      ? {
          backgroundImage: `url(${settings.page_bg_value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }
      : { backgroundColor: settings.page_bg_value || "#0D0D0D" };

  return (
    <>
      {/* ── Page background ── */}
      <div className="home-page" style={pageBgStyle}>
        <main className="home-container">
          {/* ── Profile Section ── */}
          <section className="profile-section">
            {/* Logo */}
            <div className="logo-wrapper">
              {settings.logo_url ? (
                <Image
                  src={settings.logo_url}
                  alt={settings.brand_name}
                  fill
                  className="logo-image"
                  sizes="96px"
                  priority
                />
              ) : (
                <div className="logo-placeholder">
                  <span>{settings.brand_name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Brand name */}
            <h1 className="brand-name">{settings.brand_name}</h1>

            {/* Tagline */}
            {settings.tagline && (
              <p className="tagline">{settings.tagline}</p>
            )}
          </section>

          {/* ── Link Buttons ── */}
          <section className="links-section">
            {links.map((link) => (
              <LinkButton
                key={link.id}
                link={link}
                cardBgType={settings.card_bg_type}
                cardBgValue={settings.card_bg_value}
              />
            ))}
          </section>
        </main>

        {/* ── Footer ── */}
        {settings.footer_text && (
          <footer className="home-footer">
            <p>{settings.footer_text}</p>
          </footer>
        )}
      </div>

      <style>{`
        .home-page {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 48px 16px 24px;
        }

        .home-container {
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          flex: 1;
        }

        .profile-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }

        .logo-wrapper {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #3A3A3A;
          flex-shrink: 0;
        }

        .logo-image {
          object-fit: cover;
        }

        .logo-placeholder {
          width: 100%;
          height: 100%;
          background-color: #1E1E1E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .brand-name {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }

        .tagline {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.5;
          max-width: 320px;
        }

        .links-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .link-button {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid #3A3A3A;
          text-decoration: none;
          color: #ffffff;
          font-size: 15px;
          font-weight: 500;
          transition: opacity 0.18s ease, transform 0.18s ease;
          cursor: pointer;
        }

        .link-button:hover {
          opacity: 0.82;
          transform: translateY(-1px);
        }

        .link-button:active {
          transform: translateY(0);
        }

        .link-button__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .link-button__label {
          flex: 1;
          text-align: center;
          margin-right: 36px; /* offset for icon to visually center label */
        }

        .home-footer {
          margin-top: 40px;
          padding-bottom: 24px;
          text-align: center;
        }

        .home-footer p {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 480px) {
          .home-page {
            padding: 36px 14px 20px;
          }

          .brand-name {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
}
