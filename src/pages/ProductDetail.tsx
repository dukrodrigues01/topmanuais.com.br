// Product Detail Page
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Star, 
  FileText, 
  Download, 
  Shield,
  Clock,
  ChevronRight,
  Heart,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getManualById, getRelatedManuals } from '@/data/mockData';
import { toast } from 'sonner';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  
  const manual = getManualById(id || '');
  const relatedManuals = manual ? getRelatedManuals(manual, 4) : [];

  if (!manual) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-[70px]">
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Manual não encontrado
            </h1>
            <p className="text-gray-600 mb-6">
              O manual que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate('/manuais')}>
              Ver todos os manuais
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(manual);
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast.info('Faça login para adicionar aos favoritos');
      navigate('/login');
      return;
    }
    
    if (isFavorite(manual.id)) {
      removeFromFavorites(manual.id);
    } else {
      addToFavorites(manual.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: manual.title,
        text: manual.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
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
              <Link to="/manuais" className="hover:text-[#007fff]">Manuais</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={`/categoria/${manual.category}`} className="hover:text-[#007fff] capitalize">
                {manual.category}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 truncate max-w-[200px]">{manual.title}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-lg">
                <img
                  src={manual.image}
                  alt={manual.title}
                  className="w-full h-full object-cover"
                />
                {manual.originalPrice && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0 text-sm px-3 py-1">
                    -{Math.round((1 - manual.price / manual.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Category & Brand */}
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="capitalize">
                  {manual.category}
                </Badge>
                <Badge variant="outline">{manual.brand}</Badge>
                {manual.year && (
                  <Badge variant="outline">{manual.year}</Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900">
                {manual.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(manual.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-900">{manual.rating}</span>
                </div>
                <span className="text-gray-500">({manual.reviewCount} avaliações)</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{manual.salesCount} vendidos</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[#007fff]">
                  R$ {manual.price.toFixed(2)}
                </span>
                {manual.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    R$ {manual.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {manual.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Download className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Download</p>
                    <p className="text-sm text-gray-500">Imediato</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Formato</p>
                    <p className="text-sm text-gray-500">{manual.fileFormat}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Garantia</p>
                    <p className="text-sm text-gray-500">30 dias</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Acesso</p>
                    <p className="text-sm text-gray-500">30 dias</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isInCart(manual.id)}
                  className="flex-1 bg-gradient-to-r from-[#007fff] to-[#0040ff] hover:opacity-90"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart(manual.id) ? 'No Carrinho' : 'Adicionar ao Carrinho'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleFavorite}
                  className={isFavorite(manual.id) ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(manual.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {manual.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="details" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#007fff] data-[state=active]:bg-transparent py-4 px-6"
                >
                  Detalhes
                </TabsTrigger>
                <TabsTrigger 
                  value="specs"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#007fff] data-[state=active]:bg-transparent py-4 px-6"
                >
                  Especificações
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#007fff] data-[state=active]:bg-transparent py-4 px-6"
                >
                  Avaliações
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Sobre este Manual</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {manual.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Este manual contém todas as informações necessárias para operar, 
                    manter e realizar reparos no seu equipamento. Desenvolvido pela 
                    fabricante, garante precisão e confiabilidade em todas as informações.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="specs" className="mt-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Especificações Técnicas</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: 'Formato', value: manual.fileFormat },
                      { label: 'Tamanho', value: manual.fileSize },
                      { label: 'Idioma', value: manual.language },
                      { label: 'Páginas', value: manual.pages?.toString() || 'N/A' },
                      { label: 'Marca', value: manual.brand },
                      { label: 'Modelo', value: manual.model },
                      { label: 'Ano', value: manual.year?.toString() || 'N/A' },
                      { label: 'Categoria', value: manual.category },
                    ].map((spec) => (
                      <div key={spec.label} className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">{spec.label}</span>
                        <span className="font-medium text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold">Avaliações dos Clientes</h3>
                      <p className="text-gray-500">Baseado em {manual.reviewCount} avaliações</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-gray-900">{manual.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(manual.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    As avaliações são verificadas e publicadas por clientes que 
                    compraram este manual.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedManuals.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Manuais Relacionados
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedManuals.map((related) => (
                  <Link
                    key={related.id}
                    to={`/manual/${related.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-[#007fff] font-medium uppercase mb-1">
                        {related.category}
                      </p>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#007fff] transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-lg font-bold text-[#007fff]">
                        R$ {related.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
