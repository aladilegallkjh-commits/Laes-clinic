import { Mail, MapPin, Phone, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">

              <div>
                <h3 className="font-bold text-lg">LAES Clinic</h3>
                <p className="text-xs text-white/70">Estética Facial Avançada</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Sua melhor versão, todos os dias.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Links Rápidos</h4>
            <ul className="space-y-2">
              {[
                { label: "Início", href: "#inicio" },
                { label: "Sobre", href: "#sobre" },
                { label: "Tratamentos", href: "#tratamentos" },
                { label: "Contato", href: "#contato" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Tratamentos</h4>
            <ul className="space-y-2">
              {[
                "Limpeza de Pele",
                "Microagulhamento Facial",
                "Pump Up (Bumbum)",
                "SkinBooster",
                "Terapia Capilar",
              ].map((treatment) => (
                <li key={treatment}>
                  <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                    {treatment}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/80" translate="no">Curitiba - <span translate="no">PR</span></span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <a href="tel:+5541984221384" className="text-sm text-white/80 hover:text-white transition-colors">
                  (41) 98422-1384
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <a href="mailto:contato@laesclinic.com.br" className="text-sm text-white/80 hover:text-white transition-colors">
                  contato@laesclinic.com.br
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/edilenelopes52?igsh=MWY5d2NkdW5ibWR0OA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent transition-colors flex items-center justify-center"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/5541984221384"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-white/70 text-center md:text-right flex flex-col md:flex-row items-center md:gap-2">
              <span>© 2024 LAES Clinic. Todos os direitos reservados.</span>
              <span className="hidden md:inline">|</span>
              <a href="/admin" className="hover:text-accent transition-colors mt-2 md:mt-0">Painel Admin</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
