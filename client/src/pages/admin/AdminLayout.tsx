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
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { id: "appointments", label: "Agenda", icon: <CalendarDays size={20} /> },
  { id: "clients", label: "Prontuário & Clientes", icon: <FolderHeart size={20} /> },
  { id: "finance", label: "Financeiro & Estoque", icon: <Wallet size={20} /> },
  { id: "cms", label: "Gestão do Site", icon: <Globe size={20} /> },
  { id: "analytics", label: "Métricas de Acesso", icon: <BarChart3 size={20} /> },
  { id: "whatsapp", label: "Disparos WhatsApp", icon: <MessageSquare size={20} /> },
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
    <div className="flex h-screen bg-[#F7F8FA] font-sans overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-30 flex flex-col h-full bg-white border-r border-gray-100
          transition-all duration-300 ease-in-out shadow-sm
          ${collapsed ? "w-[72px]" : "w-[240px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo area */}
        <div className={`flex items-center h-16 px-4 border-b border-gray-100 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <div>
              <p className="font-semibold text-sm text-[#1a3a2a] tracking-wide">LAES Clinic</p>
              <p className="text-[10px] text-[#8a9e95] uppercase tracking-widest">Painel Admin</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 border border-gray-200 text-gray-400 hover:bg-[#e8f5ee] hover:text-[#2d6a4f] transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id); setMobileOpen(false); }}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 relative group
                  ${isActive
                    ? "text-[#2d6a4f] bg-[#e8f5ee]"
                    : "text-gray-500 hover:text-[#2d6a4f] hover:bg-gray-50"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-[3px] rounded-r-full bg-[#2d6a4f]" />
                )}
                <span className={isActive ? "text-[#2d6a4f]" : ""}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-semibold text-[#1a3a2a]">{activeItem?.label}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white text-sm font-bold">
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
