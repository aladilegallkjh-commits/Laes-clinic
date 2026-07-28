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

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold gap-2"
                onClick={() => window.open("https://wa.me/5541984221384", "_blank")}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.227l-.356.214-3.71-.973.992 3.63-.235.374a9.861 9.861 0 001.516 5.394c.732 1.092 1.7 2.034 2.834 2.687h.005c.842.505 1.817.865 2.835.99.92.119 1.871.044 2.777-.216l.374-.125 3.851 1.009-.988-3.652.236-.374a9.86 9.86 0 00.443-5.646 9.847 9.847 0 00-2.167-4.933A9.865 9.865 0 0011.25 6.98z" />
                </svg>
                Conheça a Dra. Edilene Lopes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
