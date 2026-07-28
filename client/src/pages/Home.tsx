import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProceduresSection from "@/components/ProceduresSection";
import GallerySection from "@/components/GallerySection";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="w-full">
      <Header />
      
      {/* Admin Bar */}
      {user?.role === "admin" && (
        <div className="bg-green-700 text-white py-3 px-4">
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
      )}

      <main className="w-full">
        <HeroSection />
        <ProceduresSection />
        <BeforeAfterGallery />
        <GallerySection />
        <TestimonialsSection />
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
