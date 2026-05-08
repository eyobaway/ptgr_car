"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, RefreshCw, AlertCircle, Send, User, Bot, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function AISummaryCard() {
  const [displayText, setDisplayText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['admin-ai-summary'],
    queryFn: async () => {
      const res = await api.get('/ai/admin-summary');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await api.post('/ai/admin-query', {
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

  // Typewriter effect for initial summary
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

  // Scroll to bottom when history changes
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-0 p-[1px] rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 shadow-xl"
    >
      <div className="bg-white rounded-[23px] p-6 h-full relative flex flex-col min-h-[400px]">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 opacity-50 z-0" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-emerald-200">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              AI Dealer & Fleet Analyst
            </h2>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
              <Sparkles className="w-3 h-3" />
              Interactive
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRegenerate}
              disabled={isFetching || chatMutation.isPending}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col relative z-10">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-2 space-y-4 scroll-smooth"
            style={{ maxHeight: '400px' }}
          >
            {/* Initial Summary */}
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet Insight</span>
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[40%]" />
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1">Failed to load summary</p>
                  <p className="text-xs text-slate-500 mb-4 max-w-[200px]">We encountered an error while analyzing the platform stats.</p>
                  <button 
                    onClick={() => refetch()} 
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {chatHistory.length === 0 ? displayText : summary}
                  {chatHistory.length === 0 && displayText.length < summary.length && (
                    <span className="inline-block w-1.5 h-4 bg-emerald-500 ml-1 animate-pulse" />
                  )}
                </div>
              )}
            </div>

            {/* Chat History */}
            {chatHistory.map((chat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: chat.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  chat.role === 'user' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white border border-slate-100 text-slate-600 shadow-sm'
                }`}>
                   <div className="flex items-center gap-2 mb-1 opacity-70">
                     {chat.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                     <span className="text-[9px] font-bold uppercase tracking-wider">
                       {chat.role === 'user' ? 'You' : 'AI Analyst'}
                     </span>
                   </div>
                   <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{chat.content}</p>
                </div>
              </motion.div>
            ))}

            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span className="text-xs text-slate-400 font-bold animate-pulse">Analyst is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="relative group">
              <input
                type="text"
                placeholder="Ask follow-up questions about platform trends..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={chatMutation.isPending || isLoading}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-5 pr-14 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || chatMutation.isPending || isLoading}
                className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
              >
                {chatMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 text-center font-medium">
              Summarized insights are based on overall performance stats. Ask about users, dealers, or vehicles.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
