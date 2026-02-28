import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

export function AdminProductManager({ products, onUpdateProducts }) {
  
  // FUNÇÃO PARA EXPORTAR (Gera a Planilha)
  const exportToExcel = () => {
    // Aqui você pode filtrar os produtos antes de exportar
    const dataToExport = products.map(p => ({
      ID: p.id,
      Nome: p.title,
      Preco: p.price,
      Descricao: p.description,
      Categoria: p.category,
      Subcategoria: p.subcategory || '',
      Marca: p.brand || '',
      Tags: p.tags?.join(', ') || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");
    
    // Gera o arquivo e inicia o download
    XLSX.writeFile(workbook, "estoque_topmanuais.xlsx");
  };

  // FUNÇÃO PARA IMPORTAR (Lê a Planilha e atualiza tudo)
  const importFromExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames;
      const worksheet = workbook.Sheets[sheetName];
      
      // Converte a planilha de volta para JSON
      const importedData = XLSX.utils.sheet_to_json(worksheet);
      
      // Mapeia os dados da planilha de volta para o formato do seu site
      const updatedProducts = importedData.map((row: any) => ({
        id: row.ID,
        title: row.Nome,
        price: Number(row.Preco),
        description: row.Descricao,
        category: row.Categoria,
        subcategory: row.Subcategoria,
        brand: row.Marca,
        tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : []
      }));

      onUpdateProducts(updatedProducts); // Atualiza o banco de dados/estado
      alert(`${updatedProducts.length} produtos atualizados com sucesso!`);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex gap-4">
      <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700">
        <Download className="mr-2 h-4 w-4" /> Exportar Planilha
      </Button>
      
      <div className="relative">
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          onChange={importFromExcel}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <Button variant="outline" className="border-blue-600 text-blue-600">
          <Upload className="mr-2 h-4 w-4" /> Importar Modificações
        </Button>
      </div>
    </div>
  );
}