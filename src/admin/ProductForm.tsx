import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { ImageIcon, Save, Send, Globe, ShieldCheck } from 'lucide-react';

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, categories } = useAdmin();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    languages: [] as string[],
    format: 'PDF',
    downloadUrl: '',
    featured: false,
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    focusKeywords: '',
    slug: ''
  });

  const idiomas = ['Português', 'Inglês', 'Espanhol', 'Italiano'];

  useEffect(() => {
    if (id && products) {
      const p = products.find(p => p.id === id);
      if (p) {
        setFormData({ 
          ...p, 
          price: p.price?.toString() || '0',
          languages: p.languages || [] 
        });
      }
    }
  }, [id, products]);

  // Gerador de Slug e SEO automático otimizado
  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .normalize('NFD') // Remove acentos
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-') // Espaços por hifens
      .replace(/[^\w-]/g, '') // Remove caracteres especiais
      .replace(/--+/g, '-');

    setFormData(prev => ({
      ...prev,
      title: val,
      seoTitle: prev.seoTitle || val,
      slug: generatedSlug
    }));
  };

  const saveProduct = (status: 'draft' | 'published') => {
    // Tratamento rigoroso de preço para evitar erros de renderização
    const numericPrice = parseFloat(formData.price.toString().replace(',', '.')) || 0;

    if (!formData.title || !formData.category) {
      toast.error('Título e Categoria são obrigatórios!');
      return;
    }

    const dataToSave = { 
      ...formData, 
      price: numericPrice,
      status,
      updatedAt: new Date().toISOString()
    };

    try {
      if (id) {
        updateProduct(id, dataToSave);
        toast.success(status === 'published' ? 'Manual publicado com sucesso!' : 'Salvo como rascunho');
      } else {
        addProduct({ ...dataToSave, id: Math.random().toString(36).substr(2, 9) });
        toast.success(status === 'published' ? 'Cadastrado e Publicado!' : 'Rascunho criado!');
      }
      navigate('/admin/produtos');
    } catch (error) {
      toast.error('Erro crítico ao salvar.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 pb-32">
      {/* HEADER FLUTUANTE */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm sticky top-4 z-50 border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {id ? 'Editar Manual' : 'Novo Manual'} 
            {formData.status === 'published' ? <ShieldCheck className="text-green-500 w-5 h-5"/> : null}
          </h1>
          <p className="text-xs text-gray-500">Última edição: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => saveProduct('draft')} className="gap-2">
            <Save className="w-4 h-4" /> Salvar Rascunho
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => saveProduct('published')}>
            <Send className="w-4 h-4" /> Publicar Agora
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* CONTEÚDO PRINCIPAL */}
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-2 bg-blue-500" />
            <CardHeader><CardTitle className="text-lg">Conteúdo Técnico</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Título do Manual</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => handleTitleChange(e.target.value)} 
                  className="text-lg py-6 focus-visible:ring-blue-500"
                  placeholder="Ex: Manual de Serviço Completo John Deere 5075E" 
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Descrição do Produto (Rich Text / HTML)</Label>
                <Textarea 
                  className="min-h-[300px] bg-gray-50/50" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Insira as especificações técnicas, capítulos e modelos atendidos..." 
                />
              </div>
            </CardContent>
          </Card>

          {/* PAINEL SEO */}
          <Card className="border-none shadow-md overflow-hidden bg-green-50/10 border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Globe className="w-5 h-5" /> Otimização SEO & Schema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SEO Meta Title (Ideal: 60 caracteres)</Label>
                <Input 
                  value={formData.seoTitle} 
                  onChange={e => setFormData({...formData, seoTitle: e.target.value})} 
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>SEO Meta Description</Label>
                  <span className={`text-[10px] ${formData.seoDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.seoDescription.length}/160
                  </span>
                </div>
                <Textarea 
                  value={formData.seoDescription} 
                  onChange={e => setFormData({...formData, seoDescription: e.target.value})} 
                  className="bg-white h-24"
                  placeholder="Resumo que aparecerá no Google..." 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Palavra-Chave Foco</Label>
                  <Input value={formData.focusKeywords} onChange={e => setFormData({...formData, focusKeywords: e.target.value})} className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label>URL Amigável (Slug)</Label>
                  <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="bg-white text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BARRA LATERAL */}
        <div className="space-y-6">
          
          {/* MEDIA PREVIEW */}
          <Card className="border-none shadow-md">
            <CardHeader><CardTitle className="text-sm">Imagem de Capa</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200">
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <ImageIcon className="text-gray-300 w-12 h-12" />
                )}
              </div>
              <Input 
                value={formData.image} 
                onChange={e => setFormData({...formData, image: e.target.value})} 
                placeholder="Cole a URL da imagem aqui..." 
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader><CardTitle className="text-sm">Classificação</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Categoria Principal</Label>
                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                  <SelectTrigger className="bg-gray-50"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {categories?.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Marca / Fabricante</Label>
                <Input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="Ex: Honda" />
              </div>
              <div className="space-y-2">
                <Label>Subcategoria (Tipo)</Label>
                <Input value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} placeholder="Ex: Oficina" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader><CardTitle className="text-sm">Venda e Entrega</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="font-bold text-blue-600" />
              </div>
              <div className="space-y-2">
                <Label>Formato</Label>
                <Select value={formData.format} onValueChange={v => setFormData({...formData, format: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Link do Arquivo</Label>
                <Input value={formData.downloadUrl} onChange={e => setFormData({...formData, downloadUrl: e.target.value})} placeholder="Link do Google Drive ou S3" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader><CardTitle className="text-sm">Opções Adicionais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <Checkbox 
                  id="featured" 
                  checked={formData.featured} 
                  onCheckedChange={(val) => setFormData({...formData, featured: !!val})}
                />
                <Label htmlFor="featured" className="cursor-pointer font-bold text-blue-700">Destaque na Loja</Label>
              </div>
              <div className="space-y-3">
                <Label className="text-[11px] uppercase text-gray-400 font-bold">Idiomas Disponíveis</Label>
                <div className="grid grid-cols-2 gap-2">
                  {idiomas.map(lang => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox 
                        id={lang} 
                        checked={formData.languages.includes(lang)}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            languages: checked ? [...prev.languages, lang] : prev.languages.filter(l => l !== lang)
                          }))
                        }}
                      />
                      <label htmlFor={lang} className="text-xs cursor-pointer">{lang}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}