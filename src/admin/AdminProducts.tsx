import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FileText, Package } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminProducts() {
  const { products, deleteProduct } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtro seguro: garante que produtos existam e trata valores nulos
  const filteredProducts = (products || []).filter(product => {
    const search = searchTerm.toLowerCase();
    return (
      (product.title?.toLowerCase() || "").includes(search) ||
      (product.brand?.toLowerCase() || "").includes(search) ||
      (product.model?.toLowerCase() || "").includes(search)
    );
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Produtos / Manuais
          </h1>
          <p className="text-gray-500">Gerencie seu catálogo ({filteredProducts.length} itens)</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link to="/admin/produtos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Manual
          </Link>
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por título, marca ou modelo..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[400px]">Manual</TableHead>
              <TableHead>Marca/Modelo</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                        {product.image ? (
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-full h-full p-2 text-gray-300" />
                        )}
                      </div>
                      <span className="line-clamp-2 text-sm">{product.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">{product.brand}</div>
                      <div className="text-gray-500">{product.model}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-green-700">
                      R$ {Number(product.price).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild title="Editar">
                        <Link to={`/admin/produtos/editar/${product.id}`}>
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if(confirm(`Excluir o manual "${product.title}"?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                  {searchTerm ? 'Nenhum resultado encontrado para sua busca.' : 'Nenhum produto cadastrado.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}