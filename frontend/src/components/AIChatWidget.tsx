"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Car, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';


interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    matchedIds?: string[];
    matchedVehicles?: { id: string, title: string }[];
}

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello! I'm your AI Car Assistant. Ask me about vehicles, prices, dealers, or anything car-related — I'm here to help you find your perfect ride!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Extract vehicle ID from URL whether on a vehicle page or messages page with a tagged vehicle
    const getVehicleContextId = () => {
        if (pathname?.startsWith('/vehicle/')) {
            const parts = pathname.split('/');
            return parts[parts.length - 1]; // e.g. "123" from "/vehicle/123"
        }
        return searchParams?.get('vehicleId') || null;
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const currentVehicleId = getVehicleContextId();
            const response = await axios.post(`${API_URL}/ai/chat`, {
                message: input,
                contextVehicleId: currentVehicleId
            });
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.reply,
                sender: 'ai',
                matchedIds: response.data.matchedIds,
                matchedVehicles: response.data.matchedVehicles
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting. Please try again later.",
                sender: 'ai'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-80 sm:w-96 h-[500px] glass premium-shadow rounded-3xl flex flex-col overflow-hidden border border-slate-200/50"
                    >
                        {/* Header */}
                        <div className="p-5 bg-primary text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Bot size={20} className="animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight">AI Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">Powered by Gemini</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide bg-slate-50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-tr-none shadow-[0_4px_14px_0_rgba(22,66,60,0.2)]'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none premium-shadow font-medium'
                                        }`}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>

                                        {msg.matchedVehicles && msg.matchedVehicles.length > 0 ? (
                                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Curated Listings</p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {msg.matchedVehicles.map(veh => (
                                                        <Link
                                                            key={veh.id}
                                                            href={`/vehicle/${veh.id}`}
                                                            className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl text-xs hover:bg-white transition-all border border-slate-100 group/item hover:border-primary/20 hover:shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-2 text-slate-900 font-bold">
                                                                <Car size={14} className="text-primary flex-shrink-0" />
                                                                <span className="truncate max-w-[150px]">{veh.title}</span>
                                                            </div>
                                                            <div className="w-7 h-7 flex-shrink-0 rounded-full bg-white flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all shadow-sm">
                                                                <ArrowRight size={14} className="text-primary" />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : msg.matchedIds && msg.matchedIds.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Curated Listings</p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {msg.matchedIds.map(id => (
                                                        <Link
                                                            key={id}
                                                            href={`/vehicle/${id}`}
                                                            className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl text-xs hover:bg-white transition-all border border-slate-100 group/item hover:border-primary/20 hover:shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-2 text-slate-900 font-bold">
                                                                <Car size={14} className="text-primary" />
                                                                <span className="truncate max-w-[110px]">Listing #{id.substring(0, 8)}</span>
                                                            </div>
                                                            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all shadow-sm">
                                                                <ArrowRight size={14} className="text-primary" />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none flex items-center gap-3 premium-shadow">
                                        <Loader2 size={16} className="animate-spin text-primary" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Searching...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-5 bg-white border-t border-slate-100">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about cars, prices, dealers..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-6 pr-14 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-inner placeholder:text-slate-400"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-md"
                                >
                                    <Send size={18} className="ml-0.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary text-white p-5 rounded-3xl shadow-2xl flex items-center justify-center group relative overflow-hidden active:scale-95 transition-all"
            >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                {isOpen ? <X size={28} /> : <div className="relative"><Bot size={28} /><span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-primary animate-pulse" /></div>}
                {!isOpen && (
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 whitespace-nowrap font-black uppercase tracking-[0.2em] text-[10px]"
                    >
                        <span className="pl-3 pr-1">Contact AI</span>
                    </motion.span>
                )}
            </motion.button>
        </div>
    );
};

export default AIChatWidget;
