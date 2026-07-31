import React, { useState, useEffect } from "react";
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

import logoMark from "@/assets/logo-mark.png";

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
}

const sidebarItems: SidebarItem[] = [
  { id: "dashboard",    label: "Dashboard",       icon: <LayoutDashboard size={18} /> },
  { id: "appointments", label: "Agenda",           icon: <CalendarDays size={18} /> },
  { id: "clients",      label: "Prontuário",       icon: <FolderHeart size={18} /> },
  { id: "finance",      label: "Financeiro",       icon: <Wallet size={18} /> },
  { id: "cms",          label: "Gestão do Site",   icon: <Globe size={18} /> },
  { id: "analytics",    label: "Métricas",         icon: <BarChart3 size={18} /> },
  { id: "whatsapp",     label: "WhatsApp",         icon: <MessageSquare size={18} /> },
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

  // Make body transparent so the bg-texture shows through glassmorphism cards
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'transparent';
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

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
          bg-[#1a3a2a]/85 backdrop-blur-xl
          border-r border-white/10
          shadow-[4px_0_32px_rgba(0,0,0,0.18)]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-[250px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ── Logo ── */}
        <div
          className={`flex items-center border-b border-white/10 py-4 px-4
            ${collapsed ? "justify-center" : "gap-3"}`}
        >
          {/* Logo circular com fundo semi-branco para destaque */}
          <div className="w-10 h-10 rounded-full bg-white/15 p-0.5 flex-shrink-0 ring-1 ring-white/20">
            <img
              src={logoMark}
              alt="LAES Clinic"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-bold text-white text-sm tracking-wide">LAES Clinic</p>
              <p className="text-[10px] text-[#95d5b2] uppercase tracking-widest font-medium">
                Painel Admin
              </p>
            </div>
          )}
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 py-3 overflow-y-auto px-2 space-y-0.5">
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
                    ? "bg-white/20 text-white backdrop-blur-sm shadow-inner ring-1 ring-white/20"
                    : "text-[#95d5b2] hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#95d5b2]" />
                )}
                <span className={`flex-shrink-0 ${isActive ? "text-white" : "text-[#95d5b2] group-hover:text-white"}`}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1a3a2a] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl z-50 border border-white/10">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Collapse ── */}
        <div className="px-2 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs
              text-[#95d5b2] hover:bg-white/10 hover:text-white transition-colors
              ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed
              ? <ChevronRight size={15} />
              : <><ChevronLeft size={15} /><span>Recolher</span></>
            }
          </button>
        </div>

        {/* ── Logout ── */}
        <div className="px-2 pb-4 border-t border-white/10 pt-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors
              ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* ─────────── MAIN CONTENT ─────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: 'transparent' }}>
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-bold text-[#1a3a2a]">{activeItem?.label}</h1>
              <p className="text-xs text-gray-400 hidden sm:block capitalize">
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[#1a3a2a]">Dr Edilene</p>
              <p className="text-[10px] text-gray-400">Administrador</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#52b788] flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-[#2d6a4f]/30">
              L
            </div>
          </div>
        </header>

        {/* View content */}
        <main data-admin-main className="flex-1 overflow-y-auto p-6" style={{ background: 'transparent' }}>
          {/* ── Greeting Banner ── */}
          {(() => {
            const now = new Date();
            const hour = now.getHours();
            const greeting =
              hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
            const dateStr = now.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }).toUpperCase();
            return (
              <div className="mb-6 pb-5 border-b border-gray-200/60">
                <p className="text-xs font-semibold text-gray-600 tracking-widest uppercase mb-1">
                  {dateStr}
                </p>
                <h2 className="text-2xl font-bold text-[#0d1f17]">
                  {greeting}, Dr Edilene
                </h2>
              </div>
            );
          })()}
          {children(activeView)}
        </main>
      </div>
    </div>
  );
}
