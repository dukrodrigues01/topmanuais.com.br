import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Providers (Essenciais para o site não ficar branco)
import { AdminProvider } from '@/context/AdminContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CheckoutProvider } from '@/context/CheckoutContext';

// Páginas Públicas
import { Home } from '@/pages/Home';
import { ProductDetail } from '@/pages/ProductDetail';

// Páginas Admin
import { AdminLogin } from '@/admin/AdminLogin';
import { AdminDashboard } from '@/admin/AdminDashboard';
import { AdminProducts } from '@/admin/AdminProducts';
import { ProductForm } from '@/admin/ProductForm';
import { AdminCategories } from '@/admin/AdminCategories';
import { AdminOrders } from '@/admin/AdminOrders';

// Layout do Admin com Menu Superior
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      <nav className="bg-white border-b p-4 flex items-center gap-6 shadow-sm sticky top-0 z-50">
        <span className="font-bold text-blue-600 border-r pr-6">Painel Admin</span>
        <div className="flex gap-4">
          <a href="#/admin" className="text-gray-600 hover:text-blue-500 font-medium">Início</a>
          <a href="#/admin/produtos" className="text-gray-600 hover:text-blue-500 font-medium">Produtos</a>
          <a href="#/admin/categorias" className="text-gray-600 hover:text-blue-500 font-medium">Categorias</a>
          <a href="#/admin/pedidos" className="text-gray-600 hover:text-blue-500 font-medium">Pedidos</a>
        </div>
        <a href="#/" className="ml-auto text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">Sair para o Site</a>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* A ordem dos Providers importa: Admin e Auth costumam ficar por fora */}
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <CheckoutProvider>
              
              <Routes>
                {/* ROTAS PÚBLICAS */}
                <Route path="/" element={<Home />} />
                <Route path="/manual/:id" element={<ProductDetail />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* ROTAS ADMIN PROTEGIDAS */}
                <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/produtos" element={<AdminLayout><AdminProducts /></AdminLayout>} />
                <Route path="/admin/produtos/novo" element={<AdminLayout><ProductForm /></AdminLayout>} />
                <Route path="/admin/produtos/editar/:id" element={<AdminLayout><ProductForm /></AdminLayout>} />
                <Route path="/admin/categorias" element={<AdminLayout><AdminCategories /></AdminLayout>} />
                <Route path="/admin/pedidos" element={<AdminLayout><AdminOrders /></AdminLayout>} />

                {/* Redirecionamento para Home em caso de rota inexistente */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              
              <Toaster position="top-right" richColors />

            </CheckoutProvider>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;