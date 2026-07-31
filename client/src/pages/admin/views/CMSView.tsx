import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, ToggleLeft, ToggleRight, Globe, BookOpen, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CMSView() {
  const [tab, setTab] = useState<"procedures" | "courses" | "promotions" | "gallery">("procedures");

  const { data: procedures = [], refetch: refetchProc } = trpc.admin.procedures.list.useQuery();
  const { data: courses = [], refetch: refetchCourses } = trpc.admin.courses.list.useQuery();
  const { data: promotions = [], refetch: refetchPromos } = trpc.admin.promotions.list.useQuery();
  const { data: gallery = [], refetch: refetchGallery } = trpc.admin.gallery.list.useQuery();

  const createProc = trpc.admin.procedures.create.useMutation();
  const updateProc = trpc.admin.procedures.update.useMutation();
  const deleteProc = trpc.admin.procedures.delete.useMutation();

  const createCourse = trpc.admin.courses.create.useMutation();
  const updateCourse = trpc.admin.courses.update.useMutation();

  const deleteGallery = trpc.admin.gallery.delete.useMutation();

  const [showProcForm, setShowProcForm] = useState(false);
  const [procForm, setProcForm] = useState({ name: "", description: "", price: "", duration: "60", category: "", image: "" });
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: "", description: "", price: "", instructor: "", duration: "8", image: "" });

  const handleCreateProc = async () => {
    if (!procForm.name || !procForm.price) { toast.error("Nome e preço obrigatórios"); return; }
    await createProc.mutateAsync({ ...procForm, duration: Number(procForm.duration) });
    toast.success("Procedimento criado!");
    setShowProcForm(false);
    setProcForm({ name: "", description: "", price: "", duration: "60", category: "", image: "" });
    refetchProc();
  };

  const toggleProc = async (id: number, current: boolean) => {
    await updateProc.mutateAsync({ id, isActive: !current });
    refetchProc();
  };

  const handleDeleteProc = async (id: number) => {
    if (!confirm("Excluir procedimento?")) return;
    await deleteProc.mutateAsync({ id });
    refetchProc();
  };

  const handleCreateCourse = async () => {
    if (!courseForm.title || !courseForm.price) { toast.error("Título e preço obrigatórios"); return; }
    await createCourse.mutateAsync({ ...courseForm, duration: Number(courseForm.duration) });
    toast.success("Curso criado!");
    setShowCourseForm(false);
    setCourseForm({ title: "", description: "", price: "", instructor: "", duration: "8", image: "" });
    refetchCourses();
  };

  const toggleCourse = async (id: number, current: boolean) => {
    await updateCourse.mutateAsync({ id, isActive: !current });
    refetchCourses();
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Excluir item da galeria?")) return;
    await deleteGallery.mutateAsync({ id });
    refetchGallery();
  };

  const TABS = [
    { id: "procedures", label: "Procedimentos", icon: <Globe size={14} /> },
    { id: "courses", label: "Cursos", icon: <BookOpen size={14} /> },
    { id: "promotions", label: "Promoções", icon: <Tag size={14} /> },
    { id: "gallery", label: "Galeria Antes/Depois", icon: <Globe size={14} /> },
  ];

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === t.id ? "bg-white text-[#2d6a4f] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ─── Procedures ─── */}
      {tab === "procedures" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowProcForm(!showProcForm)} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm gap-2 rounded-xl">
              <Plus size={15} /> Novo Procedimento
            </Button>
          </div>

          {showProcForm && (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-semibold text-[#1a3a2a]">Novo Procedimento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Nome *", key: "name", placeholder: "Ex: Botox" },
                  { label: "Preço (R$) *", key: "price", placeholder: "0.00" },
                  { label: "Duração (min)", key: "duration", placeholder: "60" },
                  { label: "Categoria", key: "category", placeholder: "Ex: Facial" },
                  { label: "URL da Imagem", key: "image", placeholder: "https://..." },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">{f.label}</label>
                    <input
                      value={(procForm as any)[f.key]}
                      onChange={(e) => setProcForm({ ...procForm, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Descrição</label>
                  <textarea
                    value={procForm.description}
                    onChange={(e) => setProcForm({ ...procForm, description: e.target.value })}
                    placeholder="Descreva o procedimento..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f] resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreateProc} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm rounded-xl">Salvar</Button>
                <Button variant="outline" onClick={() => setShowProcForm(false)} className="text-sm rounded-xl">Cancelar</Button>
              </div>
            </div>
          )}

          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden">
            {procedures.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">Nenhum procedimento cadastrado</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {procedures.map((proc: any) => (
                  <div key={proc.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {proc.image ? (
                        <img src={proc.image} alt={proc.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#e8f5ee] flex items-center justify-center text-[#2d6a4f] font-bold text-sm">
                          {proc.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm text-[#1a3a2a]">{proc.name}</p>
                        <p className="text-xs text-gray-400">R$ {proc.price} · {proc.duration}min {proc.category ? `· ${proc.category}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleProc(proc.id, proc.isActive)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${proc.isActive ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                      >
                        {proc.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {proc.isActive ? "Visível" : "Oculto"}
                      </button>
                      <button onClick={() => handleDeleteProc(proc.id)} className="text-red-300 hover:text-red-500 transition-colors">
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

      {/* ─── Courses ─── */}
      {tab === "courses" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowCourseForm(!showCourseForm)} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm gap-2 rounded-xl">
              <Plus size={15} /> Novo Curso
            </Button>
          </div>

          {showCourseForm && (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-semibold text-[#1a3a2a]">Novo Curso</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Título *", key: "title", placeholder: "Ex: Curso de Botox" },
                  { label: "Preço (R$) *", key: "price", placeholder: "0.00" },
                  { label: "Instrutor", key: "instructor", placeholder: "Nome do instrutor" },
                  { label: "Duração (horas)", key: "duration", placeholder: "8" },
                  { label: "URL da Imagem", key: "image", placeholder: "https://..." },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">{f.label}</label>
                    <input
                      value={(courseForm as any)[f.key]}
                      onChange={(e) => setCourseForm({ ...courseForm, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f]"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Descrição</label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    placeholder="Descreva o curso..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2d6a4f] resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreateCourse} className="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm rounded-xl">Salvar</Button>
                <Button variant="outline" onClick={() => setShowCourseForm(false)} className="text-sm rounded-xl">Cancelar</Button>
              </div>
            </div>
          )}

          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden">
            {courses.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">Nenhum curso cadastrado</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {courses.map((course: any) => (
                  <div key={course.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm text-[#1a3a2a]">{course.title}</p>
                      <p className="text-xs text-gray-400">R$ {course.price} · {course.duration}h {course.instructor ? `· ${course.instructor}` : ""}</p>
                    </div>
                    <button
                      onClick={() => toggleCourse(course.id, course.isActive)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${course.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {course.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {course.isActive ? "Visível" : "Oculto"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Promotions ─── */}
      {tab === "promotions" && (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-50">
          {promotions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">Nenhuma promoção ativa</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {promotions.map((promo: any) => (
                <div key={promo.id} className="py-4">
                  <p className="font-medium text-sm text-[#1a3a2a]">{promo.title}</p>
                  <p className="text-xs text-gray-400">{promo.discountType === "percentage" ? `${promo.discountValue}%` : `R$ ${promo.discountValue}`} de desconto</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Gallery ─── */}
      {tab === "gallery" && (
        <div className="space-y-4">
          {gallery.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
              Nenhuma foto cadastrada na galeria
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((item: any) => (
                <div key={item.id} className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="grid grid-cols-2 h-40">
                    <img src={item.beforeImage} alt="Antes" className="w-full h-full object-cover" />
                    <img src={item.afterImage} alt="Depois" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-[#1a3a2a]">{item.title ?? "Sem título"}</p>
                      {item.clientName && <p className="text-xs text-gray-400">{item.clientName}</p>}
                    </div>
                    <button onClick={() => handleDeleteGallery(item.id)} className="text-red-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
