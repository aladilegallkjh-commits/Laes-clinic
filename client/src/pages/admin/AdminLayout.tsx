import React, { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  FolderHeart,
  Wallet,
  Globe,
  BarChart3,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

import logoMark from "@/assets/logo-cropped.png";

export type AdminView =
  | "dashboard"
  | "appointments"
  | "clients"
  | "finance"
  | "cms"
  | "analytics"
  | "whatsapp";

interface SidebarItem {
  id: AdminView;
  label: string;
  icon: React.ReactNode;
  emoji: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "dashboard",    label: "Dashboard",          icon: <LayoutDashboard size={18} />, emoji: "📊" },
  { id: "appointments", label: "Agenda",              icon: <CalendarDays size={18} />,   emoji: "📅" },
  { id: "clients",      label: "Prontuário",          icon: <FolderHeart size={18} />,    emoji: "📂" },
  { id: "finance",      label: "Financeiro",          icon: <Wallet size={18} />,         emoji: "💰" },
  { id: "cms",          label: "Gestão do Site",      icon: <Globe size={18} />,          emoji: "🌐" },
  { id: "analytics",    label: "Métricas",            icon: <BarChart3 size={18} />,      emoji: "📈" },
  { id: "whatsapp",     label: "WhatsApp",            icon: <MessageSquare size={18} />,  emoji: "💬" },
];

interface AdminLayoutProps {
  children: (view: AdminView) => React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.reload();
  };

  const activeItem = sidebarItems.find((i) => i.id === activeView);

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-transparent">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─────────── SIDEBAR ─────────── */}
      <aside
        className={`
          fixed lg:relative z-30 flex flex-col h-full
          bg-white/80 backdrop-blur-xl
          border-r border-gray-200/60
          shadow-[4px_0_24px_rgba(0,0,0,0.06)]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-[248px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ── Logo ── */}
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100/80
            ${collapsed ? "justify-center" : ""}`}
        >
          <img
            src={logoMark}
            alt="LAES Clinic"
            className="w-9 h-9 object-contain flex-shrink-0 rounded-lg"
          />
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-bold text-[#1a3a2a] text-sm tracking-wide">LAES Clinic</p>
              <p className="text-[10px] text-[#7aab92] uppercase tracking-widest font-medium">Painel Admin</p>
            </div>
          )}
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-2">
          {sidebarItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id); setMobileOpen(false); }}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 relative group
                  ${isActive
                    ? "bg-[#2d6a4f] text-white shadow-[0_4px_12px_rgba(45,106,79,0.35)]"
                    : "text-gray-500 hover:bg-[#f0f8f4] hover:text-[#2d6a4f]"
                  }
                `}
              >
                <span
                  className={`flex-shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-[#2d6a4f]"
                  }`}
                >
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1a3a2a] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-lg z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Collapse toggle ── */}
        <div className="px-2 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium
              text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors
              ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Recolher</span></>}
          </button>
        </div>

        {/* ── Logout ── */}
        <div className="px-2 pb-4 border-t border-gray-100/80 pt-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors
              ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* ─────────── MAIN ─────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-bold text-[#1a3a2a]">
                {activeItem?.emoji} {activeItem?.label}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block capitalize">
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[#1a3a2a]">Dra. Laís</p>
              <p className="text-[10px] text-gray-400">Administrador</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#40916c] flex items-center justify-center text-white text-sm font-bold shadow-md">
              L
            </div>
          </div>
        </header>

        {/* View content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children(activeView)}
        </main>
      </div>
    </div>
  );
}
