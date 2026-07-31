import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AdminLogin from "./AdminLogin";

export default function AdminGallery() {
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [procedureId, setProcedureId] = useState("1");
  const isLoggedIn = localStorage.getItem('adminToken') === 'true';

  const { data: gallery, refetch } = trpc.admin.gallery.list.useQuery();
  const { data: procedures } = trpc.admin.procedures.list.useQuery();
  const createGalleryMutation = trpc.admin.gallery.create.useMutation();
  const deleteGalleryMutation = trpc.admin.gallery.delete.useMutation();

  if (!isLoggedIn) {
    return <AdminLogin />;
  }
  const handleAddGallery = async () => {
    if (!beforeImage || !afterImage) {
      toast.error("Adicione as imagens antes e depois");
      return;
    }

    try {
      await createGalleryMutation.mutateAsync({
        procedureId: parseInt(procedureId),
        beforeImage,
        afterImage,
        title: title || undefined,
        description: description || undefined,
        clientName: clientName || undefined,
      });
      setBeforeImage("");
      setAfterImage("");
      setTitle("");
      setDescription("");
      setClientName("");
      toast.success("Galeria adicionada com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao adicionar galeria");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteGalleryMutation.mutateAsync({ id });
      toast.success("Galeria removida!");
      refetch();
    } catch (error) {
      toast.error("Erro ao remover galeria");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gerenciar Galeria Antes/Depois</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Resultado</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Procedimento</label>
                <select
                  value={procedureId}
                  onChange={(e) => setProcedureId(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded"
                >
                  {procedures?.map((proc: any) => (
                    <option key={proc.id} value={proc.id}>
                      {proc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL Imagem Antes</label>
                <Input
                  placeholder="https://exemplo.com/antes.jpg"
                  value={beforeImage}
                  onChange={(e) => setBeforeImage(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL Imagem Depois</label>
                <Input
                  placeholder="https://exemplo.com/depois.jpg"
                  value={afterImage}
                  onChange={(e) => setAfterImage(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Título (opcional)</label>
                <Input
                  placeholder="Ex: Transformação com Microagulhamento"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição (opcional)</label>
                <Textarea
                  placeholder="Descreva o procedimento e resultados"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nome do Cliente (opcional)</label>
                <Input
                  placeholder="Ex: Cliente A"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <Button onClick={handleAddGallery} className="w-full bg-green-700">
                Adicionar à Galeria
              </Button>
            </div>
          </Card>

          {/* Lista */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Galeria ({gallery?.length || 0})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {gallery?.map((item: any) => (
                <div key={item.id} className="p-3 bg-gray-100 rounded flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.title || "Sem título"}</p>
                    <p className="text-xs text-gray-600">
                      {item.clientName ? `Cliente: ${item.clientName}` : "Sem nome"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <img
                        src={item.beforeImage}
                        alt="Antes"
                        className="w-8 h-8 rounded object-cover"
                      />
                      <img
                        src={item.afterImage}
                        alt="Depois"
                        className="w-8 h-8 rounded object-cover"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
