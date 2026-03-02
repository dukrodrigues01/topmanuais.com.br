import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section 
      ref={ref}
      className="relative py-24 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0040ff] via-[#007fff] to-[#00bfff]" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div 
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto para Encontrar Seu Manual?
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de clientes satisfeitos e tenha acesso instantâneo 
            à maior biblioteca de manuais do Brasil.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/manuais">
              <Button 
                size="lg"
                className="bg-white text-[#007fff] hover:bg-white/90 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300 px-8"
              >
                Começar Agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/categorias">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 px-8"
              >
                Explorar Categorias
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div 
            className={`flex flex-wrap justify-center gap-6 sm:gap-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-2 text-white/90">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">100% Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Download Imediato</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Headphones className="w-5 h-5" />
              <span className="text-sm font-medium">Suporte 24h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
