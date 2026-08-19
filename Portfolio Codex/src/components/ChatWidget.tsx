"use client";

import { FormEvent, useState } from "react";

type Message = {
  sender: "user" | "assistant";
  text: string;
};

export default function ChatWidget() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Ask Nazmul's digital twin about his career, skills, education, or work history.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;

    const userMessage = { sender: "user" as const, text: question.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage.text }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Chat request failed.");
      }

      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: data.answer ?? "No answer returned." },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "I couldn't connect to the digital twin right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-800/75 bg-slate-950/80 p-8 shadow-[0_16px_80px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/90">Digital Twin</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Ask about my career</h2>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-300/15">
          <span className="text-xl font-semibold">AI</span>
        </div>
      </div>

      <div className="mt-8 space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/80 p-6">
        <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-2">
          {messages.map((message, index) => (
            <div
              key={`${message.sender}-${index}-${message.text.slice(0, 10)}`}
              className={`rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm ${
                message.sender === "user"
                  ? "bg-cyan-500/10 text-cyan-100 self-end"
                  : "bg-slate-800/90 text-slate-300"
              }`}
            >
              <p className="font-semibold uppercase tracking-[0.24em] text-xs text-slate-400">
                {message.sender === "user" ? "You" : "Digital Twin"}
              </p>
              <p className="mt-2 whitespace-pre-wrap">{message.text}</p>
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row">
        <label className="sr-only" htmlFor="question">
          Ask a question
        </label>
        <input
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Try: What was your role at SELISE?"
          className="min-w-0 flex-1 rounded-3xl border border-slate-800/80 bg-slate-900/90 px-5 py-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
    </div>
  );
}
