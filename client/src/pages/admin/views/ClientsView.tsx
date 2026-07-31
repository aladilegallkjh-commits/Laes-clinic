import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Search, UserPlus, X, ChevronRight, Save, AlertTriangle, Pill, History, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientsView() {
  const { data: clients = [], refetch } = trpc.admin.clients.list.useQuery();
  const { data: procedures = [] } = trpc.admin.procedures.list.useQuery();
  const createClient = trpc.admin.clients.create.useMutation();
  const saveAnamnesis = trpc.admin.anamnesis.save.useMutation();
  const createPackage = trpc.admin.packages.create.useMutation();

  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [tab, setTab] = useState<"anamnesis" | "packages">("anamnesis");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", phone: "", email: "", address: "" });

  const { data: anamnesis } = trpc.admin.anamnesis.getByClient.useQuery(
    { clientId: selectedClient?.id ?? 0 },
    { enabled: !!selectedClient }
  );
  const { data: packages = [] } = trpc.admin.packages.listByClient.useQuery(
    { clientId: selectedClient?.id ?? 0 },
    { enabled: !!selectedClient }
  );
  const incrementSession = trpc.admin.packages.incrementSession.useMutation();

  const [anamnesisForm, setAnamnesisForm] = useState({
    allergies: false,
    pregnancyLactation: false,
    medications: "",
    previousProcedures: "",
    clinicalNotes: "",
  });
  const [pkgForm, setPkgForm] = useState({ procedureId: "", totalSessions: "5" });

  const filtered = clients.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openClient = (client: any) => {
    setSelectedClient(client);
    setAnamnesisForm({
      allergies: false,
      pregnancyLactation: false,
      medications: "",
      previousProcedures: "",
      clinicalNotes: "",
    });
  };

  // Sync anamnesis when loaded
  const displayedAnamnesis = anamnesis ?? null;
  const mergedAnamnesis = displayedAnamnesis ? {
    allergies: displayedAnamnesis.allergies,
    pregnancyLactation: displayedAnamnesis.pregnancyLactation,
    medications: displayedAnamnesis.medications ?? "",
    previousProcedures: displayedAnamnesis.previousProcedures ?? "",
    clinicalNotes: displayedAnamnesis.clinicalNotes ?? "",
  } : anamnesisForm;

  const handleSaveAnamnesis = async () => {
    if (!selectedClient) return;
    await saveAnamnesis.mutateAsync({ clientId: selectedClient.id, ...mergedAnamnesis });
    toast.success("Prontuário salvo!");
  };

  const handleCreateClient = async () => {
    if (!newForm.name || !newForm.phone) {
      toast.error("Nome e telefone são obrigatórios");
      return;
    }
    await createClient.mutateAsync(newForm);
    toast.success("Cliente criado!");
    setShowNewForm(false);
    setNewForm({ name: "", phone: "", email: "", address: "" });
    refetch();
  };

  const handleCreatePackage = async () => {
    if (!pkgForm.procedureId) { toast.error("Selecione um procedimento"); return; }
    await createPackage.mutateAsync({
      clientId: selectedClient.id,
      procedureId: Number(pkgForm.procedureId),
      totalSessions: Number(pkgForm.totalSessions),
    });
    toast.success("Pacote criado!");
    setPkgForm({ procedureId: "", totalSessions: "5" });
  };

  return (
    <div className="flex gap-5 h-full">
      {/* Client list */}
      <div className={`${selectedClient ? "hidden lg:flex" : "flex"} flex-col gap-4 w-full lg:w-[340px] flex-shrink-0`}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#2d6a4f] bg-white"
            />
          </div>
          <Button
            onClick={() => setShowNewForm(!showNewForm)}
            className="bg-[#2d6a4f] hover:bg-[#245a41] text-white rounded-xl gap-1.5 text-sm"
          >
            <UserPlus size={15} />
          </Button>
        </div>

        {showNewForm && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm text-[#1a3a2a]">Novo Cliente</h3>
            {[
              { label: "Nome *", key: "name", placeholder: "Nome completo" },
              { label: "Telefone *", key: "phone", placeholder: "(99) 99999-9999" },
              { label: "Email", key: "email", placeholder: "email@exemplo.com" },
              { label: "Endereço", key: "address", placeholder: "Endereço" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                <input
                  value={(newForm as any)[f.key]}
                  onChange={(e) => setNewForm({ ...newForm, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
                />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Button onClick={handleCreateClient} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm rounded-xl flex-1">Salvar</Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)} className="text-sm rounded-xl">Cancelar</Button>
            </div>
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">Nenhum cliente encontrado</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((client: any) => (
                <button
                  key={client.id}
                  onClick={() => openClient(client)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${selectedClient?.id === client.id ? "bg-[#e8f5ee]" : ""}`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#2d6a4f] font-bold text-sm flex-shrink-0">
                    {client.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#1a3a2a] truncate">{client.name}</p>
                    <p className="text-xs text-gray-400 truncate">{client.phone}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Client detail / Medical record */}
      {selectedClient ? (
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedClient(null)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
              <div className="w-10 h-10 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#2d6a4f] font-bold">
                {selectedClient.name[0].toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-[#1a3a2a]">{selectedClient.name}</h2>
                <p className="text-xs text-gray-400">{selectedClient.phone} {selectedClient.email ? `· ${selectedClient.email}` : ""}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[
              { id: "anamnesis", label: "Prontuário", icon: <FileText size={14} /> },
              { id: "packages", label: "Sessões / Pacotes", icon: <History size={14} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? "border-[#2d6a4f] text-[#2d6a4f]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Anamnesis tab */}
            {tab === "anamnesis" && (
              <div className="space-y-5 max-w-xl">
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Ficha de Anamnese</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Checkboxes */}
                  {[
                    { key: "allergies", label: "Possui Alergias", icon: <AlertTriangle size={14} className="text-orange-500" /> },
                    { key: "pregnancyLactation", label: "Gestação / Lactação", icon: <AlertTriangle size={14} className="text-pink-500" /> },
                  ].map((f) => (
                    <label key={f.key} className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={(mergedAnamnesis as any)[f.key]}
                        onChange={(e) => setAnamnesisForm((prev) => ({ ...mergedAnamnesis, ...prev, [f.key]: e.target.checked }))}
                        className="w-4 h-4 accent-[#2d6a4f]"
                      />
                      {f.icon}
                      <span className="text-sm font-medium text-gray-700">{f.label}</span>
                    </label>
                  ))}
                </div>

                {[
                  { key: "medications", label: "Medicamentos em uso", placeholder: "Liste os medicamentos..." },
                  { key: "previousProcedures", label: "Histórico de Procedimentos", placeholder: "Procedimentos anteriores..." },
                  { key: "clinicalNotes", label: "Observações Clínicas / Evolução", placeholder: "Anote observações, evolução do tratamento...", rows: 5 },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-gray-500 block mb-1.5">{f.label}</label>
                    <textarea
                      value={(mergedAnamnesis as any)[f.key]}
                      onChange={(e) => setAnamnesisForm((prev) => ({ ...mergedAnamnesis, ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      rows={f.rows ?? 3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2d6a4f] resize-none"
                    />
                  </div>
                ))}

                <Button onClick={handleSaveAnamnesis} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white gap-2 rounded-xl">
                  <Save size={15} /> Salvar Prontuário
                </Button>
              </div>
            )}

            {/* Packages tab */}
            {tab === "packages" && (
              <div className="space-y-5 max-w-xl">
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Controle de Sessões</h3>

                {/* New package form */}
                <div className="p-4 border border-dashed border-gray-200 rounded-xl space-y-3">
                  <p className="text-sm font-medium text-gray-600">Criar Pacote de Sessões</p>
                  <div className="flex gap-3 flex-wrap">
                    <select
                      value={pkgForm.procedureId}
                      onChange={(e) => setPkgForm({ ...pkgForm, procedureId: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
                    >
                      <option value="">Procedimento</option>
                      {procedures.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={pkgForm.totalSessions}
                      onChange={(e) => setPkgForm({ ...pkgForm, totalSessions: e.target.value })}
                      className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
                      placeholder="Sessões"
                    />
                    <Button onClick={handleCreatePackage} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white rounded-xl gap-1.5 text-sm">
                      <Plus size={14} /> Criar
                    </Button>
                  </div>
                </div>

                {/* Package list */}
                {packages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Nenhum pacote ativo</p>
                ) : (
                  <div className="space-y-3">
                    {packages.map((pkg: any) => {
                      const proc = procedures.find((p: any) => p.id === pkg.procedureId);
                      const pct = Math.round((pkg.completedSessions / pkg.totalSessions) * 100);
                      return (
                        <div key={pkg.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm text-[#1a3a2a]">{proc?.name ?? `Procedimento #${pkg.procedureId}`}</p>
                            <span className="text-xs text-gray-500">{pkg.completedSessions}/{pkg.totalSessions} sessões</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                              className="bg-[#2d6a4f] h-2 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {pkg.completedSessions < pkg.totalSessions && (
                            <button
                              onClick={() => { incrementSession.mutate({ id: pkg.id }); }}
                              className="text-xs text-[#2d6a4f] font-medium hover:underline"
                            >
                              + Registrar Sessão
                            </button>
                          )}
                          {pkg.completedSessions >= pkg.totalSessions && (
                            <span className="text-xs text-emerald-600 font-medium">✓ Pacote concluído</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-gray-300">
          <div className="text-center">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Selecione um cliente para ver o prontuário</p>
          </div>
        </div>
      )}
    </div>
  );
}
