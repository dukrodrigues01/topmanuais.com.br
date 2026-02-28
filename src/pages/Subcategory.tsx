import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { useCart } from '@/context/CartContext';
import { categories, manuals } from '@/data/mockData';
import { toast } from 'sonner';

export function Subcategory() {
  const { slug, subslug } = useParams<{ slug: string; subslug: string }>();
  const { addToCart } = useCart();
  
  const category = categories.find(c => c.slug === slug);
  const subcategory = category?.subcategories?.find(s => s.slug === subslug);
  
  // Filtrar manuais pela subcategoria/marca
  const subcategoryManuals = manuals.filter(m => 
    m.category === slug && m.subcategory === subslug
  );

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-[70px]">
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Marca não encontrada
            </h1>
            <Link to="/categorias">
              <Button>Ver todas as categorias</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = (manual: typeof manuals[0]) => {
    addToCart(manual);
    toast.success(`${manual.title} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-[70px]">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-[#007fff]">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/categorias" className="hover:text-[#007fff]">Categorias</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={`/categoria/${category.slug}`} className="hover:text-[#007fff]">
                {category.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{subcategory.name}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#0040ff] via-[#007fff] to-[#00bfff] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Link 
              to={`/categoria/${category.slug}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para {category.name}
            </Link>
            <h1 className="text-4xl font-bold mb-4">{subcategory.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Manuais {subcategory.name} na categoria {category.name}. 
              Encontre o manual específico para seu equipamento.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Badge className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                {subcategoryManuals.length} manuais
              </Badge>
              <Badge className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                {category.name}
              </Badge>
            </div>
          </div>
        </div>

        {/* Other Brands */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-sm font-medium text-gray-500 mb-4">Outras marcas em {category.name}:</h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories?.filter(s => s.slug !== subslug).map((sub) => (
                <Link
                  key={sub.id}
                  to={`/categoria/${category.slug}/${sub.slug}`}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-[#007fff] hover:text-white text-gray-700 text-sm font-medium transition-colors"
                >
                  {sub.name}
                  <span className="ml-2 text-gray-400 hover:text-white/70">
                    ({sub.manualCount})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {subcategoryManuals.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">
                Nenhum manual encontrado para {subcategory.name} nesta categoria.
              </p>
              <Link to={`/categoria/${category.slug}`}>
                <Button variant="outline">Ver todos em {category.name}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {subcategoryManuals.map((manual) => (
                <div
                  key={manual.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <Link to={`/manual/${manual.id}`}>
                      <img
                        src={manual.image}
                        alt={manual.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </Link>
                    {manual.originalPrice && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                        -{Math.round((1 - manual.price / manual.originalPrice) * 100)}%
                      </Badge>
                    )}
                    <button
                      onClick={() => handleAddToCart(manual)}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <ShoppingCart className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-xs text-[#007fff] font-medium uppercase tracking-wide mb-2">
                      {manual.brand}
                    </p>
                    <Link to={`/manual/${manual.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#007fff] transition-colors">
                        {manual.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">{manual.rating}</span>
                      </div>
                      <span className="text-sm text-gray-400">({manual.reviewCount})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-[#007fff]">
                          R$ {manual.price.toFixed(2)}
                        </span>
                        {manual.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            R$ {manual.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
