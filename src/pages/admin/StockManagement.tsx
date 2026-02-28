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
import { toast } from 'sonner';

export default function StockManagement() {
  const { products, setProducts, categories } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [lastAction, setLastAction] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // FUNÇÃO PARA EXPORTAR (GERAR EXCEL)
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
      toast.success('Planilha exportada!');
    } catch (err) {
      setLastAction({ type: 'error', msg: 'Erro ao exportar planilha.' });
      toast.error('Erro na exportação.');
    }
  };

  // FUNÇÃO PARA IMPORTAR (LER EXCEL) - CORRIGIDA
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files : null; // CORREÇÃO AQUI: Sem ponto solto
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        // Pega a primeira aba da planilha
        const wsName = wb.SheetNames;
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json(ws);

        const updatedProducts = data.map((row: any) => ({
          id: String(row.ID || Math.random().toString(36).substr(2, 9)),
          title: row.Titulo || 'Sem Título',
          price: Number(row.Preco) || 0,
          category: row.Categoria || '',
          subcategory: row.Subcategoria || '',
          brand: row.Marca || '',
          image: row.Link_Imagem || '',
          description: row.Descricao || '',
          tags: row.Tags ? String(row.Tags).split(',').map(t => t.trim()) : [],
          status: 'published'
        }));

        if (window.confirm(`Atenção: Você está prestes a atualizar/criar ${updatedProducts.length} produtos. Confirmar?`)) {
          setProducts(updatedProducts);
          setLastAction({ type: 'success', msg: `${updatedProducts.length} produtos importados!` });
          toast.success('Estoque atualizado com sucesso!');
        }
      } catch (err) {
        setLastAction({ type: 'error', msg: 'Erro ao ler arquivo. Verifique se é um .xlsx válido.' });
        toast.error('Erro na leitura do arquivo.');
      }
    };
    reader.readAsBinaryString(file);
    
    // Limpa o input para permitir subir o mesmo arquivo novamente se necessário
    e.target.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 italic uppercase tracking-tighter">
            <FileSpreadsheet className="text-blue-600" size={32} />
            Gestão de Estoque (Excel)
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Controle total: exporte, edite na planilha e importe de volta.</p>
        </div>
        <Badge variant="outline" className="text-lg py-2 px-6 border-blue-200 text-blue-700 bg-blue-50 font-black rounded-xl">
          {products.length} ITENS NO AR
        </Badge>
      </div>

      {lastAction && (
        <div className={`p-5 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border-2 ${
          lastAction.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {lastAction.type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
          <span className="font-black uppercase text-sm italic">{lastAction.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CARD EXPORTAÇÃO */}
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
            <Download size={24} />
          </div>
          <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">1. Exportar</h3>
          <p className="text-sm text-gray-400 mb-8 font-medium">Baixe seu estoque atual para fazer edições rápidas no Excel.</p>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Filtrar por Categoria</label>
            <select 
              className="w-full h-14 px-5 rounded-2xl border-2 border-gray-100 bg-gray-50 font-bold text-gray-700 focus:border-blue-500 outline-none transition-colors appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="todos">Todos os Produtos</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            
            <Button onClick={handleExport} className="w-full h-16 bg-green-600 hover:bg-green-700 text-white text-lg font-black rounded-2xl shadow-lg shadow-green-100 transition-transform active:scale-95 uppercase italic">
              Gerar Planilha
            </Button>
          </div>
        </div>

        {/* CARD IMPORTAÇÃO */}
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Upload size={24} />
          </div>
          <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">2. Importar</h3>
          <p className="text-sm text-gray-400 mb-8 font-medium">Suba o arquivo editado para atualizar os preços e manuais no site.</p>
          
          <div className="space-y-4">
            <div className="bg-blue-50/50 p-5 rounded-2xl flex gap-4 text-blue-800 text-xs mb-6 border border-blue-100/50">
              <Info size={32} className="shrink-0 text-blue-500" />
              <p className="font-bold leading-relaxed">
                <span className="text-blue-600 uppercase italic underline">Importante:</span> Mantenha a coluna <span className="text-black italic">ID</span> intacta para atualizar produtos existentes. Novos itens sem ID serão criados.
              </p>
            </div>

            <div className="relative group">
              <input 
                type="file" 
                accept=".xlsx" 
                onChange={handleImport}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Button variant="outline" className="w-full h-20 border-4 border-dashed border-gray-100 text-blue-600 group-hover:border-blue-200 group-hover:bg-blue-50 text-xl font-black rounded-3xl transition-all flex flex-col gap-1 italic uppercase">
                <Upload size={20} className="mb-1" />
                Selecionar Ficheiro
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-900/20">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-white" />
            </div>
            <div>
                <h4 className="font-black uppercase italic tracking-tighter text-lg">Pronto para SEO e IA</h4>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">O sitemap será atualizado automaticamente após a importação.</p>
            </div>
        </div>
      </div>
    </div>
  );
}