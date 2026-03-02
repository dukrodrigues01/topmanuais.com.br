import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  X,
  Grid3X3,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { useCart } from '@/context/CartContext';
import { manuals, categories } from '@/data/mockData';
import { toast } from 'sonner';

const sortOptions = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price_asc', label: 'Menor Preço' },
  { value: 'price_desc', label: 'Maior Preço' },
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'bestselling', label: 'Mais Vendidos' },
  { value: 'rating', label: 'Melhor Avaliados' },
];

export function Manuals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { addToCart } = useCart();

  // Filters
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('categoria') || '';
  const selectedBrand = searchParams.get('marca') || '';
  const selectedSort = searchParams.get('sort') || 'relevance';
  const minPrice = searchParams.get('min') || '';
  const maxPrice = searchParams.get('max') || '';

  // Filter and sort manuals
  const filteredManuals = useMemo(() => {
    let result = [...manuals];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.brand.toLowerCase().includes(query) ||
        m.model.toLowerCase().includes(query) ||
        m.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(m => m.category === selectedCategory);
    }

    // Price filter
    if (minPrice) {
      result = result.filter(m => m.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter(m => m.price <= parseFloat(maxPrice));
    }

    // Sort
    switch (selectedSort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'bestselling':
        result.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedBrand, selectedSort, minPrice, maxPrice]);

  // Get available brands for the selected category
  const availableBrands = useMemo(() => {
    if (!selectedCategory) return [];
    const category = categories.find(c => c.slug === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleAddToCart = (manual: typeof manuals[0]) => {
    addToCart(manual);
    toast.success(`${manual.title} adicionado ao carrinho!`);
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-[70px]">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Todos os Manuais
            </h1>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar manuais..."
                  value={searchQuery}
                  onChange={(e) => updateFilter('q', e.target.value)}
                  className="pl-12 h-12 rounded-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => updateFilter('q', '')}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                {/* Filter Button Mobile */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden relative">
                      <Filter className="w-5 h-5 mr-2" />
                      Filtros
                      {activeFiltersCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-[#007fff]">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Categories */}
                      <div>
                        <h4 className="font-medium mb-3">Categorias</h4>
                        <div className="space-y-2">
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                updateFilter('categoria', cat.slug);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                selectedCategory === cat.slug
                                  ? 'bg-[#007fff]/10 text-[#007fff]'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <span className="capitalize">{cat.name}</span>
                              <span className="float-right text-gray-400 text-sm">
                                {cat.manualCount}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Price Range */}
                      <div>
                        <h4 className="font-medium mb-3">Preço</h4>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => updateFilter('min', e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => updateFilter('max', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={selectedSort} onValueChange={(v) => updateFilter('sort', v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="hidden sm:flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 ${viewMode === 'grid' ? 'bg-[#007fff] text-white' : 'bg-white text-gray-600'}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' ? 'bg-[#007fff] text-white' : 'bg-white text-gray-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm text-gray-500">Filtros ativos:</span>
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    Categoria: {selectedCategory}
                    <button onClick={() => { updateFilter('categoria', ''); updateFilter('marca', ''); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedBrand && (
                  <Badge variant="secondary" className="gap-1">
                    Marca: {selectedBrand}
                    <button onClick={() => updateFilter('marca', '')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {(minPrice || maxPrice) && (
                  <Badge variant="secondary" className="gap-1">
                    Preço: {minPrice || '0'} - {maxPrice || '∞'}
                    <button onClick={() => { updateFilter('min', ''); updateFilter('max', ''); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#007fff] hover:underline"
                >
                  Limpar todos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Categories */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Categorias</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => updateFilter('categoria', '')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        !selectedCategory
                          ? 'bg-[#007fff]/10 text-[#007fff] font-medium'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      Todas as Categorias
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => updateFilter('categoria', cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                          selectedCategory === cat.slug
                            ? 'bg-[#007fff]/10 text-[#007fff] font-medium'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span className="capitalize">{cat.name}</span>
                        <span className="float-right text-gray-400">
                          {cat.manualCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands Filter - Only show when category is selected */}
                {selectedCategory && availableBrands.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Marcas</h4>
                    <div className="space-y-1">
                      <button
                        onClick={() => updateFilter('marca', '')}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                          !selectedBrand
                            ? 'bg-[#007fff]/10 text-[#007fff] font-medium'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        Todas as Marcas
                      </button>
                      {availableBrands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => updateFilter('marca', brand.slug)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                            selectedBrand === brand.slug
                              ? 'bg-[#007fff]/10 text-[#007fff] font-medium'
                              : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span>{brand.name}</span>
                          <span className="float-right text-gray-400">
                            {brand.manualCount}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Faixa de Preço</h4>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => updateFilter('min', e.target.value)}
                      className="h-10"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => updateFilter('max', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {filteredManuals.length} {filteredManuals.length === 1 ? 'resultado' : 'resultados'}
                  {searchQuery && ` para "${searchQuery}"`}
                </p>
              </div>

              {/* Grid */}
              {filteredManuals.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum manual encontrado
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Tente ajustar seus filtros ou buscar por outro termo
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Limpar Filtros
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredManuals.map((manual) => (
                    <div
                      key={manual.id}
                      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {/* Image */}
                      <div className={`relative overflow-hidden bg-gray-100 ${
                        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-[3/4]'
                      }`}>
                        <Link to={`/manual/${manual.id}`}>
                          <img
                            src={manual.image}
                            alt={manual.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </Link>
                        {manual.originalPrice && (
                          <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                            -{Math.round((1 - manual.price / manual.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
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

                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                          {manual.description}
                        </p>

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
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(manual)}
                            className="bg-gradient-to-r from-[#007fff] to-[#0040ff]"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
