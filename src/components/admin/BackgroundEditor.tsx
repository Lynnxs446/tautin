"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { PhotoIcon, SwatchIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { BgType } from "@/lib/types";

interface BackgroundEditorProps {
  title: string;
  bgType: BgType;
  bgValue: string;
  settingTypeKey: string;
  settingValueKey: string;
  onSaved: (type: BgType, value: string) => void;
}

export default function BackgroundEditor({
  title,
  bgType,
  bgValue,
  settingTypeKey,
  settingValueKey,
  onSaved,
}: BackgroundEditorProps) {
  const [type, setType] = useState<BgType>(bgType);
  const [colorValue, setColorValue] = useState(
    bgType === "color" ? bgValue : "#0D0D0D"
  );
  const [imageUrl, setImageUrl] = useState(
    bgType === "image" ? bgValue : ""
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File): Promise<string | null> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `backgrounds/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("media")
      .upload(path, file, { upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setImageUrl(url);
    else setMsg({ type: "err", text: "Gagal upload gambar." });
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    const supabase = createClient();
    const finalValue = type === "color" ? colorValue : imageUrl;
    const updates = [
      supabase.from("settings").upsert({ key: settingTypeKey, value: type }),
      supabase.from("settings").upsert({ key: settingValueKey, value: finalValue }),
    ];
    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);
    if (hasError) {
      setMsg({ type: "err", text: "Gagal menyimpan. Coba lagi." });
    } else {
      setMsg({ type: "ok", text: "Tersimpan!" });
      onSaved(type, finalValue);
      setTimeout(() => setMsg(null), 2500);
    }
    setSaving(false);
  }

  return (
    <div className="admin-card">
      <p className="section-label">{title}</p>

      {/* Type toggle */}
      <div className="bg-type-toggle">
        <button
          type="button"
          className={`toggle-btn ${type === "color" ? "active" : ""}`}
          onClick={() => setType("color")}
        >
          <SwatchIcon className="w-4 h-4" />
          Warna
        </button>
        <button
          type="button"
          className={`toggle-btn ${type === "image" ? "active" : ""}`}
          onClick={() => setType("image")}
        >
          <PhotoIcon className="w-4 h-4" />
          Gambar
        </button>
      </div>

      {/* Color picker */}
      {type === "color" && (
        <div className="color-row">
          <input
            type="color"
            value={colorValue}
            onChange={(e) => setColorValue(e.target.value)}
            className="color-swatch-input"
          />
          <input
            type="text"
            className="input-base"
            value={colorValue}
            onChange={(e) => setColorValue(e.target.value)}
            placeholder="#0D0D0D"
            maxLength={7}
          />
        </div>
      )}

      {/* Image upload */}
      {type === "image" && (
        <div className="image-upload-area">
          {imageUrl && (
            <div className="image-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview" className="preview-img" />
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            {uploading ? "Mengunggah..." : "Upload Gambar"}
          </button>
          {imageUrl && (
            <p className="image-url-hint" title={imageUrl}>
              {imageUrl.split("/").pop()}
            </p>
          )}
        </div>
      )}

      {/* Status message */}
      {msg && (
        <p className={`status-msg ${msg.type}`}>{msg.text}</p>
      )}

      <button
        type="button"
        className="btn-primary"
        onClick={handleSave}
        disabled={saving || uploading}
        style={{ marginTop: 12, width: "100%" }}
      >
        {saving ? "Menyimpan..." : "Simpan"}
      </button>

      <style>{`
        .bg-type-toggle {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }
        .toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 500;
          border-radius: 8px;
          border: 1px solid #3A3A3A;
          background-color: #2A2A2A;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .toggle-btn.active {
          background-color: #ffffff;
          color: #0D0D0D;
          border-color: #ffffff;
        }
        .color-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }
        .color-swatch-input {
          width: 44px;
          height: 44px;
          padding: 2px;
          border: 1px solid #3A3A3A;
          border-radius: 8px;
          background: transparent;
          cursor: pointer;
          flex-shrink: 0;
        }
        .image-upload-area {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 4px;
        }
        .image-preview {
          width: 100%;
          height: 100px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #3A3A3A;
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .image-url-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .status-msg {
          font-size: 13px;
          margin-top: 8px;
        }
        .status-msg.ok { color: #22c55e; }
        .status-msg.err { color: #ef4444; }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}
