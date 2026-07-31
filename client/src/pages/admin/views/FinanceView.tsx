import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, TrendingUp, TrendingDown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAYMENT_LABELS: Record<string, string> = {
  pix: "PIX",
  credit_card: "Cartão Crédito",
  debit_card: "Cartão Débito",
  cash: "Dinheiro",
  other: "Outro",
};

export default function FinanceView() {
  const { data: transactions = [], refetch } = trpc.admin.finance.list.useQuery();
  const { data: inventory = [], refetch: refetchInventory } = trpc.admin.inventory.list.useQuery();
  const createTx = trpc.admin.finance.create.useMutation();
  const deleteTx = trpc.admin.finance.delete.useMutation();
  const createItem = trpc.admin.inventory.create.useMutation();

  const [tab, setTab] = useState<"cashflow" | "inventory">("cashflow");
  const [showForm, setShowForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

  const [txForm, setTxForm] = useState({
    type: "income" as "income" | "expense",
    amount: "",
    paymentMethod: "pix" as any,
    category: "",
    description: "",
  });

  const [itemForm, setItemForm] = useState({
    name: "", brand: "", lotNumber: "", quantity: "1",
  });

  const totalIncome = transactions
    .filter((t: any) => t.type === "income")
    .reduce((acc: number, t: any) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t: any) => t.type === "expense")
    .reduce((acc: number, t: any) => acc + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCreateTx = async () => {
    if (!txForm.amount || !txForm.category) { toast.error("Preencha valor e categoria"); return; }
    await createTx.mutateAsync({ ...txForm, amount: txForm.amount });
    toast.success("Lançamento criado!");
    setShowForm(false);
    setTxForm({ type: "income", amount: "", paymentMethod: "pix", category: "", description: "" });
    refetch();
  };

  const handleDeleteTx = async (id: number) => {
    if (!confirm("Excluir lançamento?")) return;
    await deleteTx.mutateAsync({ id });
    toast.success("Lançamento excluído");
    refetch();
  };

  const handleCreateItem = async () => {
    if (!itemForm.name) { toast.error("Nome obrigatório"); return; }
    await createItem.mutateAsync({ ...itemForm, quantity: Number(itemForm.quantity) });
    toast.success("Item adicionado ao estoque!");
    setShowItemForm(false);
    setItemForm({ name: "", brand: "", lotNumber: "", quantity: "1" });
    refetchInventory();
  };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Entradas", value: fmt(totalIncome), icon: <TrendingUp size={20} className="text-emerald-600" />, bg: "bg-emerald-50", color: "text-emerald-700" },
          { label: "Total Saídas", value: fmt(totalExpense), icon: <TrendingDown size={20} className="text-red-500" />, bg: "bg-red-50", color: "text-red-600" },
          { label: "Saldo", value: fmt(balance), icon: <TrendingUp size={20} className={balance >= 0 ? "text-emerald-600" : "text-red-500"} />, bg: balance >= 0 ? "bg-emerald-50" : "bg-red-50", color: balance >= 0 ? "text-emerald-700" : "text-red-600" },
        ].map((c) => (
          <div key={c.label} className="bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50 flex items-center gap-4">
            <div className={`${c.bg} p-3 rounded-xl`}>{c.icon}</div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{c.label}</p>
              <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: "cashflow", label: "Fluxo de Caixa" },
          { id: "inventory", label: "Estoque / Insumos" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === t.id ? "bg-white text-[#2d6a4f] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "cashflow" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowForm(!showForm)} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm gap-2 rounded-xl">
              <Plus size={15} /> Novo Lançamento
            </Button>
          </div>

          {showForm && (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-semibold text-[#1a3a2a]">Novo Lançamento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Tipo *</label>
                  <div className="flex gap-2">
                    {(["income", "expense"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTxForm({ ...txForm, type: t })}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${txForm.type === t ? (t === "income" ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-red-50 border-red-300 text-red-600") : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                      >
                        {t === "income" ? "Entrada" : "Saída"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={txForm.amount}
                    onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                    placeholder="0,00"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Forma de Pagamento</label>
                  <select
                    value={txForm.paymentMethod}
                    onChange={(e) => setTxForm({ ...txForm, paymentMethod: e.target.value as any })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
                  >
                    {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Categoria *</label>
                  <input
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                    placeholder="Ex: Consulta, Aluguel, Insumos..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Descrição</label>
                  <input
                    value={txForm.description}
                    onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
                    placeholder="Descrição opcional..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreateTx} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm rounded-xl">Salvar</Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="text-sm rounded-xl">Cancelar</Button>
              </div>
            </div>
          )}

          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden">
            {transactions.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">Nenhuma transação registrada</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {[...transactions].reverse().map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.type === "income" ? "bg-emerald-50" : "bg-red-50"}`}>
                        {tx.type === "income"
                          ? <TrendingUp size={16} className="text-emerald-600" />
                          : <TrendingDown size={16} className="text-red-500" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#1a3a2a]">{tx.category}</p>
                        <p className="text-xs text-gray-400">{tx.description || PAYMENT_LABELS[tx.paymentMethod]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold text-sm ${tx.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                        {tx.type === "income" ? "+" : "-"}{fmt(Number(tx.amount))}
                      </span>
                      <span className="text-xs text-gray-400 hidden sm:block">
                        {new Date(tx.transactionDate).toLocaleDateString("pt-BR")}
                      </span>
                      <button onClick={() => handleDeleteTx(tx.id)} className="text-red-300 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "inventory" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowItemForm(!showItemForm)} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm gap-2 rounded-xl">
              <Plus size={15} /> Novo Item
            </Button>
          </div>

          {showItemForm && (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-semibold text-[#1a3a2a]">Novo Insumo / Lote</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Nome *", key: "name", placeholder: "Ex: Botox Allergan" },
                  { label: "Marca", key: "brand", placeholder: "Ex: Allergan" },
                  { label: "Nº do Lote", key: "lotNumber", placeholder: "Ex: LOT-20240101" },
                  { label: "Quantidade", key: "quantity", placeholder: "1", type: "number" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">{f.label}</label>
                    <input
                      type={f.type ?? "text"}
                      value={(itemForm as any)[f.key]}
                      onChange={(e) => setItemForm({ ...itemForm, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreateItem} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm rounded-xl">Salvar</Button>
                <Button variant="outline" onClick={() => setShowItemForm(false)} className="text-sm rounded-xl">Cancelar</Button>
              </div>
            </div>
          )}

          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden">
            {inventory.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                <Package size={40} className="mx-auto mb-3 opacity-30" />
                Nenhum item no estoque
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {inventory.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center">
                        <Package size={16} className="text-violet-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#1a3a2a]">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.brand ? `${item.brand} · ` : ""}Lote: {item.lotNumber ?? "—"}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${item.quantity > 5 ? "bg-emerald-50 text-emerald-700" : item.quantity > 0 ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-600"}`}>
                      {item.quantity} unid.
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
