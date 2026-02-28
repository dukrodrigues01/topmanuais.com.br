import { useAdmin } from '@/context/AdminContext';

export function Sitemap() {
  const { products, categories } = useAdmin();
  const baseUrl = window.location.origin + '/#';

  // Gerar a data atual para o Google saber que o site está ativo
  const today = new Date().toISOString().split('T');

  return (
    <div className="p-10 max-w-4xl mx-auto font-mono text-sm">
      <h1 className="text-xl font-bold mb-6 underline">Sitemap.xml (Visual para Indexação)</h1>
      
      {/* Links Estáticos */}
      <div className="space-y-1 mb-8">
        <p>{baseUrl}/ [priority: 1.0]</p>
        <p>{baseUrl}/manuais [priority: 0.8]</p>
        <p>{baseUrl}/sobre [priority: 0.5]</p>
        <p>{baseUrl}/contato [priority: 0.5]</p>
      </div>

      {/* Categorias Dinâmicas */}
      <h2 className="font-bold mb-2">Categorias:</h2>
      <div className="space-y-1 mb-8 text-blue-600">
        {categories.map(cat => (
          <p key={cat.id}>{baseUrl}/categoria/{cat.slug} [lastmod: {today}]</p>
        ))}
      </div>

      {/* PRODUTOS DINÂMICOS - Aqui é onde seus 302 produtos aparecerão sozinhos */}
      <h2 className="font-bold mb-2">Produtos ({products.length}):</h2>
      <div className="space-y-1 text-green-600">
        {products.length === 0 ? (
          <p className="text-red-500 font-bold">// Aguardando importação de produtos via Excel...</p>
        ) : (
          products.map(p => (
            <p key={p.id}>{baseUrl}/manual/{p.slug || p.id} [lastmod: {today}]</p>
          ))
        )}
      </div>
    </div>
  );
}