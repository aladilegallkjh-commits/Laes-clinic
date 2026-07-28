import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    role: "Cliente",
    text: "Experiência transformadora! A clínica é linda, os profissionais são incríveis e os resultados falam por si. Recomendo muito!",
    rating: 5,
    image: "👩‍🦰",
  },
  {
    id: 2,
    name: "Ana Costa",
    role: "Cliente",
    text: "Fui muito bem atendida. Ótimas profissionais, simpáticas e falam com muita propriedade sobre cada procedimento.",
    rating: 5,
    image: "👩‍🦱",
  },
  {
    id: 3,
    name: "Carolina Martins",
    role: "Cliente",
    text: "Ambiente acolhedor, profissionais capacitadas e resultados que realmente funcionam. Voltei várias vezes!",
    rating: 5,
    image: "👩",
  },
  {
    id: 4,
    name: "Juliana Pereira",
    role: "Cliente",
    text: "A Dra. Edilene é muito atenciosa. Explicou tudo com clareza e os resultados superaram minhas expectativas.",
    rating: 5,
    image: "👩‍🦳",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-stone-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Depoimentos</span>
            <div className="w-1 h-6 bg-accent rounded-full" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground">
            O que dizem nossos clientes.
          </h2>
          <p className="text-lg text-muted-foreground">
            Histórias reais de transformação e satisfação
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-100 hover:border-accent/30 transform hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Junte-se a centenas de clientes satisfeitos
          </p>
          <button
            onClick={() => window.open("https://maps.google.com", "_blank")}
            className="text-primary font-semibold hover:text-primary/80 transition-colors inline-flex items-center gap-2"
          >
            Ver todas as avaliações no Google
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
