import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { label: "Profissionais Especializados", icon: "👨‍⚕️" },
  { label: "Tecnologia Avançada", icon: "🔬" },
  { label: "Procedimentos Seguros", icon: "✓" },
  { label: "Resultados Naturais", icon: "✨" },
];

export default function AboutSection() {
  return (
    <section id="sobre" className="py-20 md:py-28 bg-primary text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <div className="relative hidden lg:block">
            {/* Decorative circle */}
            <div className="absolute -top-12 -left-12 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

            {/* Main image with border */}
            <div className="relative z-10">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white/20">
                <img
                  src="/manus-storage/clinic-interior_cff5dda9.png"
                  alt="Interior da LAES Clinic"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Logo overlay */}
              <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">

                <p className="text-sm font-semibold text-primary">LAES Clinic</p>
                <p className="text-xs text-muted-foreground">Estética Facial</p>
              </div>
            </div>
          </div>

          {/* Right Column - Text */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Section Label */}
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Sobre a Clínica</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Mais que estética,
                <br />
                é sobre você.
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg text-white/90 leading-relaxed">
              Na LAES Clinic, unimos clínica, tecnologia e um olhar integrativo para oferecer tratamentos personalizados que valorizam a sua beleza única.
            </p>

            <p className="text-lg text-white/90 leading-relaxed">
              Nosso compromisso é cuidar de você por inteiro, de dentro para fora.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{feature.label}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
