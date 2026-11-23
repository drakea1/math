"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const SUBJECTS = [
  "Addition",
  "Subtraction",
  "Multiplication",
  "Division",
  "Pre-Algebra",
  "Algebra 1",
  "Geometry",
  "Algebra 2",
  "Pre-Calculus",
  "Statistics",
  "Calculus",
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activePopup, setActivePopup] = useState(null); // "tiktok" | "email" | null
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/home");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!activePopup) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [activePopup]);

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField(null);
    }
  };

  if (loading || user) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        padding: "6.5rem 1.25rem 3rem",
        alignItems: "center",
        maxWidth: "880px",
        width: "100%",
        margin: "0 auto",
        color: "var(--text-main)",
        boxSizing: "border-box",
      }}
    >
      {/* --- FIXED BRAND HEADER (MATCHING LOGIN/SIGNUP) --- */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "var(--card-bg)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "1.1rem",
          paddingBottom: "0.85rem",
          borderBottom: "1px solid var(--surface-border)",
        }}
      >
        <div
          style={{
            fontWeight: "900",
            fontSize: "1.8rem",
            color: "var(--accent-neon)",
            textShadow: "0 0 10px var(--accent-neon-glow)",
            lineHeight: 1.1,
          }}
        >
          MathAround
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        style={{
          width: "100%",
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--surface-border)",
          borderRadius: "24px",
          padding: "2.25rem 1.5rem",
          textAlign: "center",
          marginBottom: "1.5rem",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--accent-neon)",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 0.5rem 0",
          }}
        >
          Come MathAround
        </p>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 2.85rem)",
            fontWeight: "800",
            letterSpacing: "-1px",
            margin: "0 0 0.85rem 0",
            lineHeight: 1.12,
          }}
        >
          Welcome to MathAround.
        </h1>

        <p
          style={{
            margin: "0 auto 1.75rem auto",
            maxWidth: "600px",
            fontSize: "0.98rem",
            lineHeight: 1.6,
            color: "var(--text-muted)",
          }}
        >
          Practice 11 math subjects from basic addition to Calculus, study
          unit-by-unit formulas and walkthroughs on our Learn page, and get
          step-by-step breakdowns with our AI Math Helper.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.85rem",
          }}
        >
          <Link
            href="/login-signup"
            className="btn-signin"
            style={{
              padding: "12px 24px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
            }}
          >
            Sign In / Sign Up
          </Link>

          <Link
            href="/subscription"
            style={{
              padding: "12px 22px",
              borderRadius: "12px",
              border: "1px solid var(--surface-border)",
              backgroundColor: "var(--surface-glass)",
              color: "var(--text-main)",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.95rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            View Pro Plans
          </Link>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--surface-border)",
            borderRadius: "20px",
            padding: "1.35rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "800",
              letterSpacing: "-0.4px",
              margin: "0 0 0.45rem 0",
            }}
          >
            11 Math Subjects
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              lineHeight: 1.55,
              color: "var(--text-muted)",
            }}
          >
            Build speed in basic operations and work through structured,
            progressive units from Pre-Algebra up to Calculus.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--surface-border)",
            borderRadius: "20px",
            padding: "1.35rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "800",
              letterSpacing: "-0.4px",
              margin: "0 0 0.45rem 0",
            }}
          >
            Learn Page &amp; Formula Guides
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              lineHeight: 1.55,
              color: "var(--text-muted)",
            }}
          >
            Check key formulas and step-by-step examples showing how to solve
            each unit before jumping into practice problems.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--surface-border)",
            borderRadius: "20px",
            padding: "1.35rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "800",
              letterSpacing: "-0.4px",
              margin: "0 0 0.45rem 0",
            }}
          >
            AI Math Helper
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              lineHeight: 1.55,
              color: "var(--text-muted)",
            }}
          >
            Ask any math question and get clear, step-by-step explanations with
            saved chat history for Pro members.
          </p>
        </div>
      </section>

      {/* 11 SUBJECTS LIST */}
      <section
        style={{
          width: "100%",
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--surface-border)",
          borderRadius: "20px",
          padding: "1.4rem",
          marginBottom: "1.5rem",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            fontSize: "1.15rem",
            fontWeight: "800",
            letterSpacing: "-0.4px",
            margin: "0 0 0.35rem 0",
          }}
        >
          All 11 Subjects
        </h2>
        <p
          style={{
            margin: "0 0 1rem 0",
            fontSize: "0.88rem",
            color: "var(--text-muted)",
          }}
        >
          Everything available inside MathAround:
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
          {SUBJECTS.map((subject) => (
            <span
              key={subject}
              style={{
                backgroundColor: "var(--surface-glass)",
                border: "1px solid var(--surface-border)",
                color: "var(--text-main)",
                padding: "0.45rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.84rem",
                fontWeight: "700",
              }}
            >
              {subject}
            </span>
          ))}
        </div>
      </section>

      {/* CLICKABLE CONTACT & SOCIAL POPUP BUTTONS */}
      <section
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <button
          type="button"
          onClick={() => setActivePopup("tiktok")}
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--surface-border)",
            color: "var(--text-main)",
            padding: "0.75rem 1.2rem",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "0.88rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>🎵</span>
          <span>TikTok: @matharoundapp</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePopup("email")}
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--surface-border)",
            color: "var(--text-main)",
            padding: "0.75rem 1.2rem",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "0.88rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>✉️</span>
          <span>Email: matharoundapp@gmail.com</span>
        </button>
      </section>

      {/* PUBLIC LEGAL FOOTER (MATCHING LOGIN/SIGNUP) */}
      <footer
        style={{
          marginTop: "auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.85rem",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.78rem",
          color: "var(--text-muted)",
        }}
      >
        <Link
          href="/subscription"
          style={{ color: "var(--text-muted)", textDecoration: "underline" }}
        >
          Pricing / Pro
        </Link>
        <span>•</span>
        <Link
          href="/terms-and-conditions"
          style={{ color: "var(--text-muted)", textDecoration: "underline" }}
        >
          Terms and Conditions
        </Link>
        <span>•</span>
        <Link
          href="/privacy"
          style={{ color: "var(--text-muted)", textDecoration: "underline" }}
        >
          Privacy Policy
        </Link>
      </footer>

      {/* TIKTOK / EMAIL POPUP MODAL */}
      {activePopup && (
        <div
          onClick={() => setActivePopup(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
            padding: "1rem",
            boxSizing: "border-box",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--surface-border)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "400px",
              padding: "1.6rem",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.55)",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.1rem", marginBottom: "0.5rem" }}>
              {activePopup === "tiktok" ? "🎵" : "✉️"}
            </div>

            <h3
              style={{
                margin: "0 0 0.4rem 0",
                fontSize: "1.25rem",
                fontWeight: "800",
                letterSpacing: "-0.4px",
                color: "var(--text-main)",
              }}
            >
              {activePopup === "tiktok" ? "MathAround on TikTok" : "Contact MathAround"}
            </h3>

            <p
              style={{
                margin: "0 0 1.25rem 0",
                fontSize: "0.88rem",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}
            >
              {activePopup === "tiktok"
                ? "Follow @matharoundapp for math tips, feature updates, and quick breakdowns."
                : "Need help, have feedback, or billing questions? Reach out anytime."}
            </p>

            <div
              style={{
                backgroundColor: "var(--surface-glass)",
                border: "1px solid var(--surface-border)",
                borderRadius: "12px",
                padding: "0.75rem 1rem",
                fontWeight: "700",
                fontSize: "0.95rem",
                color: "var(--accent-neon)",
                marginBottom: "1rem",
                wordBreak: "break-all",
              }}
            >
              {activePopup === "tiktok" ? "@matharoundapp" : "matharoundapp@gmail.com"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {activePopup === "tiktok" ? (
                <a
                  href="https://www.tiktok.com/@matharoundapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-signin"
                  style={{
                    width: "100%",
                    padding: "12px",
                    textDecoration: "none",
                    fontWeight: "700",
                    boxSizing: "border-box",
                  }}
                >
                  Open TikTok Profile
                </a>
              ) : (
                <>
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=matharoundapp@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-signin"
                    style={{
                      width: "100%",
                      padding: "12px",
                      textDecoration: "none",
                      fontWeight: "700",
                      boxSizing: "border-box",
                    }}
                  >
                    Open in Gmail
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "mailto:matharoundapp@gmail.com";
                    }}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "12px",
                      border: "1px solid var(--surface-border)",
                      backgroundColor: "var(--surface-glass)",
                      color: "var(--text-main)",
                      fontWeight: "700",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    Open Default Mail App
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    activePopup === "tiktok" ? "@matharoundapp" : "matharoundapp@gmail.com",
                    activePopup
                  )
                }
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: "12px",
                  border: "1px solid var(--surface-border)",
                  backgroundColor: "var(--surface-glass)",
                  color: "var(--text-main)",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                {copiedField === activePopup ? "Copied!" : "Copy to Clipboard"}
              </button>

              <button
                type="button"
                onClick={() => setActivePopup(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  fontWeight: "700",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  marginTop: "0.2rem",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}