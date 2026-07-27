"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email atau password salah. Coba lagi.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <>
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-wrapper">
              <LockClosedIcon className="w-6 h-6" style={{ color: "#ffffff" }} />
            </div>
            <h1 className="login-title">Admin Login</h1>
            <p className="login-subtitle">
              Masuk ke panel admin Tautin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-wrapper">
                <EnvelopeIcon className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="input-with-icon"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <LockClosedIcon className="input-icon" />
                <input
                  id="password"
                  type="password"
                  className="input-with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="error-box">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary login-btn"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100dvh;
          background-color: #0D0D0D;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background-color: #1E1E1E;
          border: 1px solid #3A3A3A;
          border-radius: 16px;
          padding: 36px 32px;
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
          text-align: center;
        }

        .login-icon-wrapper {
          width: 48px;
          height: 48px;
          background-color: #2A2A2A;
          border: 1px solid #3A3A3A;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .login-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #ffffff;
        }

        .login-subtitle {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.45);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
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
          padding: 10px 14px 10px 38px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .input-with-icon::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .input-with-icon:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
        }

        .error-box {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 10px 14px;
        }

        .error-box p {
          font-size: 13px;
          color: #ef4444;
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          margin-top: 4px;
          font-size: 15px;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 28px 20px;
          }
        }
      `}</style>
    </>
  );
}
