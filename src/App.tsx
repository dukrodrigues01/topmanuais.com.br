import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from '@/components/ui/sonner';

// Providers
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext'; // CORRIGIDO: Era AuthProvider
import { CheckoutProvider } from '@/context/CheckoutContext';

// Páginas
import { Home } from '@/pages/Home';
import { ProductDetail } from '@/pages/ProductDetail';
import { Sitemap } from '@/pages/Sitemap';
import { AdminLogin } from '@/admin/AdminLogin';
import { AdminDashboard } from '@/admin/AdminDashboard';
import { AdminProducts } from '@/admin/AdminProducts';
import { ProductForm } from '@/admin/ProductForm';
import { AdminCategories } from '@/admin/AdminCategories';
import { AdminOrders } from '@/admin/AdminOrders';
import { AdminSettings } from '@/admin/AdminSettings';
import StockManagement from '@/pages/admin/StockManagement';

// Componente para injetar os códigos do Google dinamicamente do Admin
function SEORenderer() {
  const { siteSettings } = useAdmin();
  return (
    <Helmet>
      {/* Google Analytics dinâmico do Admin */}
      {siteSettings.googleAnalyticsId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${siteSettings.googleAnalyticsId}`}></script>
      )}
      {siteSettings.googleAnalyticsId && (
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${siteSettings.googleAnalyticsId}');
          `}
        </script>
      )}
      {/* Verificações dinâmicas do Admin */}
      {siteSettings.googleVerification && <meta name="google-site-verification" content={siteSettings.googleVerification} />}
      {siteSettings.baiduVerification && <meta name="baidu-site-verification" content={siteSettings.baiduVerification} />}
      {siteSettings.yandexVerification && <meta name="yandex-verification" content={siteSettings.yandexVerification} />}
    </Helmet>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      <nav className="bg-white border-b p-4 flex items-center gap-6 shadow-sm sticky top-0 z-50 overflow-x-auto">
        <span className="font-black text-blue-600 border-r pr-6 uppercase shrink-0">Painel TopManuais</span>
        <div className="flex gap-4 shrink-0">
          <a href="#/admin" className="text-gray-600 hover:text-blue-500 font-bold text-sm">Início</a>
          <a href="#/admin/produtos" className="text-gray-600 hover:text-blue-500 font-bold text-sm">Produtos</a>
          <a href="#/admin/estoque" className="text-blue-600 hover:text-blue-700 font-bold text-sm bg-blue-50 px-3 py-1 rounded-lg italic">📦 Excel</a>
          <a href="#/admin/categorias" className="text-gray-600 hover:text-blue-500 font-bold text-sm">Categorias</a>
          <a href="#/admin/pedidos" className="text-gray-600 hover:text-blue-500 font-bold text-sm">Pedidos</a>
          <a href="#/admin/configuracoes" className="text-gray-600 hover:text-blue-500 font-bold text-sm border-l pl-4 flex items-center gap-1">⚙️ Configs</a>
        </div>
        <a href="#/" className="ml-auto text-xs font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl shrink-0">Loja</a>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <AdminProvider>
            <SEORenderer />
            <CartProvider>
              <CheckoutProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/manual/:id" element={<ProductDetail />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                  <Route path="/admin/produtos" element={<AdminLayout><AdminProducts /></AdminLayout>} />
                  <Route path="/admin/produtos/novo" element={<AdminLayout><ProductForm /></AdminLayout>} />
                  <Route path="/admin/produtos/editar/:id" element={<AdminLayout><ProductForm /></AdminLayout>} />
                  <Route path="/admin/estoque" element={<AdminLayout><StockManagement /></AdminLayout>} />
                  <Route path="/admin/categorias" element={<AdminLayout><AdminCategories /></AdminLayout>} />
                  <Route path="/admin/pedidos" element={<AdminLayout><AdminOrders /></AdminLayout>} />
                  <Route path="/admin/configuracoes" element={<AdminLayout><AdminSettings /></AdminLayout>} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Toaster position="top-right" richColors closeButton />
              </CheckoutProvider>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;