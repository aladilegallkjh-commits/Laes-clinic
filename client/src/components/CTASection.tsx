import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-stone-50 to-white">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left Column - Text */}
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  Pronta para transformar sua pele e elevar sua autoestima?
                </h2>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Agende sua avaliação personalizada e descubra o melhor tratamento para você.
              </p>

              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2 w-full md:w-auto"
                  onClick={() => window.open("https://wa.me/5541984221384", "_blank")}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.227l-.356.214-3.71-.973.992 3.63-.235.374a9.861 9.861 0 001.516 5.394c.732 1.092 1.7 2.034 2.834 2.687h.005c.842.505 1.817.865 2.835.99.92.119 1.871.044 2.777-.216l.374-.125 3.851 1.009-.988-3.652.236-.374a9.86 9.86 0 00.443-5.646 9.847 9.847 0 00-2.167-4.933A9.865 9.865 0 0011.25 6.98z" />
                  </svg>
                  Agendar via WhatsApp
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="hidden md:block relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
              <img
                src="/manus-storage/botanical-pattern_9c3356a5.png"
                alt="Padrão botânico"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
