import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { categories } from '@/data/mockData';

export function CategoriesList() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-[70px]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0040ff] via-[#007fff] to-[#00bfff] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold mb-4">Todas as Categorias</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Explore nossa biblioteca organizada por categorias e marcas. 
              Encontre exatamente o que você precisa.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {categories.map((category) => {
              const Icon = (Icons as any)[category.icon] || Icons.FileText;
              return (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  {/* Category Header */}
                  <Link to={`/categoria/${category.slug}`}>
                    <div className="flex items-start gap-4 mb-6 group">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007fff]/10 to-[#00bfff]/10 flex items-center justify-center group-hover:from-[#007fff] group-hover:to-[#00bfff] transition-all duration-300">
                        <Icon className="w-8 h-8 text-[#007fff] group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-[#007fff] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-500 mt-1">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm font-medium text-[#007fff] bg-[#007fff]/10 px-3 py-1 rounded-full">
                            {category.manualCount.toLocaleString()} manuais
                          </span>
                          <span className="text-sm text-gray-400">
                            {category.subcategories?.length || 0} marcas
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Brands */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="border-t pt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-4">
                        Principais marcas:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.slice(0, 8).map((sub) => (
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
                        {category.subcategories.length > 8 && (
                          <Link
                            to={`/categoria/${category.slug}`}
                            className="px-4 py-2 rounded-lg bg-gray-50 text-[#007fff] text-sm font-medium hover:bg-[#007fff]/10 transition-colors"
                          >
                            +{category.subcategories.length - 8} mais
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links by Brand */}
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Buscar por Marca Popular
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Honda', slug: 'honda', category: 'automotivo' },
                { name: 'Ford', slug: 'ford', category: 'automotivo' },
                { name: 'Volkswagen', slug: 'volkswagen', category: 'automotivo' },
                { name: 'Samsung', slug: 'samsung', category: 'smartphones' },
                { name: 'Apple', slug: 'apple', category: 'smartphones' },
                { name: 'LG', slug: 'lg', category: 'eletrodomesticos' },
                { name: 'Brastemp', slug: 'brastemp', category: 'eletrodomesticos' },
                { name: 'Dell', slug: 'dell', category: 'informatica' },
                { name: 'Sony', slug: 'sony', category: 'eletronicos' },
                { name: 'Canon', slug: 'canon', category: 'eletronicos' },
              ].map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/categoria/${brand.category}/${brand.slug}`}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-[#007fff] hover:text-white text-gray-700 font-medium transition-all hover:shadow-lg"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
