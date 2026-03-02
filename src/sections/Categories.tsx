import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, Smartphone, Home, Laptop, Tv, Cog, Wrench, 
  FileText, ArrowRight, Truck, Tractor, Bike 
} from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { useAdmin } from '@/context/AdminContext';

// Mapeamento de ícones expandido para cobrir mais nichos
const iconMap: Record<string, React.ElementType> = {
  Car,
  Smartphone,
  Home,
  Laptop,
  Tv,
  Cog,
  Wrench,
  FileText,
  Truck,
  Tractor,
  Bike
};

export function Categories() {
  const { categories, products } = useAdmin();
  
  // Filtra categorias que possuem produtos publicados (Estratégia Anti-Thin Content para SEO)
  const activeCategories = useMemo(() => {
    return categories.filter(category => {
      const count = products.filter(p => 
        p.category === category.slug && p.status === 'published'
      ).length;
      
      // Adicionamos o count dinâmico ao objeto para usar no JSX
      (category as any).dynamicCount = count;
      
      return count > 0;
    });
  }, [categories, products]);

  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { containerRef, visibleItems } = useStaggerAnimation(activeCategories.length, 80);

  // Se não houver categorias com produtos, a seção nem aparece (Economia de espaço/SEO)
  if (activeCategories.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50/50" id="categorias">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explorar Catálogo Profissional
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#007fff] to-[#00bfff] mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Categorias organizadas por especialistas para facilitar sua busca técnica.
          </p>
        </div>

        {/* Categories Grid */}
        <div 
          ref={containerRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {activeCategories.map((category, index) => {
            const Icon = iconMap[category.icon || ''] || FileText;
            const count = (category as any).dynamicCount;

            return (
              <Link
                key={category.id}
                to={`/categoria/${category.slug}`}
                className={`group relative p-8 rounded-3xl border border-gray-200 bg-white hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-500 ${
                  visibleItems[index] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Icon Glassmorphism Effect */}
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                  <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                
                {/* Mostra as marcas em destaque (pequeno texto) para SEO e UX */}
                <div className="text-xs text-gray-400 mb-4 h-5 overflow-hidden">
                   {category.brands && category.brands.slice(0, 3).map((b: any) => b.name).join(' • ')}
                </div>

                {/* Footer do Card */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Disponíveis</span>
                    <span className="text-sm font-bold text-blue-600">
                      {count} {count === 1 ? 'manual' : 'manuais'}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}