"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Car, Settings, LogOut, Mail, Newspaper } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/agents", label: "Dealers", icon: Users },
    { href: "/users", label: "Users", icon: Users },
    { href: "/messages", label: "Inquiries", icon: Mail },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/properties", label: "Vehicles", icon: Car },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 text-slate-700 flex flex-col h-screen fixed top-0 left-0 overflow-y-auto z-20 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-slate-50">
        <h1 className="text-2xl font-black tracking-wider flex items-center gap-2">
          <span className="text-primary">PTGR</span>
          <span className="text-slate-400 font-medium text-lg">Admin</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-6">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-primary text-white shadow-sm shadow-primary/20 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-primary"
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-50">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-primary rounded-xl transition-all w-full font-medium">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
