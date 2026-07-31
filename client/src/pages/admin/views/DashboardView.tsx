import { trpc } from "@/lib/trpc";
import { TrendingUp, TrendingDown, Users, CalendarCheck, DollarSign, Clock } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pendente",       color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmado",     color: "bg-blue-100 text-blue-700" },
  completed: { label: "Concluído",      color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelado",      color: "bg-red-100 text-red-700" },
};

export default function DashboardView() {
  const { data: metrics } = trpc.admin.dashboard.metrics.useQuery();
  const updateStatus = trpc.admin.appointments.updateStatus.useMutation();

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const cards = [
    {
      title: "Faturamento Hoje",
      value: fmt(metrics?.todayRevenue ?? 0),
      icon: <DollarSign size={22} className="text-emerald-600" />,
      bg: "bg-emerald-50",
      sub: "receitas do dia",
    },
    {
      title: "Faturamento do Mês",
      value: fmt(metrics?.monthRevenue ?? 0),
      icon: <TrendingUp size={22} className="text-blue-600" />,
      bg: "bg-blue-50",
      sub: "acumulado",
    },
    {
      title: "Atendimentos Hoje",
      value: String(metrics?.todayAppointments ?? 0),
      icon: <CalendarCheck size={22} className="text-violet-600" />,
      bg: "bg-violet-50",
      sub: "agendados",
    },
    {
      title: "Retornos Pendentes",
      value: String(metrics?.pendingReturns ?? 0),
      icon: <Clock size={22} className="text-orange-500" />,
      bg: "bg-orange-50",
      sub: "precisam de retorno",
    },
  ];

  const todayList: any[] = metrics?.todayAppointmentsList ?? [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="bg-white rounded-2xl p-5 shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50 flex items-start gap-4">
            <div className={`${c.bg} p-3 rounded-xl`}>{c.icon}</div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{c.title}</p>
              <p className="text-2xl font-bold text-[#1a3a2a] leading-tight mt-0.5">{c.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's appointments table */}
      <div className="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-[#1a3a2a]">Pacientes de Hoje</h2>
          <span className="text-xs text-gray-400">{new Date().toLocaleDateString("pt-BR")}</span>
        </div>

        {todayList.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <CalendarCheck size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum atendimento agendado para hoje.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {todayList.map((appt: any) => (
              <div key={appt.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#2d6a4f] font-bold text-sm">
                    {appt.clientId}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#1a3a2a]">Cliente #{appt.clientId}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(appt.appointmentDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABELS[appt.status]?.color}`}>
                    {STATUS_LABELS[appt.status]?.label}
                  </span>
                  <select
                    value={appt.status}
                    onChange={(e) => updateStatus.mutate({ id: appt.id, status: e.target.value as any })}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#2d6a4f]"
                  >
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
