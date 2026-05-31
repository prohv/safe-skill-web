"use client";

import {
  Home,
  ShoppingBag,
  FileText,
  Upload,
  Plus,
  Settings,
  LogOut,
} from "lucide-react";
import { NavBtn } from "./NavBtn";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-surface/90 backdrop-blur-xl border-t border-border-subtle">
      <div className="flex items-center gap-1">
        <NavBtn icon={Home} label="Home" href="/" />
        <NavBtn icon={ShoppingBag} label="Marketplace" href="/marketplace" />
        <NavBtn icon={FileText} label="Reports" href="/reports" />
        <NavBtn icon={Upload} label="Scan" href="/scan" />
      </div>

      <button className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-teal to-brand-violet flex items-center justify-center shadow-lg shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-transform animate-fab-pulse">
        <Plus className="w-5 h-5 text-white" />
      </button>

      <div className="flex items-center gap-1">
        <NavBtn icon={Settings} label="Settings" href="/settings" />
        <div className="p-2.5 rounded-xl opacity-30 cursor-not-allowed" title="Login coming soon">
          <LogOut className="w-5 h-5 text-text-muted" />
        </div>
      </div>
    </nav>
  );
}
