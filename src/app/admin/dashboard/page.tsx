"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SiteSettings, LinkItem } from "@/lib/types";
import BackgroundEditor from "@/components/admin/BackgroundEditor";
import LogoEditor from "@/components/admin/LogoEditor";
import TextEditor from "@/components/admin/TextEditor";
import LinkButtonEditor from "@/components/admin/LinkButtonEditor";
import {
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
  PaintBrushIcon,
  UserCircleIcon,
  LinkIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

type TabKey = "profile" | "background" | "links" | "footer";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "profile", label: "Profil", icon: UserCircleIcon },
  { key: "background", label: "Background", icon: PaintBrushIcon },
  { key: "links", label: "Tombol", icon: LinkIcon },
  { key: "footer", label: "Footer", icon: DocumentTextIcon },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [{ data: settingsData }, { data: linksData }] = await Promise.all([
        supabase.from("settings").select("key, value"),
        supabase.from("links").select("*").order("order_index", { ascending: true }),
      ]);

      if (settingsData) {
        const map = Object.fromEntries(
          (settingsData as { key: string; value: string }[]).map((r) => [r.key, r.value])
        );
        setSettings({
          brand_name: map.brand_name ?? "Brand Name",
          tagline: map.tagline ?? "Your tagline here",
          footer_text: map.footer_text ?? "© 2025 Brand Name",
          page_bg_type: (map.page_bg_type as SiteSettings["page_bg_type"]) ?? "color",
          page_bg_value: map.page_bg_value ?? "#0D0D0D",
          card_bg_type: (map.card_bg_type as SiteSettings["card_bg_type"]) ?? "color",
          card_bg_value: map.card_bg_value ?? "#1E1E1E",
          btn_bg_type: (map.btn_bg_type as SiteSettings["btn_bg_type"]) ?? "color",
          btn_bg_value: map.btn_bg_value ?? "#2A2A2A",
          btn_text_color: map.btn_text_color ?? "#FFFFFF",
          logo_url: map.logo_url ?? "",
        });
      }
      if (linksData) {
        setLinks(linksData as LinkItem[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <>
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <Squares2X2Icon className="w-5 h-5" />
              <span>Admin Panel</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`nav-item ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="view-site-btn"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Lihat Halaman
            </a>
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="mobile-header">
            <div className="mobile-tabs">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`mobile-tab ${activeTab === tab.key ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="dashboard-content">
            {activeTab === "profile" && (
              <section className="content-section">
                <div className="section-header">
                  <h2 className="section-title">Profil</h2>
                  <p className="section-desc">
                    Atur logo, nama brand, dan tagline
                  </p>
                </div>

                <div className="section-body">
                  <LogoEditor
                    logoUrl={settings.logo_url}
                    brandName={settings.brand_name}
                    onSaved={(url) =>
                      setSettings((s) => s ? { ...s, logo_url: url } : s)
                    }
                  />

                  <div className="admin-card">
                    <p className="section-label">Teks Profil</p>
                    <div className="text-fields">
                      <TextEditor
                        label="Nama Brand"
                        settingKey="brand_name"
                        initialValue={settings.brand_name}
                        placeholder="Nama brand Anda"
                        onSaved={(v) =>
                          setSettings((s) => s ? { ...s, brand_name: v } : s)
                        }
                      />
                      <div className="divider" />
                      <TextEditor
                        label="Tagline"
                        settingKey="tagline"
                        initialValue={settings.tagline}
                        placeholder="Tagline singkat Anda"
                        multiline
                        onSaved={(v) =>
                          setSettings((s) => s ? { ...s, tagline: v } : s)
                        }
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "background" && (
              <section className="content-section">
                <div className="section-header">
                  <h2 className="section-title">Background</h2>
                  <p className="section-desc">
                    Atur latar halaman, card utama, dan tombol tautan secara terpisah
                  </p>
                </div>

                <div className="section-body">
                  {/* 1. Background Halaman Belakang */}
                  <BackgroundEditor
                    title="1. Background Halaman (Paling Belakang)"
                    bgType={settings.page_bg_type}
                    bgValue={settings.page_bg_value}
                    settingTypeKey="page_bg_type"
                    settingValueKey="page_bg_value"
                    onSaved={(type, value) =>
                      setSettings((s) =>
                        s ? { ...s, page_bg_type: type, page_bg_value: value } : s
                      )
                    }
                  />

                  {/* 2. Background Card Utama */}
                  <BackgroundEditor
                    title="2. Background Card Utama (Profile Container)"
                    bgType={settings.card_bg_type}
                    bgValue={settings.card_bg_value}
                    settingTypeKey="card_bg_type"
                    settingValueKey="card_bg_value"
                    onSaved={(type, value) =>
                      setSettings((s) =>
                        s ? { ...s, card_bg_type: type, card_bg_value: value } : s
                      )
                    }
                  />

                  {/* 3. Background Tombol Tautan */}
                  <BackgroundEditor
                    title="3. Background Tombol Tautan"
                    bgType={settings.btn_bg_type}
                    bgValue={settings.btn_bg_value}
                    settingTypeKey="btn_bg_type"
                    settingValueKey="btn_bg_value"
                    onSaved={(type, value) =>
                      setSettings((s) =>
                        s ? { ...s, btn_bg_type: type, btn_bg_value: value } : s
                      )
                    }
                  />
                </div>
              </section>
            )}

            {activeTab === "links" && (
              <section className="content-section">
                <div className="section-header">
                  <h2 className="section-title">Tombol Tautan</h2>
                  <p className="section-desc">
                    Tambah, edit, hapus, dan atur urutan tombol tautan
                  </p>
                </div>

                <div className="section-body">
                  <LinkButtonEditor initialLinks={links} />
                </div>
              </section>
            )}

            {activeTab === "footer" && (
              <section className="content-section">
                <div className="section-header">
                  <h2 className="section-title">Footer</h2>
                  <p className="section-desc">
                    Atur teks footer / copyright
                  </p>
                </div>

                <div className="section-body">
                  <div className="admin-card">
                    <TextEditor
                      label="Teks Footer"
                      settingKey="footer_text"
                      initialValue={settings.footer_text}
                      placeholder="© 2025 Brand Name. All rights reserved."
                      multiline
                      onSaved={(v) =>
                        setSettings((s) => s ? { ...s, footer_text: v } : s)
                      }
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100dvh;
          background-color: #0D0D0D;
        }

        .sidebar {
          width: 220px;
          flex-shrink: 0;
          background-color: #1E1E1E;
          border-right: 1px solid #3A3A3A;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100dvh;
        }

        .sidebar-header {
          padding: 20px 16px 16px;
          border-bottom: 1px solid #3A3A3A;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 12px 10px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
          width: 100%;
        }
        .nav-item:hover {
          background-color: #2A2A2A;
          color: rgba(255,255,255,0.85);
        }
        .nav-item.active {
          background-color: #2A2A2A;
          color: #ffffff;
        }

        .sidebar-footer {
          padding: 12px 10px;
          border-top: 1px solid #3A3A3A;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .view-site-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .view-site-btn:hover {
          background-color: #2A2A2A;
          color: #ffffff;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(239,68,68,0.7);
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.15s ease;
        }
        .logout-btn:hover {
          background-color: rgba(239,68,68,0.1);
          color: #ef4444;
        }

        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow-y: auto;
        }

        .dashboard-content {
          padding: 28px 28px 40px;
          max-width: 700px;
          width: 100%;
        }

        .content-section { display: flex; flex-direction: column; gap: 20px; }

        .section-header { margin-bottom: 4px; }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #ffffff;
        }
        .section-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
        }

        .section-body { display: flex; flex-direction: column; gap: 14px; }
        .text-fields { display: flex; flex-direction: column; gap: 0; }

        .dashboard-loading {
          min-height: 100dvh;
          background-color: #0D0D0D;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          color: rgba(255,255,255,0.4);
          font-size: 14px;
        }
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid #3A3A3A;
          border-top-color: rgba(255,255,255,0.6);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .mobile-header { display: none; }

        @media (max-width: 768px) {
          .sidebar { display: none; }

          .mobile-header {
            display: block;
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: #1E1E1E;
            border-bottom: 1px solid #3A3A3A;
          }

          .mobile-tabs {
            display: flex;
            overflow-x: auto;
            padding: 8px 12px;
            gap: 6px;
            scrollbar-width: none;
          }
          .mobile-tabs::-webkit-scrollbar { display: none; }

          .mobile-tab {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 7px 12px;
            font-size: 12px;
            font-weight: 500;
            color: rgba(255,255,255,0.5);
            background: transparent;
            border: 1px solid #3A3A3A;
            border-radius: 8px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.15s ease;
          }
          .mobile-tab.active {
            background-color: #ffffff;
            color: #0D0D0D;
            border-color: #ffffff;
          }

          .dashboard-content {
            padding: 20px 16px 40px;
          }
        }
      `}</style>
    </>
  );
}
