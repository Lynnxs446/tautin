"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { KeyIcon, LockClosedIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function PasswordEditor() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (newPassword.length < 6) {
      setMsg({ type: "err", text: "Password minimal 6 karakter." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ type: "err", text: "Konfirmasi password tidak cocok." });
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMsg({ type: "err", text: error.message || "Gagal mengubah password." });
    } else {
      setMsg({ type: "ok", text: "Password berhasil diperbarui!" });
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setMsg(null), 3000);
    }
    setSaving(false);
  }

  return (
    <div className="admin-card">
      <div className="card-header-with-icon">
        <KeyIcon className="w-5 h-5" style={{ color: "rgba(255,255,255,0.7)" }} />
        <p className="section-label" style={{ margin: 0 }}>
          Ubah Password Admin
        </p>
      </div>

      <form onSubmit={handlePasswordChange} className="password-form" style={{ marginTop: 14 }}>
        <div className="form-field">
          <label className="form-label" htmlFor="new-password">
            Password Baru
          </label>
          <div className="input-wrapper">
            <LockClosedIcon className="input-icon" />
            <input
              id="new-password"
              type="password"
              className="input-with-icon"
              placeholder="Minimal 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="confirm-password">
            Konfirmasi Password Baru
          </label>
          <div className="input-wrapper">
            <LockClosedIcon className="input-icon" />
            <input
              id="confirm-password"
              type="password"
              className="input-with-icon"
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {msg && (
          <p className={`status-msg ${msg.type}`}>
            {msg.text}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={saving || !newPassword || !confirmPassword}
          style={{ width: "100%", marginTop: 4 }}
        >
          <CheckIcon className="w-4 h-4" />
          {saving ? "Memproses..." : "Ubah Password"}
        </button>
      </form>

      <style>{`
        .card-header-with-icon {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .password-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .form-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.35);
          pointer-events: none;
        }
        .input-with-icon {
          width: 100%;
          background-color: #2A2A2A;
          border: 1px solid #3A3A3A;
          border-radius: 8px;
          color: #ffffff;
          padding: 9px 14px 9px 38px;
          font-size: 13px;
          transition: border-color 0.2s ease;
        }
        .input-with-icon::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        .input-with-icon:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
        }
        .status-msg { font-size: 13px; }
        .status-msg.ok { color: #22c55e; }
        .status-msg.err { color: #ef4444; }
      `}</style>
    </div>
  );
}
