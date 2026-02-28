import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Search, 
  User, 
  LogOut, 
  Heart,
  ChevronDown,
  BookOpen,
  LayoutGrid,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import logoImg from '@/assets/logo-topmanuais.com.br.webp';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, itemCount, removeItem, updateQuantity } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { categories } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = useMemo(() => [
    { label: 'Home', href: '/' },
    { label: 'Manuais', href: '/manuais' },
    { 
      label: 'Categorias', 
      href: '/categorias',
      dropdown: categories.slice(0, 8).map(c => ({
        label: c.name,
        href: `/categoria/${c.slug}`,
      }))
    },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
  ], [categories]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img 
              src={logoImg} 
              alt="Top Manuais" 
              className={`transition-all duration-300 object-contain ${
                isScrolled ? 'h-12' : 'h-16'
              } group-hover:scale-105`} 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.dropdown && item.dropdown.length > 0 ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1 hover:bg-gray-100/50 ${
                      location.pathname.startsWith(item.href) ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {item.label}
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 p-2 rounded-xl shadow-2xl border-gray-100">
                    <div className="px-3 py-2 text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid size={14} /> Departamentos
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {item.dropdown.map((subItem) => (
                        <DropdownMenuItem key={subItem.label} asChild className="rounded-lg">
                          <Link to={subItem.href} className="cursor-pointer font-semibold py-2">
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link to="/categorias" className="cursor-pointer text-blue-600 font-black justify-center py-2">
                        Explorar Tudo
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`relative px-4 py-2 text-sm font-bold rounded-lg transition-all hover:bg-gray-100/50 group ${
                    location.pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-600 rounded-full transition-all duration-300 ${
                    location.pathname === item.href ? 'w-4' : 'w-0 group-hover:w-4'
                  }`} />
                </Link>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className={`hidden md:flex items-center relative transition-all duration-500 ${isSearchOpen ? 'w-72' : 'w-10'}`}>
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="relative w-full">
                  <Input
                    type="text"
                    placeholder="O que você precisa consertar?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 h-11 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white"
                    autoFocus
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="rounded-full">
                  <Search size={20} className="text-gray-600" />
                </Button>
              )}
            </div>

            {/* Cart - VERSÃO COMPLETA RESTAURADA */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-blue-50 group">
                  <ShoppingCart size={20} className="text-gray-600 group-hover:text-blue-600" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-1 text-[10px] bg-blue-600 border-2 border-white shadow-md">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-l-0 shadow-2xl">
                <SheetHeader className="p-6 border-b bg-gray-50/50">
                  <SheetTitle className="flex items-center gap-3 text-xl font-black">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <ShoppingCart size={20} />
                    </div>
                    Seu Carrinho
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6">
                  {cart.items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                        <ShoppingCart size={40} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">Carrinho Vazio</p>
                        <p className="text-sm text-gray-500">Você ainda não adicionou nenhum manual.</p>
                      </div>
                      <Button onClick={() => navigate('/manuais')} className="bg-blue-600 rounded-xl px-8 font-bold">
                        Começar a Comprar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cart.items.map((item) => (
                        <div key={item.manual.id} className="flex gap-4 group">
                          <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                            <img src={item.manual.image} alt={item.manual.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.manual.title}</h4>
                              <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-tighter">{item.manual.category}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-black text-gray-900">R$ {item.manual.price.toFixed(2)}</span>
                              <button onClick={() => removeItem(item.manual.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.items.length > 0 && (
                  <SheetFooter className="p-6 bg-white border-t flex-col sm:flex-col gap-4">
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-sm text-gray-500 font-medium">
                        <span>Subtotal</span>
                        <span>R$ {cart.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-black text-blue-600">R$ {cart.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/checkout')} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg font-black rounded-2xl shadow-xl shadow-blue-200 group">
                      Finalizar Compra
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>

            {/* Perfil */}
            {isAuthenticated ? (
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-0 h-10 w-10 border-2 border-transparent hover:border-blue-100">
                      <div className="h-full w-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0)}
                      </div>
                    </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-64 mt-2 p-2 rounded-2xl shadow-2xl">
                    <div className="px-3 py-3 border-b border-gray-50 mb-2">
                      <p className="font-black text-gray-900 leading-none">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild className="rounded-xl focus:bg-blue-50">
                        <Link to="/admin" className="cursor-pointer font-black text-blue-600 py-2.5">Painel Administrativo</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className="rounded-xl"><Link to="/perfil" className="py-2.5 font-bold">Meu Perfil</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl"><Link to="/pedidos" className="py-2.5 font-bold">Meus Manuais</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600 font-black cursor-pointer rounded-xl py-2.5">Sair da Conta</DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} className="hidden sm:flex bg-blue-600 hover:bg-blue-700 font-black px-8 rounded-full shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                Entrar
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden rounded-full">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}