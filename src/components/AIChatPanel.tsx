"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Trash2, Bot, User } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import type { ChatMessage, LatLng } from "@/types";

interface AIChatPanelProps {
  location?: LatLng | null;
  preferences?: string[];
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1" role="status" aria-label="AI is thinking">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser ? "bg-emerald-500 text-white" : "bg-emerald-50 border border-emerald-100 text-emerald-600"
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed rounded-2xl shadow-sm ${
          isUser
            ? "bg-emerald-500 text-white rounded-tr-sm shadow-emerald-500/20"
            : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

export default function AIChatPanel({ location, preferences }: AIChatPanelProps) {
  const { messages, isLoading, sendMessage, clearMessages } = useChat({ location, preferences });
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage(text);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <section
      className="flex flex-col h-full overflow-hidden bg-transparent"
      aria-label="AI travel chat"
      style={{ minHeight: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/50 flex-shrink-0 bg-white/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-slate-900 text-sm font-bold leading-none tracking-tight">Gemini Assistant</p>
            <p className="text-[10px] text-emerald-600 mt-1 font-semibold uppercase tracking-wider">
              {isLoading ? "Thinking…" : "● Online"}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={clearMessages}
          aria-label="Clear chat"
          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar min-h-0 bg-gradient-to-b from-transparent to-white/20"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end gap-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <TypingDots />
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200/50 flex-shrink-0 bg-white/60 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <label htmlFor="chat-input" className="sr-only">Ask Gemini about travel</label>
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about places nearby…"
            autoComplete="off"
            disabled={isLoading}
            className="
              w-full bg-white border border-slate-200 rounded-full shadow-sm
              py-3 pl-4 pr-12 text-sm text-slate-900 placeholder-slate-400
              focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500
              transition-all duration-200 disabled:opacity-60
            "
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send"
            className="
              absolute right-1.5 w-9 h-9 rounded-full bg-emerald-500 text-white
              flex items-center justify-center shadow-md shadow-emerald-500/20
              hover:bg-emerald-600 active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150
            "
          >
            <Send className="w-4 h-4 -ml-0.5" />
          </button>
        </form>
      </div>
    </section>
  );
}
