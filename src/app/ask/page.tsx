"use client";

import { useState, useRef, useEffect } from "react";
import { MarkdownText } from "@/components/MarkdownText";
import { Header } from "@/components/Header";
import { useApp } from "@/components/Providers";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const SUGGESTIONS_EN = [
  "Will it rain tomorrow in Mbeya?",
  "Best day to travel to Arusha this week?",
  "How wet was last year compared to now?",
  "Is it good for planting maize in Morogoro?",
];

const SUGGESTIONS_SW = [
  "Itanyesha kesho Mbeya?",
  "Siku bora ya kusafiri Arusha wiki hii?",
  "Je mwaka jana ulikuwa na mvua nyingi zaidi?",
  "Je ni vizuri kupanda mahindi Morogoro?",
];

export default function AskPage() {
  const { lang, region } = useApp();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = lang === "sw" ? SUGGESTIONS_SW : SUGGESTIONS_EN;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Msg = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          regionSlug: region.slug,
          lang,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content || "No response",
          sources: data.sources,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            lang === "sw"
              ? "Samahani, kuna tatizo. Jaribu tena."
              : "Sorry, something went wrong. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-4">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="text-brand" size={20} />
          <h1 className="font-display text-xl font-semibold">
            {lang === "sw" ? "Uliza Anga" : "Ask Anga"}
          </h1>
        </div>

        {messages.length === 0 && (
          <div className="mb-6">
            <p className="mb-3 text-sm text-ink-2">
              {lang === "sw"
                ? "Jaribu maswali haya:"
                : "Try these questions:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-pill border border-border bg-surface px-3 py-1.5 text-sm transition hover:border-brand/50 hover:bg-bg"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-brand text-white"
                    : "border border-border bg-surface"
                )}
              >
                {m.role === "assistant" ? <MarkdownText>{m.content}</MarkdownText> : <p className="whitespace-pre-wrap">{m.content}</p>}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.sources.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-bg/50 px-1.5 py-0.5 text-[10px] text-ink-2"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3">
                <Loader2 size={16} className="animate-spin text-brand" />
                <span className="text-sm text-ink-2">
                  {lang === "sw" ? "Anga anafikiri..." : "Anga is thinking..."}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="sticky bottom-20 flex gap-2 border-t border-border bg-bg pt-3 md:bottom-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === "sw"
                ? "Uliza kuhusu hali ya hewa..."
                : "Ask about the weather..."
            }
            className="flex-1 rounded-pill border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white transition disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
