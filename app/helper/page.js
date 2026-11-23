"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function AIHelperPage() {
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Popup modal state for reviewing/resuming past chats
  const [selectedPastChat, setSelectedPastChat] = useState(null);

  // Professional delete confirmation modal state & custom error modal state
  const [chatToDelete, setChatToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const checkSize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) setDrawerOpen(false);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (!selectedPastChat && !chatToDelete && !errorMessage && !drawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedPastChat, chatToDelete, errorMessage, drawerOpen]);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", user.id)
        .single();

      if (profile) setIsPro(Boolean(profile.is_pro));

      fetchChats(user.id);
    }
    init();
  }, []);

  const fetchChats = async (userId) => {
    const { data, error } = await supabase
      .from("ai_chats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setChats(data);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading || !isPro) return;

    const questionText = inputQuery;
    setInputQuery("");
    setLoading(true);

    const newMessages = [...messages, { role: "user", content: questionText }];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/ai-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          messages: newMessages,
          chatId: currentChatId,
          isPro
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);

        if (!currentChatId && data.chatId) {
          setCurrentChatId(data.chatId);
        }

        fetchChats(user.id);
      } else {
        setErrorMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to get response from AI math helper.");
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    if (!isPro) return;
    setCurrentChatId(null);
    setMessages([]);
    setDrawerOpen(false);
  };

  const loadChat = (chat) => {
    setCurrentChatId(chat.id);
    if (chat.messages && Array.isArray(chat.messages) && chat.messages.length > 0) {
      setMessages(chat.messages);
    } else {
      setMessages([
        { role: "user", content: chat.question },
        { role: "assistant", content: chat.answer }
      ]);
    }
  };

  const promptDeleteChat = (chatId, e) => {
    e.stopPropagation();
    setChatToDelete(chatId);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    const { data, error } = await supabase
      .from("ai_chats")
      .delete()
      .eq("id", chatToDelete)
      .select();

    if (error) {
      console.error("Supabase Delete Error:", error);
      setErrorMessage(`Failed to delete chat: ${error.message}`);
      setChatToDelete(null);
      return;
    }

    if (!data || data.length === 0) {
      setErrorMessage("Delete blocked: RLS policies might be preventing deletion or the ID was not found.");
      setChatToDelete(null);
      return;
    }

    setChats((prevChats) => prevChats.filter((c) => c.id !== chatToDelete));

    if (currentChatId === chatToDelete) {
      setCurrentChatId(null);
      setMessages([]);
    }

    if (selectedPastChat?.id === chatToDelete) {
      setSelectedPastChat(null);
    }

    setChatToDelete(null);
  };

  const renderChatList = () => (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        minWidth: 0,
        paddingRight: "2px",
      }}
    >
      {chats.length === 0 ? (
        <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "10px 6px" }}>
          No recent chats yet.
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              setSelectedPastChat(chat);
              setDrawerOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "11px 12px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "13.5px",
              backgroundColor: currentChatId === chat.id ? "var(--surface-border)" : "transparent",
              color: "var(--text-main)",
              transition: "background 0.2s",
              minWidth: 0,
              flexShrink: 0,
            }}
          >
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>
              {chat.question || (chat.messages?.[0]?.content ?? "Untitled Chat")}
            </span>
            <button
              type="button"
              onClick={(e) => promptDeleteChat(chat.id, e)}
              title="Delete Chat"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "14px",
                padding: "2px 6px",
                borderRadius: "6px",
                marginLeft: "6px",
                flexShrink: 0,
              }}
            >
              🗑️
            </button>
          </div>
        ))
      )}
    </div>
  );

  const renderBubble = (role, content, key, maxW) => {
    const isUser = role === "user";
    return (
      <div
        key={key}
        style={{
          alignSelf: isUser ? "flex-end" : "flex-start",
          backgroundColor: isUser ? "#16a34a" : "var(--surface-glass)",
          border: isUser ? "none" : "1px solid var(--surface-border)",
          color: isUser ? "#ffffff" : "var(--text-main)",
          padding: isDesktop ? "13px 17px" : "11px 14px",
          borderRadius: "16px",
          maxWidth: maxW,
          minWidth: 0,
          overflowX: isUser ? "visible" : "auto",
          overflowWrap: "break-word",
          wordBreak: "normal",
          fontSize: "14px",
          lineHeight: "1.55",
          whiteSpace: isUser ? "pre-wrap" : "normal",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        {isUser ? (
          content
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ node, ...props }) => <p style={{ margin: "0 0 8px 0" }} {...props} />,
              ul: ({ node, ...props }) => <ul style={{ margin: "0 0 8px 0", paddingLeft: "18px" }} {...props} />,
              ol: ({ node, ...props }) => <ol style={{ margin: "0 0 8px 0", paddingLeft: "18px" }} {...props} />,
              li: ({ node, ...props }) => <li style={{ margin: "3px 0" }} {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    );
  };

  return (
    <div
      className="helper-shell"
      style={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        width: "100%",
        background: "var(--card-bg)",
        color: "var(--text-main)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* DESKTOP SIDEBAR: Chat History */}
      {isDesktop && (
        <div
          style={{
            width: "280px",
            height: "100%",
            flexShrink: 0,
            borderRight: "2px solid var(--surface-border)",
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            boxSizing: "border-box",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <button
            type="button"
            onClick={startNewChat}
            disabled={!isPro}
            style={{
              backgroundColor: isPro ? "#16a34a" : "var(--surface-border)",
              color: isPro ? "#ffffff" : "var(--text-muted)",
              fontWeight: "700",
              padding: "12px",
              borderRadius: "14px",
              border: "none",
              cursor: isPro ? "pointer" : "not-allowed",
              marginBottom: "16px",
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            + New Math Chat
          </button>

          <div
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              marginBottom: "8px",
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}
          >
            Recent Chats
          </div>

          {renderChatList()}
        </div>
      )}

      {/* MOBILE SLIDE-OVER DRAWER (GEMINI STYLE) */}
      {!isDesktop && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(3px)",
            zIndex: 9500,
            display: "flex",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "82%",
              maxWidth: "320px",
              height: "100%",
              backgroundColor: "var(--card-bg)",
              borderRight: "1px solid var(--surface-border)",
              padding: "1.15rem",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxSizing: "border-box",
              boxShadow: "8px 0 30px rgba(0, 0, 0, 0.25)",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontWeight: "800", fontSize: "1rem", color: "var(--text-main)" }}>
                Math Helper
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: "var(--surface-glass)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "999px",
                  width: "34px",
                  height: "34px",
                  color: "var(--text-main)",
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              onClick={startNewChat}
              disabled={!isPro}
              style={{
                width: "100%",
                backgroundColor: isPro ? "var(--surface-glass)" : "var(--surface-border)",
                color: isPro ? "var(--text-main)" : "var(--text-muted)",
                border: "1px solid var(--surface-border)",
                fontWeight: "700",
                padding: "12px 14px",
                borderRadius: "999px",
                cursor: isPro ? "pointer" : "not-allowed",
                fontSize: "13.5px",
                textAlign: "left",
                flexShrink: 0,
              }}
            >
              ✎ New chat
            </button>

            <div
              style={{
                fontSize: "11.5px",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginTop: "4px",
                flexShrink: 0,
              }}
            >
              Recent ({chats.length})
            </div>

            {renderChatList()}
          </div>
        </div>
      )}

      {/* MAIN CHAT AREA */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: isDesktop ? "24px" : "8px 14px 10px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* MINIMAL GEMINI-STYLE MOBILE HEADER */}
        {!isDesktop && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "2px 2px 8px",
              width: "100%",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open chat history"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-main)",
                  fontSize: "1.35rem",
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: "8px",
                  lineHeight: 1,
                }}
              >
                ☰
              </button>
              <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "var(--text-main)" }}>
                Helper
              </span>
            </div>

            <button
              type="button"
              onClick={startNewChat}
              disabled={!isPro}
              style={{
                background: "var(--surface-glass)",
                border: "1px solid var(--surface-border)",
                color: isPro ? "var(--text-main)" : "var(--text-muted)",
                fontWeight: "700",
                fontSize: "0.78rem",
                padding: "6px 12px",
                borderRadius: "999px",
                cursor: isPro ? "pointer" : "not-allowed",
              }}
            >
              + New
            </button>
          </div>
        )}

        {/* MESSAGES STREAM (INDEPENDENT SCROLL) */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            paddingBottom: "10px",
            paddingRight: isDesktop ? "6px" : "2px",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                margin: "auto",
                padding: isDesktop ? "1.5rem" : "2rem 1rem",
                color: "var(--text-muted)",
                maxWidth: "460px",
              }}
            >
              <h2
                style={{
                  fontSize: isDesktop ? "24px" : "22px",
                  fontWeight: "800",
                  marginBottom: "8px",
                  color: "var(--text-main)",
                  letterSpacing: "-0.02em",
                }}
              >
                MathAround AI Helper
              </h2>
              <p style={{ fontSize: "14px", lineHeight: "1.55" }}>
                Ask any math question from basic addition to calculus. Step-by-step breakdowns ready instantly.
              </p>
            </div>
          ) : (
            messages.map((msg, index) =>
              renderBubble(msg.role, msg.content, index, isDesktop ? "75%" : "88%")
            )
          )}
          {loading && (
            <div style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic", flexShrink: 0 }}>
              AI is breaking down the math steps...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* FLOATING PILL COMPOSER / PRO CARD + FOOTNOTE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "780px", margin: "0 auto", boxSizing: "border-box", flexShrink: 0 }}>
          {isPro ? (
            <form
              onSubmit={handleSendMessage}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "6px 8px 6px 16px",
                borderRadius: "999px",
                border: "1.5px solid var(--surface-border)",
                backgroundColor: "var(--surface-glass)",
                boxSizing: "border-box",
              }}
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Math Helper..."
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "8px 4px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "var(--text-main)",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#16a34a",
                  color: "#ffffff",
                  fontWeight: "700",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  flexShrink: 0,
                }}
              >
                Send
              </button>
            </form>
          ) : (
            <div
              style={{
                background: "var(--surface-glass)",
                border: "1.5px solid var(--surface-border)",
                borderRadius: "20px",
                padding: isDesktop ? "16px 20px" : "14px",
                display: "flex",
                flexDirection: isDesktop ? "row" : "column",
                alignItems: isDesktop ? "center" : "stretch",
                justifyContent: "space-between",
                gap: "12px",
                boxSizing: "border-box",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-main)",
                  textAlign: "left",
                  lineHeight: "1.45",
                }}
              >
                🔒 Upgrade to MathAround Pro to chat with the AI Math Helper and get step-by-step breakdowns.
              </p>
              <Link
                href="/subscription"
                style={{
                  backgroundColor: "#16a34a",
                  color: "#ffffff",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "13px",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                Upgrade to Pro
              </Link>
            </div>
          )}

          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "var(--text-muted)",
              textAlign: "center",
              lineHeight: "1.4",
            }}
          >
            Chats are stored in Supabase while active and can be deleted anytime. Avoid sharing sensitive personal info.{" "}
            <Link href="/terms-and-conditions" style={{ color: "var(--text-main)", textDecoration: "underline" }}>
              Terms and Conditions
            </Link>{" "}
            ·{" "}
            <Link href="/privacy" style={{ color: "var(--text-main)", textDecoration: "underline" }}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* PAST CHAT REVIEW MODAL SHOWING FULL HISTORY */}
      {selectedPastChat && (
        <div
          onClick={() => setSelectedPastChat(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
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
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--card-bg)",
              border: "2px solid var(--surface-border)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "650px",
              maxHeight: "85dvh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.15rem 1.25rem",
                borderBottom: "1px solid var(--surface-border)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)" }}>
                Chat Transcript Review
              </h2>
              <button
                type="button"
                onClick={() => setSelectedPastChat(null)}
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

            <div style={{ flex: 1, overflowY: "auto", padding: "1.15rem 1.25rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              {(selectedPastChat.messages && Array.isArray(selectedPastChat.messages) && selectedPastChat.messages.length > 0) ? (
                selectedPastChat.messages.map((m, idx) =>
                  renderBubble(m.role, m.content, idx, isDesktop ? "80%" : "90%")
                )
              ) : (
                <>
                  {renderBubble("user", selectedPastChat.question, "q", isDesktop ? "80%" : "90%")}
                  {renderBubble("assistant", selectedPastChat.answer, "a", isDesktop ? "80%" : "90%")}
                </>
              )}
            </div>

            <div
              style={{
                padding: "0.9rem 1.25rem",
                borderTop: "1px solid var(--surface-border)",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                background: "var(--card-bg)",
              }}
            >
              <button
                type="button"
                onClick={(e) => promptDeleteChat(selectedPastChat.id, e)}
                style={{
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontWeight: "700",
                  padding: "11px 16px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isPro) {
                    setErrorMessage("Pro subscription required to resume/continue chatting.");
                    return;
                  }
                  loadChat(selectedPastChat);
                  setSelectedPastChat(null);
                }}
                style={{
                  flex: 1,
                  minWidth: "160px",
                  backgroundColor: isPro ? "#16a34a" : "var(--surface-border)",
                  color: isPro ? "#ffffff" : "var(--text-muted)",
                  fontWeight: "700",
                  padding: "11px 12px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: isPro ? "pointer" : "not-allowed",
                  fontSize: "0.85rem",
                }}
              >
                {isPro ? "Load & Continue Chat" : "Pro Required to Resume"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFESSIONAL DELETE CONFIRMATION MODAL */}
      {chatToDelete && (
        <div
          onClick={() => setChatToDelete(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(5px)",
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
              background: "var(--card-bg)",
              border: "2px solid var(--surface-border)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "400px",
              padding: "1.75rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>⚠</div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)" }}>
              Delete Chat?
            </h3>
            <p style={{ margin: "0 0 1.35rem 0", fontSize: "13.5px", color: "var(--text-muted)", lineHeight: "1.5" }}>
              Are you sure you want to delete this chat thread? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setChatToDelete(null)}
                style={{
                  flex: 1,
                  backgroundColor: "var(--surface-border)",
                  color: "var(--text-main)",
                  fontWeight: "700",
                  padding: "11px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteChat}
                style={{
                  flex: 1,
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontWeight: "700",
                  padding: "11px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ERROR / LIMIT REACHED MODAL */}
      {errorMessage && (
        <div
          onClick={() => setErrorMessage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
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
              background: "var(--card-bg)",
              border: "2px solid var(--surface-border)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "420px",
              padding: "1.75rem",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                margin: "0 auto 1rem auto",
                fontWeight: "bold",
              }}
            >
              !
            </div>

            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "1.2rem",
                fontWeight: "800",
                color: "var(--text-main)",
                letterSpacing: "-0.02em",
              }}
            >
              Notice
            </h3>

            <p
              style={{
                margin: "0 0 1.5rem 0",
                fontSize: "13.5px",
                color: "var(--text-muted)",
                lineHeight: "1.55",
              }}
            >
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              style={{
                width: "100%",
                backgroundColor: "#16a34a",
                color: "#ffffff",
                fontWeight: "700",
                padding: "13px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}