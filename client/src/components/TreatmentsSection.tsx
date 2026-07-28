import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const treatments = [
  {
    id: 1,
    name: "Limpeza de Pele",
    description: "Remove impurezas, controla a oleosidade e renova a pele, deixando a saúde e iluminada.",
    icon: "face",
  },
  {
    id: 2,
    name: "Microagulhamento Facial",
    description: "Estimula o colágeno, melhora textura, poros, linhas finas e marcas de acne.",
    icon: "needle",
  },
  {
    id: 3,
    name: "Pump Up (Bumbum)",
    description: "Tecnologia que promove firmeza, efeito lifting imediato e estímulo do bumbum.",
    icon: "lift",
  },
  {
    id: 4,
    name: "SkinBooster",
    description: "Hidratação profunda que devolve vço, elasticidade e luminosidade à pele.",
    icon: "droplet",
  },
  {
    id: 5,
    name: "Terapia Capilar",
    description: "Cuida do couro cabelo e dos fios, fortalece, reduz a queda e estimula o crescimento saudável.",
    icon: "hair",
  },
];

const renderIcon = (iconType: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    face: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <circle cx="9" cy="9" r="1.5" />
        <circle cx="15" cy="9" r="1.5" />
        <path d="M9 15c1 1 2 2 3 2s2-1 3-2" />
      </svg>
    ),
    needle: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M2 12h20" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    lift: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 5v14M5 12h14M12 5l-3 3M12 5l3 3" />
      </svg>
    ),
    droplet: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2c0 0-5 7-5 10c0 2.76 2.24 5 5 5s5-2.24 5-5c0-3-5-10-5-10z" />
      </svg>
    ),
    hair: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 8c0-2 2-4 6-4s6 2 6 4v2H6V8z" />
        <path d="M8 10v8M12 10v8M16 10v8" />
      </svg>
    ),
  };
  return iconMap[iconType] || iconMap.face;
};

export default function TreatmentsSection() {
  return (
    <section id="tratamentos" className="py-20 md:py-28 bg-gradient-to-b from-white to-stone-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2C12 2 8 6 8 12c0 4.4 2.2 8 4 8s4-3.6 4-8c0-6-4-10-4-10z" strokeWidth="2" />
            </svg>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Tratamentos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Tecnologia e cuidado para realçar sua beleza natural.</h2>
        </div>

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {treatments.map((treatment) => (
            <div
              key={treatment.id}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 hover:border-accent/30 cursor-pointer"
            >
              {/* Icon Circle */}
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors text-primary group-hover:text-accent transition-colors">
                {renderIcon(treatment.icon)}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {treatment.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {treatment.description}
              </p>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary/5 font-semibold gap-2"
          >
            Ver Todos os Tratamentos
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
