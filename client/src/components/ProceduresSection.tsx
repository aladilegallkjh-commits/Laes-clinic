import { Button } from "@/components/ui/button";

const procedures = [
  {
    id: 1,
    name: "Limpeza de Pele",
    desc: "Remove impurezas, controla a oleosidade e renova a pele.",
    icon: "👤",
  },
  {
    id: 2,
    name: "Microagulhamento Facial",
    desc: "Estimula colágeno, melhora textura, poros e linhas finas.",
    icon: "✨",
  },
  {
    id: 3,
    name: "Pump Up (Bumbum)",
    desc: "Tecnologia que promove firmeza e efeito lifting imediato.",
    icon: "💧",
  },
  {
    id: 4,
    name: "SkinBooster",
    desc: "Hidratação profunda que devolve viço e elasticidade.",
    icon: "💧",
  },
  {
    id: 5,
    name: "Terapia Capilar",
    desc: "Cuida do couro cabelo, fortalece e estimula crescimento.",
    icon: "🌿",
  },
];

export default function ProceduresSection() {
  return (
    <section id="procedimentos" className="py-20 md:py-28 bg-gradient-to-b from-stone-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">
            Tecnologia e cuidado para realçar sua beleza natural.
          </h2>
          <p className="text-lg text-muted-foreground">
            Cada procedimento é personalizado para suas necessidades específicas
          </p>
        </div>

        {/* Procedures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {procedures.map((procedure) => (
            <div
              key={procedure.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-stone-100"
            >
              <div className="text-4xl mb-4">{procedure.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{procedure.name}</h3>
              <p className="text-sm text-muted-foreground">{procedure.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary/5"
            onClick={() => window.open("https://wa.me/5541984221384", "_blank")}
          >
            Ver todos os tratamentos →
          </Button>
        </div>
      </div>
    </section>
  );
}
