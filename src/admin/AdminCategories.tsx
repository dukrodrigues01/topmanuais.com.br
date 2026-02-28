import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, FolderTree, Tag, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export function AdminCategories() {
  const { categories, addCategory, deleteCategory, updateCategory } = useAdmin();
  const [newCatName, setNewCatName] = useState('');
  const [newItemName, setNewItemName] = useState('');

  const handleAddCategory = () => {
    if (!newCatName) return;
    addCategory({
      name: newCatName,
      slug: newCatName.toLowerCase().trim().replace(/\s+/g, '-'),
      icon: 'Folder',
      subcategories: [], // Lista de tipos de manuais
      brands: [] // Lista de marcas
    });
    setNewCatName('');
    toast.success('Categoria principal criada!');
  };

  const addItemToCategory = (catId: string, type: 'subcategories' | 'brands') => {
  if (!newItemName) return;
  
  const cat = categories.find(c => c.id === catId);
  if (cat) {
    // Separa por vírgula, remove espaços vazios e duplicados
    const namesArray = newItemName.split(',')
      .map(name => name.trim())
      .filter(name => name !== '');

    const newItems = namesArray.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      slug: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')
    }));

    const updatedCat = {
      ...cat,
      [type]: [...(cat[type] || []), ...newItems]
    };
    
    updateCategory(catId, updatedCat);
    setNewItemName('');
    toast.success(`${namesArray.length} item(s) adicionado(s) à lista de ${type === 'brands' ? 'Marcas' : 'Subcategorias'}!`);
  }
};

  const removeItem = (catId: string, itemId: string, type: 'subcategories' | 'brands') => {
    const cat = categories.find(c => c.id === catId);
    if (cat) {
      const updatedCat = {
        ...cat,
        [type]: cat[type].filter((item: any) => item.id !== itemId)
      };
      updateCategory(catId, updatedCat);
      toast.info('Removido com sucesso');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Taxonomia</h1>
        <p className="text-gray-500">Organize Categorias, Tipos (Subcategorias) e Marcas de forma independente.</p>
      </div>

      {/* CRIAR CATEGORIA PAI */}
      <Card className="border-blue-100 bg-blue-50/30">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label>Nova Categoria Principal (Ex: Motocicletas, Agrícola...)</Label>
              <Input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Digite o nome..." className="bg-white" />
            </div>
            <Button onClick={handleAddCategory} className="bg-blue-600">
              <Plus className="w-4 h-4 mr-2" /> Criar Categoria
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* LISTAGEM E GESTÃO */}
      <div className="grid grid-cols-1 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="text-blue-500 w-5 h-5" />
                <CardTitle className="text-xl">{cat.name}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="subs" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12 px-4">
                  <TabsTrigger value="subs" className="gap-2"><Tag className="w-4 h-4"/> Subcategorias (Tipos)</TabsTrigger>
                  <TabsTrigger value="brands" className="gap-2"><Briefcase className="w-4 h-4"/> Marcas (Fabricantes)</TabsTrigger>
                </TabsList>
                
                {['subcategories', 'brands'].map((type) => (
                  <TabsContent key={type} value={type === 'subcategories' ? 'subs' : 'brands'} className="p-6 mt-0">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          placeholder={type === 'brands' ? "Nova Marca (Ex: Honda)" : "Novo Tipo (Ex: Manual de Oficina)"} 
                          value={newItemName}
                          onChange={e => setNewItemName(e.target.value)}
                        />
                        <Button variant="outline" onClick={() => addItemToCategory(cat.id, type as any)}>Adicionar</Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {cat[type]?.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between bg-white border rounded-lg px-3 py-2 text-sm group">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <button 
                              onClick={() => removeItem(cat.id, item.id, type as any)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}