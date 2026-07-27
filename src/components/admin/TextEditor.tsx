"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckIcon } from "@heroicons/react/24/outline";

interface TextEditorProps {
  label: string;
  settingKey: string;
  initialValue: string;
  placeholder?: string;
  multiline?: boolean;
  onSaved?: (value: string) => void;
}

export default function TextEditor({
  label,
  settingKey,
  initialValue,
  placeholder,
  multiline = false,
  onSaved,
}: TextEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("settings")
      .upsert({ key: settingKey, value });

    if (error) {
      setMsg({ type: "err", text: "Gagal menyimpan." });
    } else {
      setMsg({ type: "ok", text: "Tersimpan!" });
      onSaved?.(value);
      setTimeout(() => setMsg(null), 2500);
    }
    setSaving(false);
  }

  return (
    <div className="text-editor-field">
      <label className="section-label" htmlFor={settingKey}>
        {label}
      </label>

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
