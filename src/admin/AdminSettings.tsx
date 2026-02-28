import { useState, useEffect } from 'react';
import { Mail, Store, Bell, Globe, Share2, BarChart3, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAdmin } from '@/context/AdminContext'; // IMPORTANTE: Conecta com o Cérebro

export function AdminSettings() {
  const { siteSettings, updateSettings } = useAdmin();
  
  // Estado local para o formulário, iniciando com o que já existe no Context
  const [formData, setFormData] = useState(siteSettings);

  // Atualiza o formulário caso o siteSettings mude no contexto
  useEffect(() => {
    setFormData(siteSettings);
  }, [siteSettings]);

  const handleSave = () => {
    updateSettings(formData);
    toast.success('Configurações salvas com sucesso! SEO e Social atualizados.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">Configurações Gerais</h1>
          <p className="text-gray-500 font-medium">Controle total da identidade, SEO e integrações da TopManuais</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 font-bold px-8 h-12 rounded-xl">
          Salvar Tudo
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-white border h-12 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="general" className="font-bold">Geral</TabsTrigger>
          <TabsTrigger value="seo" className="font-bold">SEO & Tags</TabsTrigger>
          <TabsTrigger value="social" className="font-bold">Social & Links</TabsTrigger>
          <TabsTrigger value="email" className="font-bold">E-mail</TabsTrigger>
        </TabsList>

        {/* 1. GERAL: Informações da Loja */}
        <TabsContent value="general" className="space-y-6">
          <div className="bg-white rounded-3xl border p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b pb-4">
              <Store className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-black uppercase tracking-tight text-gray-800">Identidade da Loja</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold text-gray-400">NOME DA VITRINE</Label>
                <Input value={formData.storeName} onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-gray-400">WHATSAPP (COM DDD)</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                  <Input className="pl-10" value={formData.whatsappNumber} onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label className="font-bold text-gray-400">META DESCRIPTION DA HOME (AEO)</Label>
                <Textarea value={formData.storeEmail} onChange={(e) => setFormData(prev => ({ ...prev, storeEmail: e.target.value }))} rows={2} placeholder="Ex: A maior biblioteca de manuais técnicos..." />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 2. SEO & TAGS: Onde a mágica acontece */}
        <TabsContent value="seo" className="space-y-6">
          <div className="bg-white rounded-3xl border p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b pb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-black uppercase tracking-tight text-gray-800">Rastreamento e Verificação</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <Label className="text-blue-700 font-black">GOOGLE ANALYTICS ID (GA4)</Label>
                <Input value={formData.googleAnalyticsId} onChange={(e) => setFormData(prev => ({ ...prev, googleAnalyticsId: e.target.value }))} placeholder="G-XXXXXXXXXX" />
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Aparece automaticamente no topo do site</p>
              </div>
              <div className="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Label className="text-gray-700 font-black">GOOGLE SEARCH CONSOLE TAG</Label>
                <Input value={formData.googleVerification} onChange={(e) => setFormData(prev => ({ ...prev, googleVerification: e.target.value }))} />
              </div>
              <div className="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Label className="text-gray-700 font-black">BAIDU VERIFICATION</Label>
                <Input value={formData.baiduVerification} onChange={(e) => setFormData(prev => ({ ...prev, baiduVerification: e.target.value }))} />
              </div>
              <div className="space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Label className="text-gray-700 font-black">YANDEX VERIFICATION</Label>
                <Input value={formData.yandexVerification} onChange={(e) => setFormData(prev => ({ ...prev, yandexVerification: e.target.value }))} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 3. SOCIAL: Links de Redes Sociais */}
        <TabsContent value="social" className="space-y-6">
          <div className="bg-white rounded-3xl border p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b pb-4">
              <Share2 className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-black uppercase tracking-tight text-gray-800">Redes Sociais da Loja</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="font-bold text-gray-400 uppercase text-xs">Facebook URL</Label>
                <Input value={formData.facebookUrl} onChange={(e) => setFormData(prev => ({ ...prev, facebookUrl: e.target.value }))} placeholder="https://facebook.com/..." />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-gray-400 uppercase text-xs">Instagram URL</Label>
                <Input value={formData.instagramUrl} onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-gray-400 uppercase text-xs">Pinterest / Outros</Label>
                <Input value={formData.pinterestUrl} onChange={(e) => setFormData(prev => ({ ...prev, pinterestUrl: e.target.value }))} placeholder="https://pinterest.com/..." />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 4. EMAIL (Mantido conforme original, mas conectado ao Context) */}
        <TabsContent value="email" className="space-y-6">
          <div className="bg-white rounded-3xl border p-8 space-y-6 shadow-sm">
             <h2 className="text-xl font-black border-b pb-4">Configurações de E-mail Automático</h2>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                   <span className="font-bold text-sm">Confirmação de Pedido</span>
                   <Switch defaultChecked />
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                   <span className="font-bold text-sm">Boas-vindas</span>
                   <Switch defaultChecked />
                </div>
             </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}