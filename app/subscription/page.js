"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { initializePaddle } from "@paddle/paddle-js";
import { supabase } from "../../supabaseClient";

const PADDLE_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;

export default function SubscriptionPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [paddle, setPaddle] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [cancelAt, setCancelAt] = useState("");
  const [subscriptionStartedAt, setSubscriptionStartedAt] = useState("");
  const [autoRenew, setAutoRenew] = useState(true);
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);

  // Lock background scroll while cancel modal is open
  useEffect(() => {
    if (showCancelModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCancelModal]);

  useEffect(() => {
    const checkTheme = () => {
      const darkActive =
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(darkActive);
    };
    checkTheme();

    async function initPaddle() {
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
      if (!clientToken) {
        console.error("Missing NEXT_PUBLIC_PADDLE_CLIENT_TOKEN");
        return;
      }

      const paddleInstance = await initializePaddle({
        environment: "production",
        token: clientToken,
      });
      setPaddle(paddleInstance);
    }
    initPaddle();

    async function getUserData() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        setLoading(false);
        return;
      }

      setUserEmail(user.email || "");
      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          "is_pro, subscription_id, cancel_at, subscription_started_at, auto_renew, latest_invoice_url"
        )
        .eq("id", user.id)
        .single();

      if (!profileError && profile) {
        setIsPro(Boolean(profile.is_pro));
        if (profile.subscription_id) setSubscriptionId(profile.subscription_id);
        if (profile.cancel_at) setCancelAt(profile.cancel_at);
        if (profile.subscription_started_at) {
          setSubscriptionStartedAt(profile.subscription_started_at);
        }
        if (profile.auto_renew !== undefined) setAutoRenew(profile.auto_renew);
        if (profile.latest_invoice_url) setInvoiceUrl(profile.latest_invoice_url);
      }

      setLoading(false);
    }
    getUserData();
  }, []);

  const handleCheckout = () => {
    if (!paddle) {
      alert("Paddle is still loading, please try again in a second.");
      return;
    }
    if (!PADDLE_PRICE_ID) {
      alert("Checkout configuration is missing. Please try again later.");
      console.error("Missing NEXT_PUBLIC_PADDLE_PRICE_ID");
      return;
    }
    if (!userEmail) {
      alert("Please log in first before upgrading!");
      return;
    }

    paddle.Checkout.open({
      items: [{ priceId: PADDLE_PRICE_ID, quantity: 1 }],
      customer: { email: userEmail },
      customData: { user_id: userId },
    });
  };

  const confirmCancelSubscription = async () => {
    setCancelling(true);
    setShowCancelModal(false);
    try {
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, subscriptionId }),
      });

      const data = await res.json();
      if (res.ok) {
        setAutoRenew(false);
        if (data.endsAt) setCancelAt(data.endsAt);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        Loading membership details...
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "0 20px",
          fontFamily: "inherit",
          color: "var(--text-main)",
        }}
      >
        {/* Header section */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span
            style={{
              color: "#16a34a",
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Choose Your Plan
          </span>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              marginTop: "4px",
              marginBottom: "8px",
              color: "var(--text-main)",
            }}
          >
            Unlock the Full Power of MathAround
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "500px", margin: "0 auto" }}>
            Compare plans and choose the experience that fits your learning pace.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {/* FREE PLAN CARD */}
          <div
            style={{
              background: "var(--card-bg)",
              border: "2px solid var(--surface-border)",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "var(--text-main)" }}>
                  Free Plan
                </h2>
                <span style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-main)" }}>$0</span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginBottom: "32px",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span>
                  <span>10-level daily limit</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span>
                  <span>Levels renew every 2 hours</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span>
                  <span>Access to core math practice boards</span>
                </div>
              </div>
            </div>

            {!isPro && (
              <div
                style={{
                  width: "100%",
                  backgroundColor: isDarkMode ? "#171717" : "#f1f5f9",
                  color: "var(--text-muted)",
                  fontWeight: "600",
                  padding: "14px",
                  borderRadius: "14px",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                Current Plan
              </div>
            )}
          </div>

          {/* PRO PLAN CARD */}
          <div
            style={{
              background: "var(--card-bg)",
              border: "2px solid #16a34a",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "0 10px 25px -5px rgba(22, 163, 74, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-12px",
                right: "24px",
                backgroundColor: "#16a34a",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "800",
                padding: "4px 10px",
                borderRadius: "20px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Recommended
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "var(--text-main)" }}>
                  MathAround Pro
                </h2>
                <div>
                  <span style={{ fontSize: "26px", fontWeight: "900", color: "var(--text-main)" }}>$8.99</span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>/mo</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginBottom: "32px",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span>
                  <span style={{ color: "var(--text-main)" }}>
                    <strong>Unlimited</strong> levels (no daily limits)
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span>
                  <span>No 2-hour timer wait periods</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span>
                  <span>Full access across all 11 math subjects</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span>
                  <span>Dedicated AI math helper for breakdowns, with a limit of 100 daily chat requests</span>
                </div>
              </div>
            </div>

            {/* Action */}
            {isPro ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: isDarkMode ? "rgba(22, 163, 74, 0.15)" : "#f0fdf4",
                    border: "1px solid #16a34a",
                    color: "#16a34a",
                    padding: "16px",
                    borderRadius: "14px",
                    fontSize: "13px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ fontWeight: "700", textAlign: "center", marginBottom: "2px" }}>
                    Active Pro Member 🎉
                  </div>

                  {subscriptionStartedAt && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                      <span>Member since:</span>
                      <strong style={{ color: "var(--text-main)" }}>
                        {new Date(subscriptionStartedAt).toLocaleDateString()}
                      </strong>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                    <span>Renewal Status:</span>
                    <strong style={{ color: autoRenew && !cancelAt ? "#16a34a" : "#f59e0b" }}>
                      {autoRenew && !cancelAt ? "Auto-renewing 🔄" : "Cancelling at period end ⏳"}
                    </strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                    <span>{cancelAt ? "Access ends:" : "Next billing date:"}</span>
                    <strong style={{ color: "var(--text-main)" }}>
                      {cancelAt ? new Date(cancelAt).toLocaleDateString() : "Active monthly"}
                    </strong>
                  </div>

                  {invoiceUrl && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "var(--text-muted)",
                        paddingTop: "6px",
                        borderTop: "1px solid var(--surface-border)",
                      }}
                    >
                      <span>Latest Invoice:</span>
                      <a
                        href={invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2563eb", fontWeight: "600", textDecoration: "underline" }}
                      >
                        Download PDF
                      </a>
                    </div>
                  )}
                </div>

                {autoRenew && !cancelAt && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={cancelling}
                    style={{
                      width: "100%",
                      background: "var(--card-bg)",
                      border: "2px solid var(--surface-border)",
                      color: "var(--text-main)",
                      fontWeight: "600",
                      padding: "12px",
                      borderRadius: "14px",
                      cursor: "pointer",
                      fontSize: "13px",
                      opacity: cancelling ? 0.7 : 1,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cancelling ? "Processing..." : "Turn off Auto-Renewal"}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={handleCheckout}
                  style={{
                    width: "100%",
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    fontWeight: "700",
                    padding: "14px",
                    borderRadius: "14px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "15px",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#15803d")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#16a34a")}
                >
                  Upgrade to Pro
                </button>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    lineHeight: "1.45",
                    color: "var(--text-muted)",
                    textAlign: "center",
                  }}
                >
                  Renews monthly at $8.99 + applicable taxes via Paddle until canceled. By upgrading, you agree to our{" "}
                  <Link
                    href="/terms-and-conditions"
                    style={{ color: "var(--text-main)", fontWeight: "600", textDecoration: "underline" }}
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    style={{ color: "var(--text-main)", fontWeight: "600", textDecoration: "underline" }}
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CANCEL MODAL POPUP */}
      {showCancelModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "1rem",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: "var(--card-bg)",
              border: "2px solid var(--surface-border)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "2rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800", color: "var(--text-main)" }}>
                Turn off auto-renewal?
              </h2>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Are you sure you want to turn off auto-renewal? Your Pro membership will remain active until the end of your
              current billing period.
            </p>

            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "10px 0 14px 0", lineHeight: "1.4" }}>
              See our{" "}
              <Link
                href="/terms-and-conditions"
                style={{ color: "var(--text-main)", fontWeight: "600", textDecoration: "underline" }}
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                style={{ color: "var(--text-main)", fontWeight: "600", textDecoration: "underline" }}
              >
                Privacy Policy
              </Link>{" "}
              for billing and data details.
            </p>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1,
                  background: "var(--card-bg)",
                  border: "2px solid var(--surface-border)",
                  color: "var(--text-main)",
                  fontWeight: "600",
                  padding: "12px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Keep Active
              </button>
              <button
                onClick={confirmCancelSubscription}
                style={{
                  flex: 1,
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontWeight: "600",
                  padding: "12px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Yes, Turn Off
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}