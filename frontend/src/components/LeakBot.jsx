/**
 * LeakBot.jsx - Conversational Autonomous Action Bot
 * ==================================================
 * Role: Expert React Developer
 * Features:
 * - Floating Action Button (FAB) in the bottom-right (Intercom style).
 * - Message history state management.
 * - Auto-reply logic:
 *   - "campaign" or "spend" -> "I checked the database. The 'Summer Sale' campaign spent $500 more than yesterday, but clicks dropped by 15%. Would you like me to pause it?"
 *   - "Yes" -> "Done. Campaign paused via API." with green success confirmation bubble.
 * - Interactive suggestion chips and auto-scroll to bottom.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function LeakBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "msg-init",
      sender: "bot",
      text: "Hello! I'm LeakBot, your autonomous commerce assistant. Ask me about campaign performance, ad spend pacing, or anomalies.",
      timestamp: "Just now",
      isSuccess: false
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (overrideText) => {
    const textToSend = (overrideText || input).trim();
    if (!textToSend) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSuccess: false
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated response delay (600ms)
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let botResponse = "";
      let isSuccess = false;

      // Requirement: "If the user types anything containing the word 'campaign' or 'spend',
      // the bot should auto-reply with a simulated backend response:
      // 'I checked the database. The 'Summer Sale' campaign spent $500 more than yesterday, but clicks dropped by 15%. Would you like me to pause it?'"
      if (lower.includes("campaign") || lower.includes("spend")) {
        botResponse = "I checked the database. The 'Summer Sale' campaign spent $500 more than yesterday, but clicks dropped by 15%. Would you like me to pause it?";
      } 
      // Requirement: "Action: If the user types 'Yes', render a success bubble: 'Done. Campaign paused via API.'"
      else if (lower === "yes" || lower.startsWith("yes") || lower.includes("pause it")) {
        botResponse = "Done. Campaign paused via API.";
        isSuccess = true;
      } 
      // Fallback response with helpful guide
      else {
        botResponse = "I can inspect campaign spend velocity, detect conversion anomalies, and dispatch instant API pause remediations. Try typing 'Check campaign spend' or 'spend'.";
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSuccess: isSuccess
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const lastMessage = messages[messages.length - 1];
  const showYesChip = lastMessage?.sender === "bot" && lastMessage.text.includes("Would you like me to pause it?");

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans antialiased">
      
      {/* 1. Chat Window (Intercom / Linear style) */}
      {isOpen && (
        <div className="mb-4 w-[380px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white">LeakBot</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    ACTION BOT
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Autonomous Commerce Dispatch</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader Status Pill */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-time API & Database connected</span>
            </span>
            <span className="font-mono text-emerald-600 font-semibold">Ready</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";

              // Success bubble for "Done. Campaign paused via API."
              if (msg.isSuccess) {
                return (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 shadow-2xs space-y-2 animate-in zoom-in-95 duration-150"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-emerald-500 text-white shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold tracking-tight">
                        Automation Execution Confirmed
                      </span>
                    </div>

                    <p className="text-xs text-emerald-800 font-medium pl-6">
                      {msg.text}
                    </p>

                    <div className="pl-6 pt-1 flex items-center justify-between text-[10px] font-mono text-emerald-700">
                      <span>POST /api/campaigns/pause</span>
                      <span className="font-bold">STATUS 200 OK</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[80%] space-y-1`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? "bg-blue-600 text-white rounded-br-xs shadow-xs"
                          : "bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-2xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span
                      className={`block text-[10px] font-mono text-slate-400 ${
                        isUser ? "text-right" : "text-left pl-1"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
                <div className="flex gap-1 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px] font-mono">LeakBot checking database...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
            {showYesChip ? (
              <button
                onClick={() => handleSend("Yes")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer animate-pulse"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Yes, pause campaign</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleSend("Check campaign spend")}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer shrink-0"
                >
                  Audit campaign spend
                </button>
                <button
                  onClick={() => handleSend("What is our ad spend?")}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer shrink-0"
                >
                  Spend velocity
                </button>
              </>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-inner">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about campaigns, spend, or type 'Yes'..."
                className="flex-1 px-2 py-1 text-xs text-slate-900 bg-transparent focus:outline-none"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className={`p-2 rounded-lg text-white transition-all cursor-pointer ${
                  input.trim()
                    ? "bg-blue-600 hover:bg-blue-700 shadow-xs"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 2. Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-slate-900 shadow-slate-900/30"
            : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 ring-4 ring-blue-500/20"
        }`}
        title={isOpen ? "Close LeakBot" : "Open LeakBot Conversational Assistant"}
      >
        {isOpen ? (
          <>
            <X className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
            <span className="text-xs font-bold tracking-tight">Close Bot</span>
          </>
        ) : (
          <>
            <div className="relative">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-600 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-600" />
            </div>
            <span className="text-xs font-bold tracking-tight">Ask LeakBot</span>
          </>
        )}
      </button>

    </div>
  );
}
