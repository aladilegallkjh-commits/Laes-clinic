import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import heroImage from "@/assets/hero-woman.jpg";
import clinicImage from "@/assets/doutora/doutora-1.jpeg";
import logoMark from "@/assets/logo-mark.png";

import res1 from "@/assets/resultados/res-1.jpeg";
import res2 from "@/assets/resultados/res-2.jpeg";
import res3 from "@/assets/resultados/res-3.jpeg";
import res4 from "@/assets/resultados/res-4.jpeg";
import res5 from "@/assets/resultados/res-5.jpeg";
import res6 from "@/assets/resultados/res-6.jpeg";
import res7 from "@/assets/resultados/res-7.jpeg";
import res8 from "@/assets/resultados/res-8.jpeg";
import res9 from "@/assets/resultados/res-9.jpeg";
import res10 from "@/assets/resultados/res-10.jpeg";

const resultsPhotos = [res1, res2, res3, res4, res5, res6, res7, res8, res9, res10];
import { Reveal } from "@/components/Reveal";
import {
  MapPin,
  Clock,
  Phone,
  Instagram,
  MessageCircle,
  Sparkles,
  Leaf,
  Droplet,
  Scissors,
  Syringe,
  ShieldCheck,
  Award,
  Users,
  Heart,
  Star,
  ArrowRight,
  Menu,
  X,
  Waves,
  Zap,
  Snowflake,
  Activity,
  CalendarDays,
  Quote,
} from "lucide-react";

/* ---------------------------------- mock data --------------------------------- */

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Tratamentos", href: "#tratamentos" },
  { label: "Tecnologias", href: "#tecnologias" },
  { label: "Resultados", href: "#resultados" },

  { label: "Contato", href: "#contato" },
];

const treatments = [
  {
    icon: Sparkles,
    title: "Limpeza de Pele",
    desc: "Remove impurezas, controla a oleosidade e renova a pele, deixando-a saudável e iluminada.",
    tag: "Facial",
    duration: "60 min",
    price: "R$ 180",
  },
  {
    icon: Syringe,
    title: "Microagulhamento",
    desc: "Estimula o colágeno, melhora textura, poros, linhas finas e marcas de acne.",
    tag: "Facial",
    duration: "50 min",
    price: "R$ 320",
  },
  {
    icon: Heart,
    title: "Pump Up (Bumbum)",
    desc: "Firmeza, efeito lifting imediato e estímulo ao rejuvenescimento do glúteo.",
    tag: "Corporal",
    duration: "45 min",
    price: "R$ 250",
  },
  {
    icon: Droplet,
    title: "Skinbooster",
    desc: "Hidratação profunda que devolve viço, elasticidade e luminosidade à pele.",
    tag: "Facial",
    duration: "40 min",
    price: "R$ 690",
  },
  {
    icon: Scissors,
    title: "Massagem Modeladora",
    desc: "Modela o contorno corporal, reduz medidas e combate a flacidez.",
    tag: "Corporal",
    duration: "60 min",
    price: "R$ 160",
  },
  {
    icon: Waves,
    title: "Drenagem Linfática",
    desc: "Reduz retenção de líquidos, desincha e melhora a circulação do corpo todo.",
    tag: "Corporal",
    duration: "60 min",
    price: "R$ 150",
  },
];

const technologies = [
  {
    icon: Zap,
    name: "Radiofrequência",
    desc: "Aquecimento profundo que retrai fibras e estimula colágeno novo.",
  },
  {
    icon: Snowflake,
    name: "Criolipólise",
    desc: "Congelamento seletivo das células de gordura localizada.",
  },
  {
    icon: Activity,
    name: "Ultrassom Focado",
    desc: "Lifting não invasivo com efeito progressivo e natural.",
  },
  {
    icon: Sparkles,
    name: "LED Terapia",
    desc: "Luz calibrada para acne, manchas e reparação celular.",
  },
];

const stats = [
  { value: "12+", label: "Anos de experiência" },
  { value: "3.500", label: "Atendimentos realizados" },
  { value: "28", label: "Protocolos exclusivos" },
  { value: "4,9", label: "Avaliação das clientes" },
];

