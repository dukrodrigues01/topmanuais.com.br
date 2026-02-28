import { useState, useEffect, useMemo } from 'react';
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
import { ImageIcon, Save, Send, Globe, ShieldCheck, ChevronRight } from 'lucide-react';

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, categories } = useAdmin();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image: '',
    description: '',
    category: '',      // Slug Nível 1
    subcategory: '',   // Slug Nível 2
    subcategory2: '',  // Slug Nível 3
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

  const idiomas = ['Português', 'Inglês', 'Espanhol', 'Italiano', 'Francês', 'Alemão'];

  // LÓGICA DE FILTRAGEM DOS 3 NÍVEIS
  const sub1Options = useMemo(() => {
    const cat = categories.find(c => c.slug === formData.category);
    return cat?.subcategories || [];
  }, [formData.category, categories]);

  const sub2Options = useMemo(() => {
    const sub1 = sub1Options.find(s => s.slug === formData.subcategory);
    return sub1?.subcategoriesL2 || [];
  }, [formData.subcategory, sub1Options]);

  useEffect(() => {
    if (id && products) {
      const p = products.find(p => p.id === id);
      if (p) {
        setFormData({ 
          ...p, 
          price: p.price?.toString() || '0',
          languages: p.languages || [],
          subcategory2: p.subcategory2 || ''
        });
      }
    }
  }, [id, products]);

  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w-]/g, '').replace(/--+/g, '-');
    setFormData(prev => ({ ...prev, title: val, seoTitle: prev.seoTitle || val, slug }));
  };

  const saveProduct = (status: 'draft' | 'published') => {
    const numericPrice = parseFloat(formData.price.toString().replace(',', '.')) || 0;
    if (!formData.title || !formData.category) return toast.error('Título e Categoria são obrigatórios!');

    const dataToSave = { ...formData, price: numericPrice, status, updatedAt: new Date().toISOString() };

    try {
      id ? updateProduct(id, dataToSave) : addProduct(dataToSave);
      toast.success(status === 'published' ? 'Publicado com sucesso!' : 'Salvo como rascunho');
      navigate('/admin/produtos');
    } catch (error) {
      toast.error('Erro ao salvar produto.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 pb-32">
      {/* HEADER FLUTUANTE */}
      <div className="flex justify-between items-center bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg sticky top-4 z-50 border border-blue-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            {id ? 'Editar Manual' : 'Novo Manual'}
            {formData.status === 'published' && <ShieldCheck className="text-green-500" />}
          </h1>
          <nav className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
            {formData.category || 'SEM CATEGORIA'} 
            {formData.subcategory && ` > ${formData.subcategory}`}
            {formData.subcategory2 && ` > ${formData.subcategory2}`}
          </nav>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => saveProduct('draft')} className="font-bold">Rascunho</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-6" onClick={() => saveProduct('published')}>Publicar Manual</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* CONTEÚDO */}
          <Card className="border-none shadow-sm">
            <CardHeader><CardTitle>Informações Técnicas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título do Manual</Label>
                <Input value={formData.title} onChange={e => handleTitleChange(e.target.value)} className="h-12 text-lg font-medium" placeholder="Ex: Manual de Serviço John Deere 6125J" />
              </div>
              <div className="space-y-2">
                <Label>Descrição Completa (HTML/Texto)</Label>
                <Textarea className="min-h-[350px] bg-gray-50" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="border-none shadow-sm bg-green-50/20">
            <CardHeader><CardTitle className="text-green-800 flex items-center gap-2"><Globe size={18}/> Otimização para Google</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>SEO Meta Title</Label><Input value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} /></div>
                <div className="space-y-2"><Label>Slug (URL)</Label><Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>Meta Description</Label><Textarea value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} /></div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* CLASSIFICAÇÃO (A parte que você precisava) */}
          <Card className="border-none shadow-md border-t-4 border-t-blue-600">
            <CardHeader><CardTitle className="text-sm">Organização da Loja</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {/* NÍVEL 1 */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">1. CATEGORIA PAI</Label>
                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v, subcategory: '', subcategory2: ''})}>
                  <SelectTrigger className="font-bold"><SelectValue placeholder="Escolher..." /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* NÍVEL 2 */}
              {sub1Options.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs text-gray-400">2. SUBCATEGORIA</Label>
                  <Select value={formData.subcategory} onValueChange={v => setFormData({...formData, subcategory: v, subcategory2: ''})}>
                    <SelectTrigger className="border-blue-200"><SelectValue placeholder="Escolher..." /></SelectTrigger>
                    <SelectContent>{sub1Options.map(s => <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}

              {/* NÍVEL 3 */}
              {formData.subcategory && sub2Options.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs text-gray-400">3. TIPO / ESPECIFICAÇÃO</Label>
                  <Select value={formData.subcategory2} onValueChange={v => setFormData({...formData, subcategory2: v})}>
                    <SelectTrigger className="border-blue-400 ring-1 ring-blue-100"><SelectValue placeholder="Opcional..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não utilizar</SelectItem>
                      {sub2Options.map(s => <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2 pt-2"><Label>Marca</Label><Input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="Ex: Honda, Massey" /></div>
            </CardContent>
          </Card>

          {/* VENDAS */}
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2"><Label>Preço de Venda (R$)</Label><Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="text-xl font-black text-blue-600" /></div>
              <div className="space-y-2"><Label>Formato</Label>
                <Select value={formData.format} onValueChange={v => setFormData({...formData, format: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="PDF">PDF (Digital)</SelectItem><SelectItem value="ZIP">ZIP (Software)</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Link Seguro para Download</Label><Input value={formData.downloadUrl} onChange={e => setFormData({...formData, downloadUrl: e.target.value})} /></div>
            </CardContent>
          </Card>

          {/* IDIOMAS */}
          <Card className="border-none shadow-sm">
            <CardHeader><CardTitle className="text-xs">Idiomas do Manual</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {idiomas.map(lang => (
                <div key={lang} className="flex items-center space-x-2">
                  <Checkbox id={lang} checked={formData.languages.includes(lang)} onCheckedChange={(c) => setFormData(p => ({ ...p, languages: c ? [...p.languages, lang] : p.languages.filter(l => l !== lang) }))} />
                  <label htmlFor={lang} className="text-xs font-medium cursor-pointer">{lang}</label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}