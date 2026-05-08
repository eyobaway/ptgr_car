"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import api, { getFileUrl } from "@/lib/api";
import { Search, Send, MapPin, ArrowLeft, Loader2, MoreVertical, Home, Car, X, Sparkles, Wand2, ChevronDown, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useVehicle } from "@/hooks/useVehicles";
import Avatar from "@/components/Avatar";

interface Conversation {
    partner: {
        id: string;
        name: string;
        profileImage: string | null;
    };
    latestMessage: string;
    timestamp: Date;
    unreadCount: number;
}

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const { user, isLoading } = useAuth();
    const { socket, isConnected } = useSocket();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
    const [partnerInfo, setPartnerInfo] = useState<{ name: string, profileImage: string | null } | null>(null);
    const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
    const { data: activeVehicle } = useVehicle(activeVehicleId || "");
    const [isLoadingConvos, setIsLoadingConvos] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDrafting, setIsDrafting] = useState(false);
    const [showAIOptions, setShowAIOptions] = useState(false);
    const [suggestion, setSuggestion] = useState("");
    const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial load: Fetch conversations
    useEffect(() => {
        if (!user?.id) return;
        const fetchConversations = async () => {
            try {
                const res = await api.get("/messages/conversations");
                setConversations(res.data);

                // If a user just loaded the page and there's a param ?userId=X from a property page
                const params = new URLSearchParams(window.location.search);
                const queryUserId = params.get('userId');
                const queryVehicleId = params.get('vehicleId');

                if (queryUserId) {
                    setActivePartnerId(queryUserId);
                    if (queryVehicleId) {
                        setActiveVehicleId(queryVehicleId);
                    }
                } else if (res.data.length > 0 && !activePartnerId) {
                    // Auto-select first conversation ONLY if none selected yet
                    setActivePartnerId(res.data[0].partner.id);
                }
            } catch (err) {
                console.error("Failed to load conversations:", err);
            } finally {
                setIsLoadingConvos(false);
            }
        };
        fetchConversations();
    }, [user?.id]); // Use user?.id for stability

    // Load messages when active partner changes
    useEffect(() => {
        if (!activePartnerId || !user?.id) {
            setPartnerInfo(null);
            return;
        }

        // Try to find in existing conversations first
        const existingConvo = conversations.find(c => c.partner.id === activePartnerId);
        if (existingConvo) {
            setPartnerInfo(existingConvo.partner);
        } else {
            // Fetch partner info from server if not in local list
            api.get(`/users/${activePartnerId}`).then(res => {
                setPartnerInfo(res.data);
            }).catch(() => {
                setPartnerInfo({ name: "User", profileImage: null });
            });
        }

        const loadMessages = async () => {
            setIsLoadingMessages(true);
            try {
                const res = await api.get(`/messages/${activePartnerId}`);
                setMessages(res.data);
                scrollToBottom();

                // Clear unread count for this conversation in the sidebar
                setConversations(prev => {
                    const newConvos = prev.map(c =>
                        c.partner.id === activePartnerId ? { ...c, unreadCount: 0 } : c
                    );

                    // Dispatch event to Navbar
                    const totalUnread = newConvos.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
                    window.dispatchEvent(new CustomEvent('updateUnreadCount', { detail: { count: totalUnread } }));

                    return newConvos;
                });
            } catch (err) {
                console.error("Failed to load messages:", err);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        loadMessages();
    }, [activePartnerId, user?.id]); // Use user?.id for stability

    // Setup Socket listener for INCOMING messages
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (msg: Message & { sender: any }) => {
            // If the message is from the active partner, append it immediately
            if (msg.senderId === activePartnerId) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();

                // Mark as read immediately on the server
                socket.emit("markAsRead", { senderId: msg.senderId });
            }

            // Update the sidebar conversation list regardless
            setConversations(prev => {
                const existingIndex = prev.findIndex(c => c.partner.id === msg.senderId);
                const unreadIncrement = msg.senderId === activePartnerId ? 0 : 1;

                if (existingIndex >= 0) {
                    const newConvos = [...prev];
                    newConvos[existingIndex] = {
                        ...newConvos[existingIndex],
                        latestMessage: msg.content,
                        timestamp: new Date(msg.createdAt),
                        unreadCount: newConvos[existingIndex].unreadCount + unreadIncrement
                    };

                    if (unreadIncrement > 0) {
                        window.dispatchEvent(new CustomEvent('updateUnreadCount', { detail: { delta: 1 } }));
                    }

                    // Move to top
                    const updated = newConvos.splice(existingIndex, 1)[0];
                    return [updated, ...newConvos];
                } else {
                    // It's a brand new conversation from someone else
                    if (unreadIncrement > 0) {
                        window.dispatchEvent(new CustomEvent('updateUnreadCount', { detail: { delta: 1 } }));
                    }

                    return [{
                        partner: msg.sender,
                        latestMessage: msg.content,
                        timestamp: new Date(msg.createdAt),
                        unreadCount: unreadIncrement
                    }, ...prev];
                }
            });
        };

        const handleMessageSent = (msg: Message) => {
            // When we successfully emit a msg, the server echoes it back here so we can inject into our own UI
            if (msg.receiverId === activePartnerId) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
            }

            // Update sidebar
            setConversations(prev => {
                const existingIndex = prev.findIndex(c => c.partner.id === msg.receiverId);
                if (existingIndex >= 0) {
                    const newConvos = [...prev];
                    newConvos[existingIndex] = {
                        ...newConvos[existingIndex],
                        latestMessage: msg.content,
                        timestamp: new Date(msg.createdAt)
                    };
                    const updated = newConvos.splice(existingIndex, 1)[0];
                    return [updated, ...newConvos];
                }
                return prev; // Brand new outgoing conversation (handled below manually)
            });
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("messageSent", handleMessageSent);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("messageSent", handleMessageSent);
        };
    }, [socket, activePartnerId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !activePartnerId || !socket) return;

        const content = messageInput.trim();
        setMessageInput(""); // Optimistic clear

        // If this is a brand new conversation that wasn't in the sidebar, we might need a dummy sidebar entry first
        const isNewPartner = !conversations.some(c => c.partner.id === activePartnerId);

        socket.emit("sendMessage", {
            receiverId: activePartnerId,
            content
        });

        if (isNewPartner) {
            // A small hack: if we start a chat with someone not on our sidebar, we fetch their basic details
            // Realistically, the server's messageSent echo will only contain their ID unless we alter it.
            // We just wait for page reload or we can fetch the user details here.
            try {
                const userRes = await api.get(`/users/${activePartnerId}`);
                setConversations(prev => [{
                    partner: userRes.data,
                    latestMessage: content,
                    timestamp: new Date(),
                    unreadCount: 0
                }, ...prev]);
            } catch (err) { }
        }
    };
    
    const handleAIDraft = async (type: string) => {
        setIsDrafting(true);
        setShowAIOptions(false);
        try {
            const res = await api.post("/ai/draft", {
                type,
                vehicleContext: activeVehicle ? {
                    address: activeVehicle.address,
                    city: activeVehicle.city,
                    price: activeVehicle.price,
                    type: activeVehicle.type
                } : null,
                lastMessages: messages.slice(-5).map(m => ({
                    role: m.senderId === user?.id ? 'user' : 'dealer',
                    content: m.content
                }))
            });
            if (res.data.draft) {
                setMessageInput(res.data.draft);
            }
        } catch (err) {
            console.error("Failed to generate AI draft:", err);
            alert("AI Suggestion is currently unavailable.");
        } finally {
            setIsDrafting(false);
        }
    };

    /* AI suggestions disabled for now per user request
    useEffect(() => {
        const lastChar = messageInput.slice(-1);
        const isWordEnd = lastChar === " " || /[.,!?;:]/.test(lastChar);

        // Very conservative: 10+ chars AND typed a space/punctuation to finish a word
        if (!messageInput || messageInput.trim().length < 10 || !isWordEnd) {
            setSuggestion("");
            return;
        }

        if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current);
        const controller = new AbortController();

        suggestionTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await api.post("/ai/suggest", {
                    currentText: messageInput,
                    propertyContext: activeProperty ? {
                        address: activeProperty.address,
                        city: activeProperty.city
                    } : null,
                    lastMessages: messages.slice(-5).map(m => ({
                        role: m.senderId === user?.id ? 'user' : 'dealer',
                        content: m.content
                    }))
                }, { signal: controller.signal });
                
                if (res.data.suggestion) {
                    setSuggestion(res.data.suggestion.trim());
                }
            } catch (err: any) {
                if (err.name === 'CanceledError' || err.name === 'AbortError') return;
                // silently fail for other errors
            }
        }, 1500); // 1.5s debounce (very conservative to avoid API abuse)

        return () => {
            if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current);
            controller.abort();
        };
    }, [messageInput, activeProperty, messages, user?.id]);
    */

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab' && suggestion) {
            e.preventDefault();
            // We ensure there's a space if suggestion doesn't start with space and messageInput doesn't end with one
            const needsSpace = !messageInput.endsWith(' ') && !suggestion.startsWith(' ') && !suggestion.match(/^[.,!?;:]/);
            setMessageInput(prev => prev + (needsSpace ? ' ' : '') + suggestion);
            setSuggestion("");
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoadingConvos || isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
                <p className="text-slate-500 font-bold text-xl">Please log in to view your messages.</p>
                <Link
                    href="/login"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                >
                    Login Now
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 px-4 md:px-8 max-w-[1600px] mx-auto">
            <div className="bg-white rounded-4xl premium-shadow border border-slate-100 flex h-[calc(100vh-140px)] overflow-hidden relative">

                {/* ── Left Sidebar: Conversations ── */}
                <div className={cn(
                    "w-full md:w-[380px] shrink-0 border-r border-slate-100 flex flex-col bg-slate-50/50",
                    activePartnerId ? "hidden md:flex" : "flex"
                )}>
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-slate-100">
                        <h1 className="text-2xl font-black text-slate-900 mb-6">Messages</h1>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin">
                        {filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm font-medium">
                                No conversations found.
                            </div>
                        ) : (
                            filteredConversations.map((convo) => (
                                <button
                                    key={convo.partner.id}
                                    onClick={() => setActivePartnerId(convo.partner.id)}
                                    className={cn(
                                        "w-full p-5 flex items-start gap-4 hover:bg-white transition-colors border-l-4 text-left border-b border-slate-100/50",
                                        activePartnerId === convo.partner.id ? "bg-white border-l-primary shadow-sm relative z-10" : "border-l-transparent"
                                    )}
                                >
                                    <div className="relative shrink-0">
                                        <Avatar 
                                            src={convo.partner.profileImage} 
                                            name={convo.partner.name} 
                                            size="lg" 
                                        />
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-slate-900 truncate pr-2">{convo.partner.name}</h3>
                                            <span className="text-xs text-slate-400 shrink-0 font-medium">
                                                {format(new Date(convo.timestamp), "MMM d")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 truncate mt-0.5">
                                            {convo.latestMessage}
                                        </p>
                                    </div>

                                    {convo.unreadCount > 0 && (
                                        <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-3 shadow-sm">
                                            {convo.unreadCount}
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* ── Main Chat Window ── */}
                <div className={cn(
                    "flex-1 flex flex-col bg-white",
                    !activePartnerId ? "hidden md:flex" : "flex"
                )}>
                    {activePartnerId ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-[88px] shrink-0 border-b border-slate-100 p-6 flex items-center justify-between bg-white z-10">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setActivePartnerId(null)}
                                        className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 md:hidden"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>

                                    <Avatar 
                                        src={partnerInfo?.profileImage} 
                                        name={partnerInfo?.name || "User"} 
                                        size="md" 
                                    />
                                    <div>
                                        <h2 className="font-bold text-lg text-slate-900">{partnerInfo?.name || (isLoadingMessages ? "Loading..." : "User")}</h2>
                                        {isConnected ? (
                                            <span className="text-xs font-semibold text-green-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Connected</span>
                                        ) : (
                                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" />Connecting...</span>
                                        )}
                                    </div>
                                </div>

                                <button className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages Scroll Area */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin bg-slate-50/30">
                                {activeVehicle && (
                                    <div className="mb-6 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
                                        <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 shadow-sm max-w-lg">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <Car size={20} className="text-primary" />
                                            </div>
                                            <div className="min-w-0 pr-2">
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Regarding Vehicle</div>
                                                <div className="text-sm font-bold text-slate-900 truncate">{activeVehicle.address}, {activeVehicle.city}</div>
                                            </div>
                                            <button 
                                                onClick={() => setActiveVehicleId(null)}
                                                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-all"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {isLoadingMessages ? (
                                    <div className="h-full flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex flex-col items-center justify-center mb-4">
                                            <Send className="w-8 h-8 text-primary shadow-sm" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">Say hello!</h3>
                                        <p className="text-slate-500 max-w-[250px] text-sm">You have started a new conversation. Send a message to get things rolling.</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMine = msg.senderId === user?.id;
                                        const isLastInGroup = idx === messages.length - 1 || messages[idx + 1]?.senderId !== msg.senderId;
                                        const showAvatar = isLastInGroup;

                                        return (
                                            <div key={msg.id} className={cn("flex w-full mb-1", isMine ? "justify-end" : "justify-start")}>
                                                <div className={cn("flex gap-3 max-w-[75%]", isMine ? "flex-row-reverse" : "flex-row")}>
                                                    <div className="w-8 h-8 shrink-0 mt-auto">
                                                        {showAvatar && (
                                                            <Avatar 
                                                                src={isMine ? ((user as any)?.profileImage || (user as any)?.image) : partnerInfo?.profileImage} 
                                                                name={isMine ? (user?.name || "Me") : (partnerInfo?.name || "User")} 
                                                                size="sm" 
                                                            />
                                                        )}
                                                    </div>
                                                    <div className={cn(
                                                        "px-5 py-3.5 rounded-3xl text-sm md:text-base leading-relaxed wrap-break-word",
                                                        isMine
                                                            ? "bg-primary text-white rounded-br-sm shadow-[0_4px_14px_0_rgba(var(--primary-rgb),0.2)]"
                                                            : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm shadow-sm"
                                                    )}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input Area */}
                            <div className="p-4 md:p-6 bg-white border-t border-slate-100 z-10 relative">
                                {showAIOptions && (
                                    <div className="absolute bottom-full left-6 mb-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">AI Drafting Assistant</div>
                                        <button 
                                            onClick={() => handleAIDraft('inquiry')}
                                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-3 transition-colors"
                                        >
                                            <Sparkles size={16} className="text-primary" />
                                            Professional Inquiry
                                        </button>
                                        <button 
                                            onClick={() => handleAIDraft('professional_response')}
                                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-3 transition-colors"
                                        >
                                            <Wand2 size={16} className="text-purple-500" />
                                            Smart Response
                                        </button>
                                        <button 
                                            onClick={() => handleAIDraft('follow_up')}
                                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-3 transition-colors"
                                        >
                                            <RefreshCw size={16} className="text-blue-500" />
                                            Follow-up Message
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                                    <div className="flex-1 relative flex items-center">
                                        <div className="absolute left-3 z-20">
                                            <button
                                                type="button"
                                                onClick={() => setShowAIOptions(!showAIOptions)}
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                                    showAIOptions ? "bg-primary text-white shadow-lg rotate-12" : "bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5"
                                                )}
                                                title="AI Magic"
                                            >
                                                {isDrafting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                            </button>
                                        </div>
                                        <div className="relative w-full overflow-hidden rounded-full bg-slate-50 border border-slate-100 focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary shadow-inner transition-all flex items-center">
                                            <input
                                                type="text"
                                                value={messageInput}
                                                onChange={(e) => {
                                                    setMessageInput(e.target.value);
                                                    setSuggestion("");
                                                }}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Type your message..."
                                                className="w-full bg-transparent border-none py-4 pl-14 pr-14 text-slate-900 font-medium outline-none z-10 relative placeholder:text-slate-400"
                                            />
                                            {suggestion && (
                                                <div 
                                                    className="absolute inset-0 flex items-center pl-14 pr-14 pointer-events-none text-slate-400 font-medium overflow-hidden whitespace-nowrap z-0"
                                                >
                                                    <span className="text-transparent">{messageInput}</span>
                                                    <span>{(!messageInput.endsWith(' ') && !suggestion.startsWith(' ') && !suggestion.match(/^[.,!?;:]/)) ? ' ' : ''}{suggestion} <span className="text-[10px] uppercase font-bold text-slate-300 ml-2 py-0.5 px-1.5 border border-slate-200 rounded-md">TAB</span></span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!messageInput.trim() || !isConnected}
                                            className="absolute right-2 z-20 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-all disabled:opacity-30 shadow-md group"
                                        >
                                            <Send size={18} className="ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                    {!isConnected && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full absolute -top-5 left-6 animate-pulse border border-red-100">
                                            <AlertCircle size={10} /> Disconnected
                                        </div>
                                    )}
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50/50">
                            <div className="w-24 h-24 mb-6 relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping blur-xl"></div>
                                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
                                    <Send className="w-8 h-8 text-primary -translate-x-0.5" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-700 mb-2">Your Messages</h2>
                            <p className="text-slate-400 font-medium tracking-wide">Select a conversation from the sidebar to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
