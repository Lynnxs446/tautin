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
    brand_name_color: "#FFFFFF",
    tagline: "Your tagline here",
    tagline_color: "#A3A3A3",
    footer_text: "© 2025 Brand Name. All rights reserved.",
    footer_color: "#737373",
    page_bg_type: "color",
    page_bg_value: "#0D0D0D",
    card_bg_type: "color",
    card_bg_value: "#1E1E1E",
    btn_bg_type: "color",
    btn_bg_value: "#2A2A2A",
    btn_text_color: "#FFFFFF",
    logo_url: "",
  };

  if (error || !data) return defaults;

  const map = Object.fromEntries(data.map((row) => [row.key, row.value]));
  return {
    brand_name: map.brand_name ?? defaults.brand_name,
    brand_name_color: map.brand_name_color ?? defaults.brand_name_color,
    tagline: map.tagline ?? defaults.tagline,
    tagline_color: map.tagline_color ?? defaults.tagline_color,
    footer_text: map.footer_text ?? defaults.footer_text,
    footer_color: map.footer_color ?? defaults.footer_color,
    page_bg_type: (map.page_bg_type as SiteSettings["page_bg_type"]) ?? defaults.page_bg_type,
    page_bg_value: map.page_bg_value ?? defaults.page_bg_value,
    card_bg_type: (map.card_bg_type as SiteSettings["card_bg_type"]) ?? defaults.card_bg_type,
    card_bg_value: map.card_bg_value ?? defaults.card_bg_value,
    btn_bg_type: (map.btn_bg_type as SiteSettings["btn_bg_type"]) ?? defaults.btn_bg_type,
    btn_bg_value: map.btn_bg_value ?? defaults.btn_bg_value,
    btn_text_color: map.btn_text_color ?? defaults.btn_text_color,
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

  // Page background
  const pageBgStyle: React.CSSProperties =
    settings.page_bg_type === "image" && settings.page_bg_value
      ? {
          backgroundImage: `url(${settings.page_bg_value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }
      : { backgroundColor: settings.page_bg_value || "#0D0D0D" };

  // Main Card background
  const cardBgStyle: React.CSSProperties =
    settings.card_bg_type === "image" && settings.card_bg_value
      ? {
          backgroundImage: `url(${settings.card_bg_value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { backgroundColor: settings.card_bg_value || "#1E1E1E" };

  return (
    <>
      {/* ── Page background ── */}
      <div className="home-page" style={pageBgStyle}>
        {/* ── Main Card Container ── */}
        <main className="home-card" style={cardBgStyle}>
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
                <div className="logo-placeholder" style={{ color: settings.brand_name_color }}>
                  <span>{settings.brand_name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Brand name */}
            <h1 className="brand-name" style={{ color: settings.brand_name_color }}>
              {settings.brand_name}
            </h1>

            {/* Tagline */}
            {settings.tagline && (
              <p className="tagline" style={{ color: settings.tagline_color }}>
                {settings.tagline}
              </p>
            )}
          </section>

          {/* ── Link Buttons ── */}
          <section className="links-section">
            {links.map((link) => (
              <LinkButton
                key={link.id}
                link={link}
                btnBgType={settings.btn_bg_type}
                btnBgValue={settings.btn_bg_value}
                btnTextColor={settings.btn_text_color}
              />
            ))}
          </section>

          {/* ── Footer ── */}
          {settings.footer_text && (
            <footer className="home-footer">
              <p style={{ color: settings.footer_color }}>{settings.footer_text}</p>
            </footer>
          )}
        </main>
      </div>

      <style>{`
        .home-page {
          min-height: 100dvh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
        }

        .home-card {
          width: 100%;
          max-width: 480px;
          border-radius: 28px;
          border: 1px solid #3A3A3A;
          padding: 40px 24px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
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
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-image {
          object-fit: contain;
        }

        .logo-placeholder {
          width: 100%;
          height: 100%;
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 500;
          letter-spacing: 0.1em;
        }

        /* ── Exact geometric brand typography matching reference image ── */
        .brand-name {
          font-family: var(--font-jost), var(--font-montserrat), "Futura", "Futura PT", "Century Gothic", sans-serif;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: 0.22em;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .tagline {
          font-size: 14px;
          line-height: 1.5;
          max-width: 340px;
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
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: opacity 0.18s ease, transform 0.18s ease;
          cursor: pointer;
        }

        .link-button:hover {
          opacity: 0.88;
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
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.12);
          flex-shrink: 0;
        }

        .link-button__label {
          flex: 1;
          text-align: center;
          margin-right: 36px;
        }

        .home-footer {
          margin-top: 8px;
          text-align: center;
        }

        .home-footer p {
          font-size: 12px;
        }

        @media (max-width: 480px) {
          .home-page {
            padding: 16px 10px;
          }

          .home-card {
            border-radius: 20px;
            padding: 32px 18px 24px;
            gap: 24px;
          }

          .brand-name {
            font-size: 21px;
            letter-spacing: 0.18em;
          }
        }
      `}</style>
    </>
  );
}
