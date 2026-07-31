import { trpc } from "@/lib/trpc";
import { BarChart3, Globe, Instagram, TrendingUp } from "lucide-react";

export default function AnalyticsView() {
  const { data: analytics } = trpc.admin.dashboard.analytics.useQuery();

  const sources = analytics?.sources ?? [];
  const topProcedures = analytics?.topProcedures ?? [];
  const maxVisits = Math.max(...topProcedures.map((p) => p.visits), 1);
  const maxSource = Math.max(...sources.map((s) => s.value), 1);

  return (
    <div className="space-y-6">
      {/* Traffic summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <Globe size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Visitas Hoje</p>
            <p className="text-3xl font-bold text-[#1a3a2a]">{analytics?.todayVisits ?? 0}</p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl">
            <TrendingUp size={22} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Visitas no Mês</p>
            <p className="text-3xl font-bold text-[#1a3a2a]">{analytics?.monthVisits?.toLocaleString("pt-BR") ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Traffic sources */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-[#1a3a2a] mb-5 flex items-center gap-2">
            <Instagram size={16} className="text-pink-500" />
            Origem do Tráfego
          </h3>
          <div className="space-y-4">
            {sources.map((source) => {
              const pct = Math.round((source.value / maxSource) * 100);
              const colors: Record<string, string> = {
                Instagram: "bg-gradient-to-r from-pink-500 to-purple-500",
                Google: "bg-blue-500",
                Direto: "bg-[#2d6a4f]",
              };
              return (
                <div key={source.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{source.name}</span>
                    <span className="text-sm font-bold text-[#1a3a2a]">{source.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${colors[source.name] ?? "bg-gray-400"} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top procedures */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-[#1a3a2a] mb-5 flex items-center gap-2">
            <BarChart3 size={16} className="text-[#2d6a4f]" />
            Procedimentos Mais Visitados
          </h3>
          <div className="space-y-4">
            {topProcedures.map((proc, i) => {
              const pct = Math.round((proc.visits / maxVisits) * 100);
              return (
                <div key={proc.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#e8f5ee] text-[#2d6a4f] text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{proc.name}</span>
                    </div>
                    <span className="text-sm font-bold text-[#1a3a2a]">{proc.visits.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-[#2d6a4f] transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[#e8f5ee] border border-[#b7dbc8] rounded-2xl p-5 text-sm text-[#2d6a4f]">
        <p className="font-semibold mb-1">📊 Integração com Google Analytics</p>
        <p className="text-xs">Os dados acima são demonstrativos. Para conectar dados reais, integre seu Google Analytics 4 configurando o Measurement Protocol ou adicionando o script do GA na página inicial.</p>
      </div>
    </div>
  );
}
