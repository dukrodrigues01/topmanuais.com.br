import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, FileText, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { useCart } from '@/context/CartContext';
import { useAdmin } from '@/context/AdminContext'; // Importando dados reais
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar"; // Sua sidebar de filtros
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export function Category() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { products, categories } = useAdmin();

  // Estados dos Filtros
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);

  // Localiza a categoria real
  const category = categories.find(c => c.slug === slug);

  // Filtra os produtos da categoria que estão publicados e obedecem aos filtros da sidebar
  const filteredManuals = useMemo(() => {
    return products.filter(m => {
      const isInCategory = m.category === slug;
      const isPublished = m.status === 'published';
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(m.brand);
      const matchesSub = selectedSubs.length === 0 || selectedSubs.includes(m.subcategory);
      
      return isInCategory && isPublished && matchesBrand && matchesSub;
    });
  }, [products, slug, selectedBrands, selectedSubs]);

  // Handlers dos filtros
  const handleBrandChange = (brandSlug: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandSlug) ? prev.filter(s => s !== brandSlug) : [...prev, brandSlug]
    );
  };

  const handleSubChange = (subSlug: string) => {
    setSelectedSubs(prev => 
      prev.includes(subSlug) ? prev.filter(s => s !== subSlug) : [...prev, subSlug]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedSubs([]);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-[70px] flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
          <Link to="/"><Button>Voltar para a Home</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full pt-[70px]">
          
          {/* SIDEBAR DE FILTROS REAL */}
          <AppSidebar 
            currentCategorySlug={slug || ''}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
            selectedSubs={selectedSubs}
            onSubChange={handleSubChange}
            onClear={clearFilters}
          />

          <SidebarInset className="bg-transparent">
            {/* Banner da Categoria */}
            <div className="bg-gradient-to-br from-[#0040ff] via-[#007fff] to-[#00bfff] text-white p-8 md:p-12 m-4 rounded-3xl shadow-lg">
              <div className="max-w-4xl">
                <div className="flex items-center gap-4 mb-4">
                  <SidebarTrigger className="bg-white/20 hover:bg-white/40 text-white rounded-full" />
                  <Link to="/" className="text-white/80 hover:text-white text-sm flex items-center gap-1">
                    <ArrowLeft size={14} /> Home
                  </Link>
                </div>
                <h1 className="text-4xl font-black mb-2">{category.name}</h1>
                <p className="text-white/80 max-w-xl mb-6">{category.description || 'Encontre os melhores manuais técnicos para o seu equipamento.'}</p>
                <div className="flex gap-2">
                  <Badge className="bg-white/20 hover:bg-white/30 border-none px-4 py-1">
                    {filteredManuals.length} Manuais Disponíveis
                  </Badge>
                </div>
              </div>
            </div>

            {/* Grid de Produtos */}
            <div className="px-6 pb-20">
              {filteredManuals.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                  <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400">Nenhum manual encontrado</h3>
                  <p className="text-gray-400 mb-6">Tente alterar os filtros na barra lateral.</p>
                  <Button onClick={clearFilters} variant="outline">Limpar Filtros</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredManuals.map((manual) => (
                    <div
                      key={manual.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-all duration-500"
                    >
                      {/* Imagem do Manual */}
                      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                        <Link to={`/manual/${manual.id}`}>
                          {manual.image ? (
                            <img
                              src={manual.image}
                              alt={manual.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300"><FileText size={48} /></div>
                          )}
                        </Link>
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <button
                            onClick={() => {
                              addToCart(manual);
                              toast.success('Adicionado ao carrinho!');
                            }}
                            className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all scale-0 group-hover:scale-100"
                          >
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                        <div className="absolute bottom-3 left-3">
                           <Badge className="bg-blue-600/90 backdrop-blur-md border-none text-[10px] uppercase">
                             {manual.format}
                           </Badge>
                        </div>
                      </div>

                      {/* Informações */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{manual.brand}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-gray-600">{manual.rating || '5.0'}</span>
                          </div>
                        </div>
                        <Link to={`/manual/${manual.id}`}>
                          <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 h-10 text-sm leading-tight group-hover:text-blue-600">
                            {manual.title}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-black text-gray-900">
                            {formatPrice(manual.price)}
                          </span>
                          <Link to={`/manual/${manual.id}`}>
                            <Button size="sm" variant="ghost" className="text-blue-600 p-0 hover:bg-transparent hover:underline">
                              Detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
}