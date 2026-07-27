"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckIcon, SwatchIcon } from "@heroicons/react/24/outline";

interface TextEditorProps {
  label: string;
  settingKey: string;
  initialValue: string;
  placeholder?: string;
  multiline?: boolean;
  colorSettingKey?: string;
  initialColor?: string;
  onSaved?: (value: string, color?: string) => void;
}

export default function TextEditor({
  label,
  settingKey,
  initialValue,
  placeholder,
  multiline = false,
  colorSettingKey,
  initialColor = "#FFFFFF",
  onSaved,
}: TextEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [color, setColor] = useState(initialColor);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    const supabase = createClient();

    const updates = [
      supabase.from("settings").upsert({ key: settingKey, value }),
    ];

    if (colorSettingKey) {
      updates.push(
        supabase.from("settings").upsert({ key: colorSettingKey, value: color })
      );
    }

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      setMsg({ type: "err", text: "Gagal menyimpan." });
    } else {
      setMsg({ type: "ok", text: "Tersimpan!" });
      onSaved?.(value, colorSettingKey ? color : undefined);
      setTimeout(() => setMsg(null), 2500);
    }
    setSaving(false);
  }

  return (
    <div className="text-editor-field">
      <div className="text-editor-label-row">
        <label className="section-label" htmlFor={settingKey} style={{ marginBottom: 0 }}>
          {label}
        </label>

        {colorSettingKey && (
          <div className="font-color-picker" title="Warna Font">
            <SwatchIcon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-swatch-mini"
            />
            <span className="color-hex-text">{color.toUpperCase()}</span>
          </div>
        )}
      </div>

      {multiline ? (
        <textarea
          id={settingKey}
          className="input-base textarea-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          id={settingKey}
          type="text"
          className="input-base"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      )}

      <div className="text-editor-footer">
        {msg && (
          <span className={`status-msg ${msg.type}`}>{msg.text}</span>
        )}
        <button
          type="button"
          className="btn-primary save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <CheckIcon className="w-4 h-4" />
          {saving ? "..." : "Simpan"}
        </button>
      </div>

      <style>{`
        .text-editor-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .text-editor-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .font-color-picker {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: #2A2A2A;
          border: 1px solid #3A3A3A;
          border-radius: 6px;
          padding: 3px 8px;
        }
        .color-swatch-mini {
          width: 20px;
          height: 20px;
          padding: 0;
          border: 1px solid #3A3A3A;
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
        }
        .color-hex-text {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          font-family: monospace;
        }
        .textarea-input {
          resize: vertical;
          min-height: 80px;
          line-height: 1.5;
        }
        .text-editor-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .save-btn {
          padding: 8px 14px;
          font-size: 13px;
        }
        .status-msg { font-size: 12px; }
        .status-msg.ok { color: #22c55e; }
        .status-msg.err { color: #ef4444; }
      `}</style>
    </div>
  );
}