const results = [
  {
    name: "Protocolo Glow Facial",
    detail: "8 sessões · Melasma e textura",
    metric: "-72% de manchas",
  },
  {
    name: "Contorno Corporal",
    detail: "10 sessões · Abdômen e flancos",
    metric: "-9 cm de medidas",
  },
  {
    name: "Lifting Sem Cirurgia",
    detail: "4 sessões · Terço inferior",
    metric: "+40% de firmeza",
  },
];

const testimonials = [
  {
    name: "Marina Alves",
    role: "Cliente desde 2022",
    text: "Minha pele nunca esteve tão saudável. O atendimento é acolhedor e cada protocolo é pensado para mim.",
  },
  {
    name: "Juliana Prado",
    role: "Protocolo corporal",
    text: "Resultados visíveis já na quarta sessão. A estrutura da clínica é impecável e super acolhedora.",
  },
  {
    name: "Camila Ferraz",
    role: "Skinbooster",
    text: "Saí de lá com a autoestima renovada. Profissionalismo e cuidado do início ao fim.",
  },
];

const posts = [
  {
    title: "Como montar uma rotina de skincare que realmente funciona",
    date: "12 Mar 2024",
    category: "Facial",
  },
  {
    title: "Drenagem linfática: quantas sessões são necessárias?",
    date: "28 Fev 2024",
    category: "Corporal",
  },
  {
    title: "Colágeno: o que estimula e o que destrói a sua produção",
    date: "05 Fev 2024",
    category: "Bem-estar",
  },
];

const values = [
  { icon: Users, label: "Profissionais Especializados" },
  { icon: Sparkles, label: "Tecnologia Avançada" },
  { icon: ShieldCheck, label: "Procedimentos Seguros" },
  { icon: Leaf, label: "Resultados Naturais" },
];

const marquee = [
  "Estética Facial",
  "Estética Corporal",
  "Protocolos Personalizados",
  "Tecnologia Avançada",
  "Cuidado Integrativo",
];

const PHONE = "5541984221384";
const DEFAULT_MSG = encodeURIComponent("Olá, Dra. Edilene! Vim pelo site e gostaria de agendar uma consulta. 😊");
const WHATSAPP = `https://wa.me/${PHONE}?text=${DEFAULT_MSG}`;

function whatsappLink(treatment: string) {
  const msg = encodeURIComponent(`Olá, Dra. Edilene! Vim pelo site e tenho interesse no tratamento de *${treatment}*. Gostaria de agendar uma consulta. 😊`);
  return `https://wa.me/${PHONE}?text=${msg}`;
}

/* ------------------------------------ ui ------------------------------------- */

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#inicio" className="group flex min-w-0 items-center gap-3">
      <img
        src={logoMark}
        alt="LAES Clinic"
        className="h-11 w-11 shrink-0 object-contain transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
        width={512}
        height={512}
      />
      <div className="min-w-0 leading-tight">
        <div className={`font-serif text-xl sm:text-2xl ${light ? "text-cream" : "text-primary"}`}>
          LAES Clinic
        </div>
        <div
          className={`truncate text-[9px] tracking-[0.2em] sm:text-[10px] ${
            light ? "text-gold-soft" : "text-muted-foreground"
          }`}
        >
          ESTÉTICA FACIAL E CORPORAL
        </div>
      </div>
    </a>
  );
}

function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div
      className={`mb-3 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] ${
        light ? "text-gold-soft" : "text-gold"
      }`}
    >
      <span className="h-px w-8 bg-gold/50 sm:w-12" />
      <Leaf className="h-3.5 w-3.5" />
      {children}
      <Leaf className="h-3.5 w-3.5" />
      <span className="h-px w-8 bg-gold/50 sm:w-12" />
    </div>
  );
}

function CtaButton({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "gold";
  className?: string;
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-[11px] font-medium tracking-[0.18em] transition-all duration-300 active:scale-[0.97]";
  const styles = {
    solid:
      "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5",
    outline:
      "border border-primary/40 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5",
    gold: "border border-gold/60 text-cream hover:bg-gold hover:text-primary hover:-translate-y-0.5",
  }[variant];

  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </a>
  );
}

/* ---------------------------------- components ------------------------------- */

function ResultsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 }
    }
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // We use the imported photos array
  const slots = resultsPhotos;

  return (
    <div className="relative mt-14 px-4 sm:px-12">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {slots.map((src, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
              <Reveal delay={i * 80}>
                <div className="card-lift glass-card overflow-hidden rounded-3xl aspect-[4/5] flex items-center justify-center bg-black/5">
                  <img src={src} alt={`Resultado ${i + 1}`} className="h-full w-full object-contain" />
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-primary shadow-lg ring-1 ring-gold/40 transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 sm:-left-4"
        aria-label="Anterior"
      >
        <ArrowRight className="h-5 w-5 rotate-180" />
      </button>
      
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-primary shadow-lg ring-1 ring-gold/40 transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 sm:-right-4"
        aria-label="Próximo"
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ---------------------------------- page ------------------------------------- */

export default function Home() {

  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const adminBar = user?.role === "admin" ? (
    <div className="bg-green-700 text-white py-3 px-4 z-[100] relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="text-sm">Você está logado como administrador</span>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate("/admin")}
            className="text-white border-white hover:bg-white hover:text-green-700"
          >
            Ir para Admin
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => logout()}
            className="text-white border-white hover:bg-white hover:text-green-700"
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  ) : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState<"Todos" | "Facial" | "Corporal">("Todos");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const visibleTreatments =
    filter === "Todos" ? treatments : treatments.filter((t) => t.tag === filter);

  return (
    <div className="w-full">
      {adminBar}
      <div id="inicio" className="min-h-screen overflow-x-hidden text-foreground">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-[11px] sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden sm:gap-5">
            <span className="flex shrink-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold" /> Curitiba - PR
            </span>
            <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
              <Clock className="h-3.5 w-3.5 text-gold" /> Seg - Sex: 9h às 18h
            </span>
            <span className="hidden shrink-0 items-center gap-1.5 md:flex">
              <Phone className="h-3.5 w-3.5 text-gold" /> (41) 98422-1384
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-gold">
            <a href="https://www.instagram.com/edilenelopes52?igsh=MWY5d2NkdW5ibWR0OA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-transform hover:scale-125">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={WHATSAPP} aria-label="WhatsApp" className="transition-transform hover:scale-125">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? "border-white/30 glass-strong py-1 shadow-sm"
            : "border-transparent bg-white/20 backdrop-blur-md py-2"
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-2 sm:px-6 lg:flex lg:justify-between">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-primary lg:flex">
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="relative py-1 transition-colors hover:text-gold after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 justify-self-end">
            <CtaButton href={WHATSAPP} className="hidden !px-5 !py-2.5 sm:inline-flex">
              AGENDAR
              <MessageCircle className="h-4 w-4 text-gold" />
            </CtaButton>
            <button
              type="button"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-primary hover:text-primary-foreground lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden border-t border-white/20 glass-strong transition-[max-height,opacity] duration-500 lg:hidden ${
            menuOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {navItems.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: `${i * 40}ms` }}
                className={`border-b border-border/40 py-3 text-sm text-primary transition-all duration-300 hover:pl-2 hover:text-gold ${
                  menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
              >
                {n.label}
              </a>
            ))}
            <CtaButton href={WHATSAPP} className="mt-5">
              AGENDAR VIA WHATSAPP
              <MessageCircle className="h-4 w-4 text-gold" />
            </CtaButton>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-gold-soft/25 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-rise">

            <h1 className="mt-6 font-serif text-[2.6rem] leading-[1.05] text-primary sm:text-5xl md:text-6xl">
              Sua melhor versão,
              <br />
              <span className="gold-text font-script text-5xl md:text-6xl">todos os dias.</span>
            </h1>
            <div className="my-7 flex items-center gap-3">
              <span className="h-px w-16 bg-gold/60" />
              <Leaf className="h-4 w-4 text-gold" />
              <span className="h-px w-16 bg-gold/60" />
            </div>
            <p className="max-w-md text-xs uppercase leading-relaxed tracking-[0.22em] text-muted-foreground sm:text-sm">
              Cuidado, tecnologia e resultados para uma pele saudável e um corpo em harmonia.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 sm:gap-4">
              <CtaButton href={WHATSAPP}>
                AGENDAR CONSULTA
                <Leaf className="h-4 w-4 text-gold transition-transform group-hover:rotate-12" />
              </CtaButton>
              <CtaButton href="#tratamentos" variant="outline">
                NOSSOS TRATAMENTOS
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </CtaButton>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-gold-soft/50 to-primary/10 blur-3xl" />
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full border-8 border-cream shadow-2xl transition-transform duration-700 hover:scale-[1.02] lg:max-w-lg">
              <img
                src={heroImage}
                alt="Tratamento de estética facial na LAES Clinic"
                className="h-full w-full object-cover"
                width={900}
                height={1024}
              />
            </div>
            <div className="absolute -bottom-3 right-0 flex h-28 w-28 animate-float flex-col items-center justify-center rounded-full border border-gold/60 bg-cream p-3 text-center text-[9px] uppercase leading-tight tracking-widest text-primary shadow-xl sm:h-32 sm:w-32 sm:text-[10px] md:right-4">
              <Leaf className="mb-1 h-4 w-4 text-gold" />
              Beleza que vem de dentro, reflete por fora.
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-y border-white/30 glass py-3">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
            {[...marquee, ...marquee, ...marquee, ...marquee].map((m, i) => (
              <span
                key={i}
                className="flex items-center gap-10 text-[11px] uppercase tracking-[0.3em] text-primary/60"
              >
                {m} <Leaf className="h-3 w-3 text-gold" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="sobre"
        className="relative overflow-hidden glass-primary py-20 text-primary-foreground"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <Reveal from="left">
            <div className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-gold">
              Sobre a Clínica <span className="h-px w-12 bg-gold/60" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl">
              Mais que estética,
              <br />é sobre você.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/80">
              Na LAES Clinic, unimos ciência, tecnologia e um olhar integrativo para oferecer
              tratamentos faciais e corporais personalizados que valorizam a sua beleza única.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/80">
              Nosso compromisso é cuidar de você por inteiro, de dentro para fora.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {values.map((v, i) => (
                <Reveal key={v.label} delay={i * 100} from="scale">
                  <div className="group flex flex-col items-center text-center">
                    <v.icon
                      className="mb-2 h-7 w-7 text-gold transition-transform duration-500 group-hover:scale-125"
                      strokeWidth={1.4}
                    />
                    <span className="text-[10px] uppercase tracking-widest text-cream/80">
                      {v.label}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <CtaButton href="#contato" variant="gold" className="mt-10">
              CONHEÇA A DRA. EDILENE LOPES
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </CtaButton>
          </Reveal>

          <Reveal from="right" delay={120}>
            <div className="mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full border-8 border-primary shadow-2xl ring-1 ring-gold/40 transition-transform duration-700 hover:scale-[1.02] lg:max-w-lg">
              <img
                src={clinicImage}
                alt="Recepção da LAES Clinic em Curitiba"
                className="h-full w-full object-cover"
                loading="lazy"
                width={1024}
                height={900}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Treatments */}
      <section id="tratamentos" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center">
            <SectionLabel>Tratamentos</SectionLabel>
            <h2 className="mx-auto max-w-2xl font-serif text-3xl text-primary sm:text-4xl md:text-5xl">
              Tecnologia e cuidado para realçar sua beleza natural.
            </h2>
          </Reveal>

          <Reveal delay={120} className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full glass p-1">
              {(["Todos", "Facial", "Corporal"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
                    filter === f
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTreatments.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <article className="card-lift group h-full glass-card rounded-3xl p-7 text-center flex flex-col">
                  <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-primary text-gold shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <t.icon className="h-9 w-9" strokeWidth={1.4} />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-gold">{t.tag}</span>
                  <h3 className="mb-3 mt-2 font-sans text-xs font-semibold uppercase tracking-widest text-primary">
                    {t.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                  <div className="mt-6 border-t border-white/30 pt-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center justify-center gap-1.5 mb-3">
                      <Clock className="h-3.5 w-3.5 text-gold" /> {t.duration}
                    </span>
                    <a
                      href={whatsappLink(t.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-1.5 text-[10px] uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                      Agendar este tratamento
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100} className="mt-12 text-center">
            <CtaButton href={WHATSAPP} variant="outline">
              VER TODOS OS TRATAMENTOS
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </CtaButton>
          </Reveal>
        </div>
      </section>

      {/* Technologies */}
      <section id="tecnologias" className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center">
            <SectionLabel>Tecnologias</SectionLabel>
            <h2 className="mx-auto max-w-2xl font-serif text-3xl text-primary sm:text-4xl">
              Equipamentos de última geração, protocolos sob medida.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((tech, i) => (
              <Reveal key={tech.name} delay={i * 90} from="up">
                <div className="card-lift group relative h-full overflow-hidden rounded-3xl glass-card p-7">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold-soft/30 transition-transform duration-700 group-hover:scale-150" />
                  <tech.icon
                    className="relative mb-5 h-8 w-8 text-gold transition-transform duration-500 group-hover:-translate-y-1"
                    strokeWidth={1.4}
                  />
                  <h3 className="relative font-serif text-2xl text-primary">{tech.name}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {tech.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>



      {/* Results */}
      <section id="resultados" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center">
            <SectionLabel>Resultados</SectionLabel>
            <h2 className="mx-auto max-w-2xl font-serif text-3xl text-primary sm:text-4xl">
              Protocolos que entregam resultado real.
            </h2>
          </Reveal>

          {/* Carrossel de fotos — aguardando imagens do PDF */}
          <ResultsCarousel />
        </div>
      </section>



      {/* CTA */}
      <section id="contato" className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-soft/20 blur-3xl" />
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center" from="scale">
          <div className="mx-auto mb-6 grid h-16 w-16 animate-float place-items-center rounded-full border border-gold/50 glass">
            <Leaf className="h-6 w-6 text-gold" />
          </div>
          <div className="mx-auto max-w-2xl rounded-3xl glass-strong p-10">
            <h2 className="font-serif text-3xl text-primary md:text-4xl">
              Pronta para transformar sua pele
              <br className="hidden sm:block" /> e elevar sua autoestima?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              Agende sua avaliação personalizada e descubra o melhor tratamento facial ou corporal
              para você.
            </p>
            <CtaButton href={WHATSAPP} className="mt-8 !px-8 !py-4">
              AGENDAR VIA WHATSAPP
              <MessageCircle className="h-4 w-4 text-gold" />
            </CtaButton>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden glass-primary py-16 text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light />
            <p className="mt-6 font-script text-2xl text-gold">
              Sua melhor versão,
              <br /> todos os dias.
            </p>
            <div className="mt-4 flex gap-3 text-gold">
              <a href="https://www.instagram.com/edilenelopes52?igsh=MWY5d2NkdW5ibWR0OA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-transform hover:scale-125">
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={WHATSAPP}
                aria-label="WhatsApp"
                className="transition-transform hover:scale-125"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-gold">
              Links Rápidos
            </h4>
            <ul className="space-y-2 text-sm text-cream/80">
              {navItems.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="inline-block transition-all hover:translate-x-1 hover:text-gold"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-gold">
              Tratamentos
            </h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>Limpeza de Pele</li>
              <li>Microagulhamento Facial</li>
              <li>Skinbooster</li>
              <li>Pump Up (Bumbum)</li>
              <li>Massagem Modeladora</li>
              <li>Drenagem Linfática</li>
              <li>Radiofrequência Corporal</li>
              <li>Criolipólise</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-gold">
              Contato
            </h4>
            <ul className="space-y-3 text-sm text-cream/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" /> (41) 98422-1384
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> Curitiba - PR
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" /> Seg - Sex: 9h às 18h
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-gold" /> @edilenelopes52
              </li>
            </ul>
            <CtaButton href={WHATSAPP} variant="gold" className="mt-5 !px-5 !py-2.5">
              AGENDAR CONSULTA
              <Award className="h-3.5 w-3.5" />
            </CtaButton>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-cream/10 px-6 pt-6 text-center text-[11px] text-cream/60">
          © 2024 LAES Clinic. Todos os direitos reservados. Desenvolvido com{" "}
          <Heart className="inline h-3 w-3 fill-gold text-gold" /> para realçar sua melhor versão.
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={WHATSAPP}
        aria-label="Falar no WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-gold shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-gold hover:text-primary"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute inset-0 animate-ping rounded-full bg-gold/25" />
      </a>
    </div>
    </div>
  );
}
