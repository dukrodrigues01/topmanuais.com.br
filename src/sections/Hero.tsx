import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, BookOpen, Download, Headphones, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useScrollAnimation, useCountAnimation } from '@/hooks/useScrollAnimation';
import { useAdmin } from '@/context/AdminContext';

// Componente de partículas animadas (Restaurado e Otimizado)
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 127, 255, ${particle.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const { products } = useAdmin();
  const { ref: heroRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  // Dados dinâmicos com Fallback para evitar NaN
  const totalProducts = products?.length || 0;
  
  // Números simulados se o banco estiver vazio, números reais se houver produtos
  const displayManuals = totalProducts > 0 ? totalProducts : 12500;
  const displayDownloads = totalProducts > 0 ? (totalProducts * 42) : 85400;
  const displayCustomers = totalProducts > 0 ? (totalProducts * 15) : 12300;

  const manualsCount = useCountAnimation(displayManuals, 2000, 0);
  const downloadsCount = useCountAnimation(displayDownloads, 2000, 0);
  const customersCount = useCountAnimation(displayCustomers, 2000, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `#/busca?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-[70px] overflow-hidden bg-white"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/50" />
      
      {/* Visual Effects */}
      <ParticleField />
      
      {/* Decorative Blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Floating Geometric Shapes (Restauradas) */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-blue-500/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-blue-400/10 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
      <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-blue-600/20 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-6 h-6 border-2 border-blue-500/10 rounded-full animate-spin-slow" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Text & Actions */}
          <div className={`space-y-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-700 text-sm font-bold animate-fade-in">
              <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
              <span>Plataforma Líder em Manuais Técnicos</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-gray-900">
              O Manual que <br />
              <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Você Precisa
              </span>
              <br /> Está Aqui.
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 max-w-xl leading-relaxed font-medium">
              Acesso instantâneo a milhares de manuais de serviço, catálogos de peças e guias de reparo para maquinário agrícola, motos e pesados.
            </p>

            {/* Premium Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-lg group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex items-center">
                <Search className="absolute left-5 w-6 h-6 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Ex: Agrale 5075, Honda CB 500..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-36 h-18 rounded-2xl border-none shadow-2xl text-lg bg-white focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2.5 h-13 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  Buscar
                </Button>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 items-center text-sm font-bold text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Entrega Via E-mail
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Suporte Técnico
              </div>
            </div>

            {/* Stats Section (Blindagem total contra NaN) */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <p className="text-3xl font-black text-gray-900" ref={manualsCount.countRef}>
                  {(Number(manualsCount.count) || 0).toLocaleString('pt-BR')}+
                </p>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-tighter">Manuais em PDF</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-gray-900" ref={downloadsCount.countRef}>
                  {(Number(downloadsCount.count) || 0).toLocaleString('pt-BR')}+
                </p>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-tighter">Vendas Mensais</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-gray-900" ref={customersCount.countRef}>
                  {(Number(customersCount.count) || 0).toLocaleString('pt-BR')}+
                </p>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-tighter">Mecânicos Felizes</p>
              </div>
            </div>
          </div>

          {/* Right Side: High-Impact Visuals */}
          <div className={`hidden lg:block relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative group">
              {/* Main Image Wrapper */}
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white rotate-2 group-hover:rotate-0 transition-all duration-700 ease-out">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=1000&fit=crop"
                  alt="Suporte Técnico Profissional"
                  className="w-full h-auto scale-105 group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-transparent" />
              </div>

              {/* Floating Interface Cards */}
              <div className="absolute -left-12 top-1/4 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl z-20 border border-white animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                    <Download size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">PDF Original</p>
                    <p className="text-xs text-gray-500 font-bold uppercase">Download Imediato</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 bottom-1/4 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl z-20 border border-white animate-float-delayed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Headphones size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">Suporte VIP</p>
                    <p className="text-xs text-gray-500 font-bold uppercase">WhatsApp Online</p>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-[4rem] blur-2xl" />
            </div>
          </div>

        </div>
      </div>
      
      {/* Estilos Extras de Animação */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite; animation-delay: 1s; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
      `}</style>
    </section>
  );
}