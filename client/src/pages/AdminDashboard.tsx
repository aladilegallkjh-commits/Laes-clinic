import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"procedures" | "courses" | "promotions" | "clients" | "messages">("procedures");
  
  // Procedimentos
  const { data: procedures } = trpc.admin.procedures.list.useQuery();
  const createProcedureMutation = trpc.admin.procedures.create.useMutation();
  const [procedureForm, setProcedureForm] = useState({ name: "", price: "", duration: 0, description: "" });

  // Cursos
  const { data: courses } = trpc.admin.courses.list.useQuery();
  const createCourseMutation = trpc.admin.courses.create.useMutation();
  const [courseForm, setCourseForm] = useState({ title: "", price: "", duration: 0, description: "" });

  // Promoções
  const { data: promotions } = trpc.admin.promotions.list.useQuery();
  const createPromotionMutation = trpc.admin.promotions.create.useMutation();
  const [promotionForm, setPromotionForm] = useState({ title: "", discountValue: "", discountType: "percentage" as const });

  // Clientes
  const { data: clients } = trpc.admin.clients.list.useQuery();
  const createClientMutation = trpc.admin.clients.create.useMutation();
  const [clientForm, setClientForm] = useState({ name: "", phone: "", email: "" });

  // Mensagens
  const sendMessageMutation = trpc.admin.messages.send.useMutation();
  const [messageForm, setMessageForm] = useState({ recipientPhone: "", message: "", type: "whatsapp" as const });

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  if (!user || user.role !== "admin") return <div className="flex items-center justify-center h-screen">Acesso negado</div>;

  const handleCreateProcedure = async () => {
    try {
      await createProcedureMutation.mutateAsync({
        ...procedureForm,
        duration: Number(procedureForm.duration),
      });
      setProcedureForm({ name: "", price: "", duration: 0, description: "" });
      toast.success("Procedimento criado!");
    } catch (error) {
      toast.error("Erro ao criar procedimento");
    }
  };

  const handleCreateCourse = async () => {
    try {
      await createCourseMutation.mutateAsync({
        ...courseForm,
        duration: Number(courseForm.duration),
      });
      setCourseForm({ title: "", price: "", duration: 0, description: "" });
      toast.success("Curso criado!");
    } catch (error) {
      toast.error("Erro ao criar curso");
    }
  };

  const handleCreatePromotion = async () => {
    try {
      await createPromotionMutation.mutateAsync({
        ...promotionForm,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        applicableTo: "all",
      });
      setPromotionForm({ title: "", discountValue: "", discountType: "percentage" });
      toast.success("Promoção criada!");
    } catch (error) {
      toast.error("Erro ao criar promoção");
    }
  };

  const handleCreateClient = async () => {
    try {
      await createClientMutation.mutateAsync(clientForm);
      setClientForm({ name: "", phone: "", email: "" });
      toast.success("Cliente criado!");
    } catch (error) {
      toast.error("Erro ao criar cliente");
    }
  };

  const handleSendMessage = async () => {
    try {
      await sendMessageMutation.mutateAsync(messageForm);
      setMessageForm({ recipientPhone: "", message: "", type: "whatsapp" });
      toast.success("Mensagem enviada!");
    } catch (error) {
      toast.error("Erro ao enviar mensagem");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          {["procedures", "courses", "promotions", "clients", "messages"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? "border-b-2 border-green-700 text-green-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "procedures" && "Procedimentos"}
              {tab === "courses" && "Cursos"}
              {tab === "promotions" && "Promoções"}
              {tab === "clients" && "Clientes"}
              {tab === "messages" && "Mensagens"}
            </button>
          ))}
        </div>

        {/* Procedimentos */}
        {activeTab === "procedures" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Novo Procedimento</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Nome"
                  value={procedureForm.name}
                  onChange={(e) => setProcedureForm({ ...procedureForm, name: e.target.value })}
                />
                <Input
                  placeholder="Preço"
                  type="number"
                  value={procedureForm.price}
                  onChange={(e) => setProcedureForm({ ...procedureForm, price: e.target.value })}
                />
                <Input
                  placeholder="Duração (minutos)"
                  type="number"
                  value={procedureForm.duration}
                  onChange={(e) => setProcedureForm({ ...procedureForm, duration: Number(e.target.value) })}
                />
                <Textarea
                  placeholder="Descrição"
                  value={procedureForm.description}
                  onChange={(e) => setProcedureForm({ ...procedureForm, description: e.target.value })}
                />
                <Button onClick={handleCreateProcedure} className="w-full bg-green-700">
                  Criar Procedimento
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Procedimentos Cadastrados</h2>
              <div className="space-y-2">
                {procedures?.map((proc: any) => (
                  <div key={proc.id} className="p-3 bg-gray-100 rounded">
                    <p className="font-semibold">{proc.name}</p>
                    <p className="text-sm text-gray-600">R$ {proc.price} - {proc.duration}min</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Cursos */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Novo Curso</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Título"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                />
                <Input
                  placeholder="Preço"
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                />
                <Input
                  placeholder="Duração (horas)"
                  type="number"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: Number(e.target.value) })}
                />
                <Textarea
                  placeholder="Descrição"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                />
                <Button onClick={handleCreateCourse} className="w-full bg-green-700">
                  Criar Curso
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Cursos Cadastrados</h2>
              <div className="space-y-2">
                {courses?.map((course: any) => (
                  <div key={course.id} className="p-3 bg-gray-100 rounded">
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-gray-600">R$ {course.price} - {course.duration}h</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Promoções */}
        {activeTab === "promotions" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Nova Promoção</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Título"
                  value={promotionForm.title}
                  onChange={(e) => setPromotionForm({ ...promotionForm, title: e.target.value })}
                />
                <select
                  value={promotionForm.discountType}
                  onChange={(e) => setPromotionForm({ ...promotionForm, discountType: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="percentage">Percentual (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
                <Input
                  placeholder="Valor do Desconto"
                  type="number"
                  value={promotionForm.discountValue}
                  onChange={(e) => setPromotionForm({ ...promotionForm, discountValue: e.target.value })}
                />
                <Button onClick={handleCreatePromotion} className="w-full bg-green-700">
                  Criar Promoção
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Promoções Ativas</h2>
              <div className="space-y-2">
                {promotions?.map((promo: any) => (
                  <div key={promo.id} className="p-3 bg-gray-100 rounded">
                    <p className="font-semibold">{promo.title}</p>
                    <p className="text-sm text-gray-600">
                      {promo.discountValue}{promo.discountType === "percentage" ? "%" : "R$"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Clientes */}
        {activeTab === "clients" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Novo Cliente</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Nome"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                />
                <Input
                  placeholder="Telefone"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                />
                <Button onClick={handleCreateClient} className="w-full bg-green-700">
                  Criar Cliente
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Clientes Cadastrados</h2>
              <div className="space-y-2">
                {clients?.map((client: any) => (
                  <div key={client.id} className="p-3 bg-gray-100 rounded">
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.phone}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Mensagens */}
        {activeTab === "messages" && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Enviar Mensagem</h2>
            <div className="space-y-4 max-w-2xl">
              <select
                value={messageForm.type}
                onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value as any })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
              </select>
              <Input
                placeholder="Telefone/Email do Destinatário"
                value={messageForm.recipientPhone}
                onChange={(e) => setMessageForm({ ...messageForm, recipientPhone: e.target.value })}
              />
              <Textarea
                placeholder="Mensagem"
                rows={5}
                value={messageForm.message}
                onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
              />
              <Button onClick={handleSendMessage} className="w-full bg-green-700">
                Enviar Mensagem
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
