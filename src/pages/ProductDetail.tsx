import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // SEO/AEO
import { 
  ShoppingCart, 
  Star, 
  FileText, 
  Download, 
  Shield,
  Clock,
  ChevronRight,
  Heart,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext'; // Importar contexto do Admin
import { toast } from 'sonner';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const { products } = useAdmin(); // Pega os produtos do estado global (atualizados)
  
  // Busca o produto pelo ID ou pelo Slug (importante para SEO)
  const manual = products.find(p => p.id === id || p.slug === id);
  
  // Lógica para manuais relacionados baseada na mesma categoria
  const relatedManuals = products
    .filter(p => p.category === manual?.category && p.id !== manual?.id)
    .slice(0, 4);

  if (!manual) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-[70px] flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Manual não encontrado</h1>
            <Button onClick={() => navigate('/manuais')}>Explorar Loja</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- ESTRUTURA JSON-LD PARA GOOGLE E IA (AEO) ---
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${window.location.origin}/#/manual/${manual.slug || manual.id}#product`,
    "name": manual.title,
    "image": manual.image,
    "description": manual.seoDescription || manual.description?.substring(0, 160),
    "sku": manual.id,
    "brand": {
      "@type": "Brand",
      "name": manual.brand || "Top Manuais"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "BRL",
      "price": manual.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- INJEÇÃO DE SEO & AEO --- */}
      <Helmet>
        <title>{manual.seoTitle || `${manual.title} | Top Manuais`}</title>
        <meta name="description" content={manual.seoDescription || manual.description?.substring(0, 160)} />
        <meta name="keywords" content={manual.focusKeywords} />
        <meta property="og:title" content={manual.title} />
        <meta property="og:image" content={manual.image} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <Header />
      
      <main className="pt-[70px]">
        {/* Breadcrumb Otimizado */}
        <div className="bg-white border-b hidden md:block">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight size={14} />
            <Link to="/manuais" className="hover:text-blue-600">Manuais</Link>
            <ChevronRight size={14} />
            <span className="text-blue-600">{manual.category}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Coluna Esquerda - Imagem */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-4">
                <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-white shadow-2xl border border-gray-100 group">
                  <img src={manual.image} alt={manual.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex gap-3 justify-center">
                   <Badge className="bg-green-50 text-green-700 border-green-100 px-4 py-2 rounded-full flex gap-2">
                     <CheckCircle2 size={14}/> Produto Original
                   </Badge>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Info */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">{manual.brand}</Badge>
                  <Badge variant="outline" className="text-gray-500">{manual.format || 'PDF'}</Badge>
                </div>
                <h1 className="text-4xl font-black text-gray-900 leading-tight">
                  {manual.title}
                </h1>
                <div className="flex items-center gap-4 text-sm font-bold">
                  <div className="flex text-yellow-400"><Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/></div>
                  <span className="text-gray-400">(4.9/5) +500 downloads</span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-blue-600">R$ {manual.price.toFixed(2)}</span>
                  <span className="text-xl text-gray-300 line-through">R$ {(manual.price * 1.5).toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button size="lg" onClick={() => addToCart(manual)} disabled={isInCart(manual.id)} className="h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-lg shadow-blue-200">
                    <ShoppingCart className="mr-2" /> {isInCart(manual.id) ? 'No Carrinho' : 'Comprar Agora'}
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleFavorite} className={`h-16 rounded-2xl border-2 ${isFavorite(manual.id) ? 'border-red-500 text-red-500' : ''}`}>
                    <Heart className={isFavorite(manual.id) ? 'fill-current' : ''} />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-50">
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase"><Shield size={16}/> Compra Segura</div>
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase"><Download size={16}/> Entrega via E-mail</div>
                </div>
              </div>

              {/* Detalhes Rápidos */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Formato', val: manual.format || 'PDF', icon: <FileText size={18}/> },
                  { label: 'Idioma', val: manual.languages?.join(', ') || 'Português', icon: <Globe size={18}/> },
                  { label: 'Envio', val: 'Imediato', icon: <Clock size={18}/> },
                  { label: 'Suporte', val: '24/7', icon: <Shield size={18}/> }
                ].map(item => (
                  <div key={item.label} className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                    <div className="text-blue-600 flex justify-center mb-2">{item.icon}</div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.label}</p>
                    <p className="text-xs font-black text-gray-900 truncate">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Otimizadas */}
          <div className="mt-16 bg-white rounded-[32px] p-8 border border-gray-100">
            <Tabs defaultValue="details">
              <TabsList className="bg-gray-50 p-1 rounded-xl mb-8">
                <TabsTrigger value="details" className="rounded-lg font-bold">Conteúdo Técnico</TabsTrigger>
                <TabsTrigger value="specs" className="rounded-lg font-bold">Especificações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="animate-in fade-in">
                <h3 className="text-2xl font-black mb-4">Sobre este Manual</h3>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                  {manual.description}
                </div>
              </TabsContent>
              
              <TabsContent value="specs" className="animate-in fade-in">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                  {[
                    { label: 'Categoria', val: manual.category },
                    { label: 'Subcategoria', val: manual.subcategory },
                    { label: 'Marca', val: manual.brand },
                    { label: 'Modelo/Série', val: manual.title.split('-').pop() },
                  ].map(spec => (
                    <div key={spec.label} className="flex justify-between py-3 border-b border-gray-50">
                      <span className="font-bold text-gray-400 uppercase text-[11px]">{spec.label}</span>
                      <span className="font-black text-gray-900">{spec.val}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}