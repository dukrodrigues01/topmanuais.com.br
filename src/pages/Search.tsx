import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShoppingCart, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { useCart } from '@/context/CartContext';
import { searchManuals } from '@/data/mockData';
import { toast } from 'sonner';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addToCart } = useCart();

  const results = query ? searchManuals(query) : [];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get('search') as string;
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    }
  };

  const handleAddToCart = (manual: ReturnType<typeof searchManuals>[0]) => {
    addToCart(manual);
    toast.success(`${manual.title} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-[70px]">
        {/* Search Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Resultados da Busca
            </h1>
            
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="search"
                type="text"
                defaultValue={query}
                placeholder="Buscar manuais..."
                className="pl-12 pr-12 h-14 rounded-xl text-lg"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </form>

            {query && (
              <p className="mt-4 text-gray-600">
                {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para "
                <span className="font-medium text-gray-900">{query}</span>"
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!query ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                Digite algo para buscar manuais
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Tente buscar com termos diferentes ou verifique a ortografia
              </p>
              <Link to="/manuais">
                <Button>Ver todos os manuais</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((manual) => (
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
                      {manual.category}
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
