import { useState } from 'react';
import * as XLSX from 'xlsx';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2, 
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/context/AdminContext';
import { Badge } from '@/components/ui/badge';

export default function StockManagement() {
  const { products, setProducts, categories } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [lastAction, setLastAction] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleExport = () => {
    try {
      const filtered = selectedCategory === 'todos' 
        ? products 
        : products.filter(p => p.category === selectedCategory);

      const data = filtered.map(p => ({
        ID: p.id,
        Titulo: p.title,
        Preco: p.price,
        Categoria: p.category,
        Subcategoria: p.subcategory || '',
        Marca: p.brand || '',
        Link_Imagem: p.image,
        Descricao: p.description,
        Tags: p.tags?.join(', ') || ''
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Produtos");
      XLSX.writeFile(wb, `topmanuais_estoque_${new Date().toISOString().split('T')}.xlsx`);
      
      setLastAction({ type: 'success', msg: 'Planilha gerada com sucesso!' });
    } catch (err) {
      setLastAction({ type: 'error', msg: 'Erro ao exportar planilha.' });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames];
        const data = XLSX.utils.sheet_to_json(ws);

        const updatedProducts = data.map((row: any) => ({
          id: row.ID || Math.random().toString(36).substr(2, 9),
          title: row.Titulo,
          price: Number(row.Preco),
          category: row.Categoria,
          subcategory: row.Subcategoria,
          brand: row.Marca,
          image: row.Link_Imagem,
          description: row.Descricao,
          tags: row.Tags ? String(row.Tags).split(',').map(t => t.trim()) : []
        }));

        if (window.confirm(`Atenção: Você está prestes a atualizar ${updatedProducts.length} produtos. Confirmar?`)) {
          setProducts(updatedProducts);
          setLastAction({ type: 'success', msg: `${updatedProducts.length} produtos importados!` });
        }
      } catch (err) {
        setLastAction({ type: 'error', msg: 'Erro ao ler arquivo. Verifique o formato.' });
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <FileSpreadsheet className="text-blue-600" size={32} />
            Gestão de Stock em Massa
          </h1>
          <p className="text-gray-500 mt-1">Exporta para Excel, edita centenas de itens e importa novamente em segundos.</p>
        </div>
        <Badge variant="outline" className="text-lg py-1 px-4 border-blue-200 text-blue-700 bg-blue-50">
          {products.length} Produtos Ativos
        </Badge>
      </div>

      {lastAction && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          lastAction.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {lastAction.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          <span className="font-bold">{lastAction.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Exportação */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl font-black mb-4">1. Exportar Dados</h3>
          <p className="text-sm text-gray-500 mb-6">Escolhe uma categoria para editar ou descarrega todo o stock.</p>
          
          <div className="space-y-4">
            <select 
              className="w-full h-12 px-4 rounded-xl border bg-gray-50 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="todos">Todos os Produtos</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            
            <Button onClick={handleExport} className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-bold rounded-2xl">
              <Download className="mr-2" /> Descarregar Excel
            </Button>
          </div>
        </div>

        {/* Card Importação */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl font-black mb-4">2. Importar Edições</h3>
          <p className="text-sm text-gray-500 mb-6">Carrega o arquivo editado para aplicar as mudanças no site.</p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-800 text-xs mb-4">
              <Info size={24} className="shrink-0" />
              <p>Mantenha a coluna <b>ID</b> intacta para que o sistema saiba qual produto atualizar. Novos itens sem ID serão criados automaticamente.</p>
            </div>

            <div className="relative">
              <input 
                type="file" 
                accept=".xlsx" 
                onChange={handleImport}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Button variant="outline" className="w-full h-14 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 text-lg font-bold rounded-2xl">
                <Upload className="mr-2" /> Selecionar Ficheiro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}