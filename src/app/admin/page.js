"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AlpineLogo from "@/components/AlpineLogo";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--admin-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.75rem",
            marginBottom: "0.75rem",
          }}>
            <div style={{
              width: "42px", height: "42px", background: "var(--admin-accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-barlow-condensed)", fontWeight: 800,
              fontSize: "20px", color: "#000",
            }}>A</div>
            <div style={{ textAlign: "left" }}>
              <div style={{
                fontFamily: "var(--font-barlow-condensed)", fontWeight: 800,
                fontSize: "20px", textTransform: "uppercase", letterSpacing: "0.05em",
                color: "var(--admin-text)",
              }}>Alpine</div>
              <div style={{
                fontFamily: "var(--font-barlow-condensed)", fontSize: "10px",
                textTransform: "uppercase", letterSpacing: "0.18em",
                color: "var(--admin-text-muted)",
              }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          borderRadius: "8px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "1.5rem 1.75rem",
            borderBottom: "1px solid var(--admin-border)",
          }}>
            <h1 style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontWeight: 700, fontSize: "22px",
              textTransform: "uppercase", letterSpacing: "0.05em",
              color: "var(--admin-text)", marginBottom: "0.25rem",
            }}>Enter Password To Login</h1>
            <p style={{ fontSize: "13px", color: "var(--admin-text-muted)" }}>
              Restricted access — administrators only.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ padding: "1.75rem" }}>
            <div className="admin-form-group">
              <label className="admin-label">Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>

            {error && (
              <div style={{
                background: "var(--admin-danger-dim)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "4px",
                padding: "0.65rem 0.875rem",
                marginBottom: "1rem",
                fontSize: "13px",
                color: "var(--admin-danger)",
              }}>{error}</div>
            )}

            <button
              type="submit"
              className="btn-admin btn-admin-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}
            >
              {loading ? (
                <><span className="spinner" style={{ width: "14px", height: "14px" }} /> Verifying...</>
              ) : "Login →"}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: "center", marginTop: "1.5rem",
          fontSize: "12px", color: "var(--admin-text-muted)",
        }}>
          Alpine Power Tools · Admin Access
        </p>
      </div>
    </div>
  );
}
