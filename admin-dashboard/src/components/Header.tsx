"use client";

import { Search, Bell, LogOut, User, Settings, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  // Get initials from name
  const getInitials = (name?: string | null) => {
    if (!name) return "AD";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10 font-sans">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 focus:bg-white transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6 ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2.5 text-slate-400 hover:text-primary transition-all hover:bg-slate-50 rounded-2xl outline-none group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 mt-2 p-6 rounded-3xl border-slate-100 shadow-[0_20px_50px_rgba(22,66,60,0.12)] font-sans">
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:rotate-12">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-black text-primary mb-1">All Caught Up!</p>
              <p className="text-xs font-bold text-slate-400">You have no new notifications at this time.</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-4 border-l border-slate-100 group outline-none">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-primary leading-tight">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                  {(user as any)?.role || "Super Administrator"}
                </p>
              </div>
              <Avatar className="w-10 h-10 rounded-2xl border-2 border-white shadow-lg shadow-primary/10 transition-transform group-hover:scale-105 active:scale-95">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-primary text-white font-black text-xs rounded-2xl">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-64 mt-2 p-2 rounded-3xl border-slate-100 shadow-[0_20px_50px_rgba(22,66,60,0.12)] font-sans">
            <DropdownMenuLabel className="px-4 py-3">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Current User</p>
                <p className="text-sm font-black text-primary">{user?.name || "Admin"}</p>
                <p className="text-[11px] font-bold text-slate-400 truncate">{user?.email || "admin@ptgr.com"}</p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-slate-50 my-1 mx-2" />
            
            <Link href="/settings">
              <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer focus:bg-primary/5 focus:text-primary group transition-colors">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-focus:bg-primary/10 group-focus:text-primary transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">Account Settings</span>
              </DropdownMenuItem>
            </Link>
            
            <Link href="/settings">
              <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer focus:bg-primary/5 focus:text-primary group transition-colors">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-focus:bg-primary/10 group-focus:text-primary transition-colors">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">Security Logs</span>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator className="bg-slate-50 my-1 mx-2" />
            
            <DropdownMenuItem 
              onClick={() => signOut()}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer focus:bg-red-50 focus:text-red-600 group transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-red-50/50 flex items-center justify-center text-red-400 group-focus:bg-red-100 group-focus:text-red-600 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm">Sign Out System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

