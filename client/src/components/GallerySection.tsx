export default function GallerySection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">
            Conheça nosso espaço sofisticado e acolhedor.
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/manus-storage/clinic-interior_cff5dda9.png"
                alt="Clínica"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
