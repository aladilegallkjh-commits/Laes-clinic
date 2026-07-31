import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pendente",   color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Concluído",  color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelado",  color: "bg-red-100 text-red-700" },
};

export default function AppointmentsView() {
  const { data: appointments = [], refetch } = trpc.admin.appointments.list.useQuery();
  const { data: clients = [] } = trpc.admin.clients.list.useQuery();
  const { data: procedures = [] } = trpc.admin.procedures.list.useQuery();
  const createMut = trpc.admin.appointments.create.useMutation();
  const updateStatus = trpc.admin.appointments.updateStatus.useMutation();
  const deleteMut = trpc.admin.appointments.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientId: "", procedureId: "", appointmentDate: "", notes: "" });

  const handleCreate = async () => {
    if (!form.clientId || !form.procedureId || !form.appointmentDate) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    await createMut.mutateAsync({
      clientId: Number(form.clientId),
      procedureId: Number(form.procedureId),
      appointmentDate: new Date(form.appointmentDate),
      notes: form.notes || undefined,
    });
    toast.success("Agendamento criado!");
    setShowForm(false);
    setForm({ clientId: "", procedureId: "", appointmentDate: "", notes: "" });
    refetch();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir agendamento?")) return;
    await deleteMut.mutateAsync({ id });
    toast.success("Agendamento excluído");
    refetch();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Todos os Agendamentos</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm gap-2 rounded-xl"
        >
          <CalendarPlus size={16} /> Novo Agendamento
        </Button>
      </div>

      {/* New appointment form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-semibold text-[#1a3a2a]">Novo Agendamento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Cliente *</label>
              <select
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
              >
                <option value="">Selecionar cliente</option>
                {clients.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Procedimento *</label>
              <select
                value={form.procedureId}
                onChange={(e) => setForm({ ...form, procedureId: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
              >
                <option value="">Selecionar procedimento</option>
                {procedures.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Data e Hora *</label>
              <input
                type="datetime-local"
                value={form.appointmentDate}
                onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Observações</label>
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Observações..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleCreate} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm rounded-xl">
              Criar Agendamento
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="text-sm rounded-xl">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Appointments list */}
      <div className="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden">
        {appointments.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <CalendarPlus size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {appointments.map((appt: any) => {
              const client = clients.find((c: any) => c.id === appt.clientId);
              const procedure = procedures.find((p: any) => p.id === appt.procedureId);
              return (
                <div key={appt.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#2d6a4f] font-bold text-sm">
                      {(client?.name?.[0] ?? "#").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#1a3a2a]">{client?.name ?? `Cliente #${appt.clientId}`}</p>
                      <p className="text-xs text-gray-400">{procedure?.name ?? `Procedimento #${appt.procedureId}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {new Date(appt.appointmentDate).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABELS[appt.status]?.color}`}>
                      {STATUS_LABELS[appt.status]?.label}
                    </span>
                    <select
                      value={appt.status}
                      onChange={(e) => { updateStatus.mutate({ id: appt.id, status: e.target.value as any }); refetch(); }}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#2d6a4f]"
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                    <button onClick={() => handleDelete(appt.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
