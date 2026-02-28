import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  DollarSign,
  CheckCircle,
  FileText,
  Eye
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils'; // Usando sua função protegida

export function AdminDashboard() {
  const { products } = useAdmin();

  // Cálculo de estatísticas focado em Produtos Digitais
  const stats = useMemo(() => {
    const total = products?.length || 0;
    const published = products?.filter(p => p.status === 'published').length || 0;
    const drafts = total - published;
    const featured = products?.filter(p => p.featured).length || 0;
    
    // Soma total de vendas (protegida contra NaN)
    const totalValue = products?.reduce((sum, p) => {
      const price = Number(p.price) || 0;
      const sales = Number(p.salesCount) || 0;
      return sum + (price * sales);
    }, 0) || 0;
    
    return { total, published, drafts, featured, totalValue };
  }, [products]);

  const recentProducts = useMemo(() => {
    return [...(products || [])]
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
      .slice(0, 5);
  }, [products]);

  const statCards = [
    {
      title: 'Total de Manuais',
      value: stats.total,
      icon: Package,
      label: 'Cadastrados no total',
      color: 'blue',
    },
    {
      title: 'Publicados',
      value: stats.published,
      icon: CheckCircle,
      label: `${stats.drafts} em rascunho`,
      color: 'green',
    },
    {
      title: 'Em Destaque',
      value: stats.featured,
      icon: TrendingUp,
      label: 'Exibidos na Home',
      color: 'purple',
    },
    {
      title: 'Vendas Totais',
      value: formatPrice(stats.totalValue),
      icon: DollarSign,
      label: 'Volume bruto estimado',
      color: 'orange',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
          <p className="text-gray-500">Gestão de Manuais e Conteúdo Digital</p>
        </div>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" /> Ver Loja
            </Button>
          </Link>
          <Link to="/admin/produtos/novo">
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Novo Manual
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    stat.color === 'green' ? 'bg-green-50 text-green-600' :
                    stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="px-6 py-2 bg-gray-50 border-t">
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Products Table */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Atualizações Recentes</CardTitle>
            <Link to="/admin/produtos">
              <Button variant="link" className="text-blue-600 p-0 h-auto">Ver catálogo completo</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <div className="text-center py-10 text-gray-400">Nenhum produto cadastrado.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y">
                    {recentProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0">
                              {product.image && <img src={product.image} className="w-full h-full object-cover rounded" alt="" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">{product.title}</p>
                              <p className="text-xs text-gray-500">{product.brand} • {product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            product.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {product.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <p className="font-bold text-gray-900">{formatPrice(product.price)}</p>
                        </td>
                        <td className="py-4 text-right">
                          <Link to={`/admin/produtos/editar/${product.id}`}>
                            <Button variant="ghost" size="sm">Editar</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links / Status */}
        <div className="space-y-6">
           <Card className="bg-blue-600 text-white border-none shadow-md">
             <CardContent className="p-6">
               <h3 className="text-lg font-bold mb-2">Estoque Infinito Ativo</h3>
               <p className="text-blue-100 text-sm mb-4">
                 O sistema está configurado para produtos digitais. Seus manuais nunca aparecerão como "esgotados".
               </p>
               <div className="bg-white/10 rounded-lg p-3 text-xs">
                 Dica: Use o campo "Rascunho" para preparar manuais sem que eles apareçam na loja.
               </div>
             </CardContent>
           </Card>

           <Card className="border-none shadow-sm">
             <CardHeader><CardTitle className="text-sm uppercase text-gray-400">Acesso Rápido</CardTitle></CardHeader>
             <CardContent className="grid grid-cols-1 gap-2">
                <Link to="/admin/categorias">
                  <Button variant="outline" className="w-full justify-start gap-2"><Package className="w-4 h-4"/> Categorias</Button>
                </Link>
                <Link to="/admin/pedidos">
                  <Button variant="outline" className="w-full justify-start gap-2"><ShoppingCart className="w-4 h-4"/> Vendas</Button>
                </Link>
                <Link to="/admin/clientes">
                  <Button variant="outline" className="w-full justify-start gap-2"><Users className="w-4 h-4"/> Base de Clientes</Button>
                </Link>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}