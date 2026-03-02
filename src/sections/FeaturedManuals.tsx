import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { useCart } from '@/context/CartContext';
import { getFeaturedManuals } from '@/data/mockData';
import { toast } from 'sonner';

export function FeaturedManuals() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { containerRef, visibleItems } = useStaggerAnimation(8, 80);
  const { addToCart } = useCart();
  
  const featuredManuals = getFeaturedManuals();

  const handleAddToCart = (manual: typeof featuredManuals[0]) => {
    addToCart(manual);
    toast.success(`${manual.title} adicionado ao carrinho!`);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Manuais em Destaque
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#007fff] to-[#00bfff] rounded-full" />
          </div>
          <Link 
            to="/manuais"
            className="inline-flex items-center gap-2 text-[#007fff] font-medium hover:gap-3 transition-all"
          >
            Ver Todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div 
          ref={containerRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredManuals.map((manual, index) => (
            <div
              key={manual.id}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 ${
                visibleItems[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={manual.image}
                  alt={manual.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Link to={`/manual/${manual.id}`}>
                      <Button 
                        variant="secondary"
                        className="w-full bg-white/90 hover:bg-white text-gray-900"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {manual.originalPrice && (
                    <Badge className="bg-red-500 text-white border-0">
                      -{Math.round((1 - manual.price / manual.originalPrice) * 100)}%
                    </Badge>
                  )}
                  {manual.featured && (
                    <Badge className="bg-gradient-to-r from-[#007fff] to-[#00bfff] text-white border-0">
                      Destaque
                    </Badge>
                  )}
                </div>

                {/* Quick Add Button */}
                <button
                  onClick={() => handleAddToCart(manual)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category */}
                <p className="text-xs text-[#007fff] font-medium uppercase tracking-wide mb-2">
                  {manual.category}
                </p>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#007fff] transition-colors">
                  {manual.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{manual.rating}</span>
                  </div>
                  <span className="text-sm text-gray-400">({manual.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#007fff]">
                    R$ {manual.price.toFixed(2)}
                  </span>
                  {manual.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      R$ {manual.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button Mobile */}
        <div className="mt-10 text-center sm:hidden">
          <Link to="/manuais">
            <Button 
              variant="outline"
              className="border-[#007fff] text-[#007fff]"
            >
              Ver Todos os Manuais
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
