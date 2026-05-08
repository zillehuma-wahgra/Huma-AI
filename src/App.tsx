/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Bot, User, Zap, Trash2, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const scrollRef = useRef<HTMLDivElement>(null);

  const models = [
    "llama-3.3-70b-versatile",
    "llama3-8b-8192",
    "mixtral-8x7b-32768",
    "gemma2-9b-it"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model
        }),
      });

      if (!response.ok) throw new Error("Failed to reach Groq server");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Could not connect to Groq. Please check your API key or connection." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-zinc-100 font-sans selection:bg-orange-500/30 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-zinc-800/10 blur-[100px] rounded-full translate-y-1/2 pointer-events-none"></div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-black/40 backdrop-blur-xl z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-md opacity-20 animate-pulse"></div>
            <div className="relative p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide flex items-center gap-2">
              HUMA'S INTELLIGENCE PORTAL
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[8px] bg-zinc-800 text-zinc-400 font-mono tracking-tighter uppercase">V2.0 PRO</span>
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-mono leading-none mt-1">Universal Language Support</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 transition-colors focus-within:border-orange-500/50">
            <Cpu className="w-3.5 h-3.5 text-zinc-500" />
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent text-[11px] font-mono text-zinc-400 focus:outline-none cursor-pointer hover:text-zinc-200 transition-colors uppercase"
            >
              {models.map(m => (
                <option key={m} value={m} className="bg-zinc-950 text-zinc-400">{m.split('-')[0]}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="p-2 text-zinc-600 hover:text-white hover:bg-zinc-900 rounded-lg transition-all"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-8 max-w-3xl mx-auto w-full custom-scrollbar z-10"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative mb-10"
            >
              <div className="absolute inset-0 bg-orange-600/10 blur-[40px] rounded-full"></div>
              <div className="relative w-20 h-20 bg-zinc-950 rounded-3xl flex items-center justify-center border border-zinc-800/10 shadow-2xl">
                <Bot className="w-10 h-10 text-zinc-400" />
              </div>
            </motion.div>
            
            <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="space-y-4"
            >
              <h2 className="text-3xl font-light tracking-tight text-white">
                Engineered for <span className="text-orange-500 font-medium">Huma</span>
              </h2>
              <p className="text-zinc-500 max-w-sm mx-auto text-sm leading-relaxed font-light">
                Welcome to your private neural gateway. Experience global-scale intelligence with the legendary speed of Groq, curated by <span className="text-zinc-300 font-medium">Huma</span>.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 pt-6">
                 {["English", "Urdu", "Hindi", "Arabic"].map(lang => (
                   <span key={lang} className="px-3 py-1 bg-zinc-950 border border-zinc-900 rounded-full text-[10px] text-zinc-600 font-mono tracking-widest uppercase">{lang} READY</span>
                 ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-4 max-w-[90%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border mt-1 
                    ${msg.role === "user" 
                      ? "bg-zinc-950 border-zinc-800 text-zinc-500 shadow-sm" 
                      : "bg-orange-500/10 border-orange-500/20 text-orange-500"}`}
                  >
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed relative
                    ${msg.role === "user" 
                      ? "bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-sm" 
                      : "bg-zinc-950 border border-zinc-900/50 text-zinc-300 backdrop-blur-sm"}`}
                  >
                    {msg.content}
                    {msg.role === "assistant" && (
                      <div className="absolute -top-6 left-0 text-[10px] font-mono text-zinc-600 tracking-wider">
                        HUMA_OS_CORE / {model.split('-')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 items-center pl-12"
              >
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase animate-pulse">Processing...</span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-6 relative z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black to-transparent -z-10 pointer-events-none h-40 -top-40"></div>
        
        <form 
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-zinc-900 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-1000 pointer-events-none"></div>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Neural query interface ready..."
            autoFocus
            autoComplete="off"
            className="relative w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-zinc-700/50 focus:ring-0 transition-all placeholder:text-zinc-700 text-sm font-light tracking-wide text-white z-10"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-orange-500 text-white rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 disabled:opacity-20 disabled:scale-100 transition-all duration-300 z-20"
          >
            <Send className="w-5 h-5 fill-current" />
          </button>
        </form>
        
        <div className="flex justify-center items-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase">Encryption Active</span>
          </div>
          <div className="h-3 w-px bg-zinc-900"></div>
          <p className="text-[9px] text-zinc-600 font-mono tracking-[0.3em] uppercase">
             Crafted with perfection by Huma
          </p>
        </div>
      </footer>
    </div>
  );
}

