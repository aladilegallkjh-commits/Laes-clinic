import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="inicio" className="relative pt-20 md:pt-32 pb-24 md:pb-32 overflow-hidden bg-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Subtitle with icon */}
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-1 h-8 bg-accent rounded-full" />
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">Bem-vindo à LAES Clinic</span>
            </div>

            {/* Main Heading - More dramatic */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Sua melhor
                <br />
                <span className="text-accent">versão</span>
              </h1>
              <p className="text-lg sm:text-2xl md:text-3xl font-light text-muted-foreground">
                todos os dias.
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: "200ms" }}>
              Cuidado integral, tecnologia avançada e resultados que transformam. Descubra tratamentos personalizados que valorizam sua beleza única e potencializam sua autoestima.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2 transition-all duration-300 hover:shadow-lg"
                onClick={() => window.open("https://wa.me/5541984221384", "_blank")}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.227l-.356.214-3.71-.973.992 3.63-.235.374a9.861 9.861 0 001.516 5.394c.732 1.092 1.7 2.034 2.834 2.687h.005c.842.505 1.817.865 2.835.99.92.119 1.871.044 2.777-.216l.374-.125 3.851 1.009-.988-3.652.236-.374a9.86 9.86 0 00.443-5.646 9.847 9.847 0 00-2.167-4.933A9.865 9.865 0 0011.25 6.98z" />
                </svg>
                Agendar Consulta
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 font-semibold gap-2 transition-all duration-300"
                onClick={() => document.getElementById("procedimentos")?.scrollIntoView({ behavior: "smooth" })}
              >
                Conheça os Procedimentos
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="pt-8 border-t border-stone-200 flex items-center gap-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-xs border-2 border-white"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Profissionais Especializados</p>
                <p className="text-xs text-muted-foreground">Tecnologia de Ponta</p>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Animated background shape */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl blur-2xl animate-pulse" />

            {/* Main image with sophisticated border */}
            <div className="relative z-10 w-full max-w-md">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-stone-200/50 backdrop-blur-sm">
                <img
                  src="/manus-storage/hero-woman-treatment_f8d0999d.png"
                  alt="Tratamento de estética facial"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating testimonial card */}
              <div className="absolute -bottom-12 -right-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs border border-stone-100 backdrop-blur-sm animate-float">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <p className="font-semibold text-foreground text-sm">Beleza que vem de dentro</p>
                </div>
                <p className="text-xs text-muted-foreground">reflete por fora.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
