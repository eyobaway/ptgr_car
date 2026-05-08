"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, RefreshCw, AlertCircle, Send, User, Bot, Loader2, Quote } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function DealerAISummary() {
  const [displayText, setDisplayText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['dealer-ai-summary'],
    queryFn: async () => {
      const res = await api.get('/ai/agent-summary');
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await api.post('/ai/agent-query', {
        message,
        history: chatHistory
      });
      return res.data.reply;
    },
    onSuccess: (reply) => {
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
      setInputValue("");
    }
  });

  const summary = data?.summary || "";

  // Typewriter effect
  useEffect(() => {
    if (summary && chatHistory.length === 0) {
      setDisplayText("");
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(summary.substring(0, i));
        i += 3;
        if (i > summary.length) clearInterval(interval);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [summary, chatHistory.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, chatMutation.isPending]);

  const handleSend = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;
    const msg = inputValue.trim();
    setChatHistory(prev => [...prev, { role: 'user', content: msg }]);
    chatMutation.mutate(msg);
    setInputValue("");
  };

  const handleRegenerate = () => {
    setChatHistory([]);
    setDisplayText("");
    refetch();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-4xl premium-shadow border border-slate-100 overflow-hidden mb-12 flex flex-col md:flex-row min-h-[450px]"
    >
      {/* Sidebar / Branding */}
      <div className="md:w-1/3 bg-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
            <BrainCircuit className="w-6 h-6 text-slate-500" />
          </div>
          <h2 className="text-2xl font-black mb-2">AI Dealer Coach</h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Your personal digital advisor. I analyze your vehicle performance and provide tailored growth strategies.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Portfolio Analysis</span>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={isFetching || chatMutation.isPending}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Regenerate Focus
          </button>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 md:p-8 flex flex-col h-[500px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-6 scroll-smooth scrollbar-hide">
          {/* Initial Summary */}
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-slate-50 opacity-10" />
            <div className="bg-slate-50 rounded-3xl p-6 relative z-10 border border-slate-100">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[40%]" />
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center py-4 gap-3 text-center">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                  <p className="text-sm font-bold text-slate-500">Could not initialize AI summary</p>
                  <button onClick={() => refetch()} className="text-xs font-black text-primary uppercase">Try Again</button>
                </div>
              ) : (
                <div className="text-slate-600 text-sm md:text-base leading-relaxed font-medium prose prose-slate max-w-none">
                  {chatHistory.length === 0 ? displayText : summary}
                  {chatHistory.length === 0 && displayText.length < summary.length && (
                    <span className="inline-block w-1 h-5 bg-primary ml-1 animate-pulse align-middle" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat History */}
          <AnimatePresence>
            {chatHistory.map((chat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] rounded-3xl p-5 ${chat.role === 'user'
                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                    : 'bg-white border border-slate-100 text-slate-600 shadow-sm'
                  }`}>
                  <div className="flex items-center gap-2 mb-2 opacity-70">
                    {chat.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {chat.role === 'user' ? 'Me' : 'Digital Coach'}
                    </span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed">{chat.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-slate-50 px-6 py-4 rounded-3xl flex items-center gap-4">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Analyzing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mt-8 relative drop-shadow-2xl">
          <input
            type="text"
            placeholder="Ask about your vehicle performance or growth tips..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={chatMutation.isPending || isLoading}
            className="w-full bg-white border border-slate-100 rounded-2xl py-5 pl-7 pr-16 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || chatMutation.isPending || isLoading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl hover:bg-primary transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
          >
            {chatMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
