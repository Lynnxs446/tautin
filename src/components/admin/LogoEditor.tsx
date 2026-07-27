"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpTrayIcon, TrashIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface LogoEditorProps {
  logoUrl: string;
  brandName: string;
  onSaved: (url: string) => void;
}

export default function LogoEditor({ logoUrl, brandName, onSaved }: LogoEditorProps) {
  const [currentUrl, setCurrentUrl] = useState(logoUrl);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMsg(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `logos/logo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setMsg({ type: "err", text: "Gagal upload logo." });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    const { error: dbError } = await supabase
      .from("settings")
      .upsert({ key: "logo_url", value: publicUrl });

    if (dbError) {
      setMsg({ type: "err", text: "Logo diupload tapi gagal disimpan ke database." });
    } else {
      setCurrentUrl(publicUrl);
      onSaved(publicUrl);
      setMsg({ type: "ok", text: "Logo berhasil diperbarui!" });
      setTimeout(() => setMsg(null), 2500);
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete() {
    const supabase = createClient();
    const { error } = await supabase
      .from("settings")
      .upsert({ key: "logo_url", value: "" });

    if (error) {
      setMsg({ type: "err", text: "Gagal menghapus logo." });
      return;
    }

    setCurrentUrl("");
    onSaved("");
    setMsg({ type: "ok", text: "Logo dihapus." });
    setTimeout(() => setMsg(null), 2500);
  }

  return (
    <div className="admin-card">
      <p className="section-label">Logo / Foto Profil</p>

      <div className="logo-editor-layout">
        {/* Preview */}
        <div className="logo-preview-box">
          {currentUrl ? (
            <div style={{ position: "relative", width: 80, height: 80 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUrl}
                alt="Logo"
                style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid #3A3A3A" }}
              />
            </div>
          ) : (
            <div className="logo-preview-placeholder">
              <UserCircleIcon className="w-10 h-10" style={{ color: "rgba(255,255,255,0.2)" }} />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="logo-controls">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden-input"
            onChange={handleUpload}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            {uploading ? "Mengunggah..." : "Upload Logo"}
          </button>

          {currentUrl && (
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
            >
              <TrashIcon className="w-4 h-4" />
              Hapus
            </button>
          )}
        </div>
      </div>

      {msg && (
        <p className={`status-msg ${msg.type}`} style={{ marginTop: 10 }}>
          {msg.text}
        </p>
      )}

      <style>{`
        .logo-editor-layout {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .logo-preview-box {
          flex-shrink: 0;
        }
        .logo-preview-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #2A2A2A;
          border: 2px dashed #3A3A3A;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-controls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .hidden-input { display: none; }
        .status-msg { font-size: 13px; }
        .status-msg.ok { color: #22c55e; }
        .status-msg.err { color: #ef4444; }
      `}</style>
    </div>
  );
}
