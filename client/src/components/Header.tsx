import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Tratamentos", href: "#tratamentos" },
    { label: "Tecnologias", href: "#tecnologias" },
    { label: "Resultados", href: "#resultados" },
    { label: "Blog", href: "#blog" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">

          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-primary">LAES Clinic</h1>
            <p className="text-xs text-muted-foreground">Estética Facial</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Button + Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            className="hidden sm:flex gap-2 bg-primary hover:bg-primary/90 text-white"
            onClick={() => window.open("https://wa.me/5541984221384", "_blank")}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.227l-.356.214-3.71-.973.992 3.63-.235.374a9.861 9.861 0 001.516 5.394c.732 1.092 1.7 2.034 2.834 2.687h.005c.842.505 1.817.865 2.835.99.92.119 1.871.044 2.777-.216l.374-.125 3.851 1.009-.988-3.652.236-.374a9.86 9.86 0 00.443-5.646 9.847 9.847 0 00-2.167-4.933A9.865 9.865 0 0011.25 6.98z" />
            </svg>
            Agendar Consulta
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="lg:hidden border-t border-stone-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-stone-50 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
