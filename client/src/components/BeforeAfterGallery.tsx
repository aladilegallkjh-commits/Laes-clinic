import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GalleryItem {
  id: number;
  procedureId: number;
  beforeImage: string;
  afterImage: string;
  title?: string | null;
  description?: string | null;
  clientName?: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function BeforeAfterGallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");

  // Buscar galeria pública (sem autenticação necessária)
  const { data: gallery = [] } = trpc.admin.gallery.list.useQuery();

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsOpen(true);
    setActiveTab("before");
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Resultados Reais
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Veja a transformação que nossos procedimentos proporcionam. Cada foto conta uma história de confiança e beleza.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item: GalleryItem) => (
            <div
              key={item.id}
              className="group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              onClick={() => openModal(item)}
            >
              {/* Before Image */}
              <div className="relative h-80 overflow-hidden bg-gray-200">
                <img
                  src={item.beforeImage}
                  alt="Antes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ANTES
                </div>
              </div>

              {/* Card Info */}
              <div className="p-4 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title || "Transformação"}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {item.clientName ? `Cliente: ${item.clientName}` : "Resultado"}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Ver Depois →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {gallery.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Galeria em construção. Em breve, você verá os resultados incríveis dos nossos procedimentos!
            </p>
          </div>
        )}
      </div>

      {/* Modal Antes/Depois */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          {selectedItem && (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedItem.title || "Transformação"}
                </h2>
                {selectedItem.description && (
                  <p className="text-gray-600 mt-2">{selectedItem.description}</p>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setActiveTab("before")}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === "before"
                      ? "border-b-2 border-red-500 text-red-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  ANTES
                </button>
                <button
                  onClick={() => setActiveTab("after")}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === "after"
                      ? "border-b-2 border-green-500 text-green-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  DEPOIS
                </button>
              </div>

              {/* Image */}
              <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden">
                {activeTab === "before" ? (
                  <img
                    src={selectedItem.beforeImage}
                    alt="Antes"
                    className="w-full h-auto"
                  />
                ) : (
                  <img
                    src={selectedItem.afterImage}
                    alt="Depois"
                    className="w-full h-auto"
                  />
                )}
              </div>

              {/* Client Info */}
              {selectedItem.clientName && (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Cliente:</strong> {selectedItem.clientName}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
