import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { MessageSquare, Send, Clock } from "lucide-react";

const RETURN_RULES = [
  { procedure: "Botox", days: 14, label: "Retorno 14 dias" },
  { procedure: "Preenchimento", days: 30, label: "Retorno 1 mês" },
  { procedure: "Bioestimulador", days: 120, label: "Manutenção 4 meses" },
  { procedure: "Skinbooster", days: 90, label: "Manutenção 3 meses" },
];

const MESSAGE_TEMPLATES = [
  {
    id: "return",
    label: "Lembrete de Retorno",
    text: "Olá, {NOME}! 😊 Tudo bem? Lembramos que seu retorno após {TRATAMENTO} está próximo. Agende sua consulta para manter os resultados! 💚",
  },
  {
    id: "appointment",
    label: "Confirmação de Agendamento",
    text: "Olá, {NOME}! 🗓️ Confirmando seu agendamento para {TRATAMENTO} no dia {HORARIO}. Qualquer dúvida, estamos à disposição! LAES Clinic.",
  },
  {
    id: "birthday",
    label: "Aniversário",
    text: "Feliz aniversário, {NOME}! 🎉🎂 A LAES Clinic deseja a você um dia incrível! Como presente, temos uma condição especial esperando por você. Fale conosco! 💚",
  },
];

export default function WhatsAppView() {
  const { data: clients = [] } = trpc.admin.clients.list.useQuery();
  const { data: appointments = [] } = trpc.admin.appointments.list.useQuery();
  const { data: procedures = [] } = trpc.admin.procedures.list.useQuery();

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(MESSAGE_TEMPLATES[0]);
  const [customName, setCustomName] = useState("");
  const [customTreatment, setCustomTreatment] = useState("");
  const [customTime, setCustomTime] = useState("");

  // Compute patients needing return
  const returnsNeeded = appointments
    .filter((appt: any) => appt.status === "completed")
    .map((appt: any) => {
      const proc = procedures.find((p: any) => p.id === appt.procedureId);
      const rule = RETURN_RULES.find((r) =>
        proc?.name?.toLowerCase().includes(r.procedure.toLowerCase())
      );
      if (!rule) return null;

      const returnDate = new Date(appt.appointmentDate);
      returnDate.setDate(returnDate.getDate() + rule.days);
      const today = new Date();
      const daysUntil = Math.round((returnDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil > 7) return null; // only show upcoming or overdue

      const client = clients.find((c: any) => c.id === appt.clientId);
      return { appt, client, proc, rule, returnDate, daysUntil };
    })
    .filter(Boolean);

  const buildMessage = (clientName: string, treatment: string, time: string) => {
    return selectedTemplate.text
      .replace("{NOME}", clientName || "Cliente")
      .replace("{TRATAMENTO}", treatment || "procedimento")
      .replace("{HORARIO}", time || "horário a confirmar");
  };

  const openWhatsApp = (phone: string, message: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/55${cleaned}?text=${encoded}`, "_blank");
  };

  const handleSendCustom = () => {
    if (!selectedClient) return;
    const msg = buildMessage(customName || selectedClient.name, customTreatment, customTime);
    openWhatsApp(selectedClient.phone, msg);
  };

  return (
    <div className="space-y-6">
      {/* Pending returns table */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
          <Clock size={16} className="text-orange-500" />
          <h2 className="font-semibold text-[#1a3a2a]">Retornos e Manutenções</h2>
          {returnsNeeded.length > 0 && (
            <span className="ml-auto text-xs bg-orange-100 text-orange-700 font-medium px-2 py-0.5 rounded-full">
              {returnsNeeded.length} pendente{returnsNeeded.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {returnsNeeded.length === 0 ? (
          <div className="py-14 text-center text-gray-400 text-sm">
            <Clock size={36} className="mx-auto mb-3 opacity-20" />
            Nenhum retorno pendente nos próximos 7 dias
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {returnsNeeded.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm">
                    {item.client?.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#1a3a2a]">{item.client?.name ?? `Cliente #${item.appt.clientId}`}</p>
                    <p className="text-xs text-gray-400">{item.rule.label} · {item.proc?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.daysUntil < 0 ? "bg-red-100 text-red-600" : item.daysUntil <= 3 ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {item.daysUntil < 0 ? `${Math.abs(item.daysUntil)}d atrasado` : item.daysUntil === 0 ? "Hoje!" : `Em ${item.daysUntil}d`}
                  </span>
                  {item.client?.phone && (
                    <button
                      onClick={() => {
                        const msg = MESSAGE_TEMPLATES[0].text
                          .replace("{NOME}", item.client.name)
                          .replace("{TRATAMENTO}", item.proc?.name ?? "procedimento")
                          .replace("{HORARIO}", item.returnDate.toLocaleDateString("pt-BR"));
                        openWhatsApp(item.client.phone, msg);
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium bg-[#25D366] text-white px-3 py-1.5 rounded-full hover:bg-[#1ebe57] transition-colors"
                    >
                      <MessageSquare size={13} /> Enviar Lembrete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom blast */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Send size={16} className="text-[#2d6a4f]" />
          <h2 className="font-semibold text-[#1a3a2a]">Enviar Mensagem Personalizada</h2>
        </div>

        {/* Template selector */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">Modelo de Mensagem</label>
          <div className="flex flex-wrap gap-2">
            {MESSAGE_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${selectedTemplate.id === t.id ? "bg-[#2d6a4f] text-white border-[#2d6a4f]" : "border-gray-200 text-gray-600 hover:border-[#2d6a4f] hover:text-[#2d6a4f]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Cliente</label>
            <select
              value={selectedClient?.id ?? ""}
              onChange={(e) => {
                const c = clients.find((cl: any) => cl.id === Number(e.target.value));
                setSelectedClient(c ?? null);
                if (c) setCustomName(c.name);
              }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
            >
              <option value="">Selecionar cliente</option>
              {clients.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Nome (tag {"{NOME}"})</label>
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Nome do cliente"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Tratamento (tag {"{TRATAMENTO}"})</label>
            <input
              value={customTreatment}
              onChange={(e) => setCustomTreatment(e.target.value)}
              placeholder="Ex: Botox"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Horário (tag {"{HORARIO}"})</label>
            <input
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="Ex: 14/08 às 15h"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
            />
          </div>
        </div>

        {/* Message preview */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Pré-visualização</p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {buildMessage(customName || selectedClient?.name || "{NOME}", customTreatment, customTime)}
          </p>
        </div>

        <button
          onClick={handleSendCustom}
          disabled={!selectedClient}
          className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#1ebe57] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <MessageSquare size={16} /> Abrir no WhatsApp
        </button>
      </div>
    </div>
  );
}
