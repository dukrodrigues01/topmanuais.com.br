import { useState } from 'react';
import { Mail, Store, Bell } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export function AdminSettings() {
  const [emailSettings, setEmailSettings] = useState({
    senderName: 'TopManuais',
    senderEmail: 'suporte@topmanuais.com',
    orderConfirmationSubject: 'Pedido Confirmado - TopManuais',
    enableOrderConfirmation: true,
    welcomeEmail: true,
  });

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'TopManuais',
    storeDescription: 'A maior biblioteca de manuais técnicos do Brasil',
    currency: 'BRL',
    phone: '(11) 4000-1234',
    address: 'São Paulo, SP - Brasil',
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-500">Gerencie as configurações da loja</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="email">E-mail</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="bg-white rounded-xl border p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Store className="w-6 h-6 text-[#007fff]" />
                <h2 className="text-lg font-semibold">Informações da Loja</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="storeDescription">Descrição da Loja</Label>
                  <Textarea
                    id="storeDescription"
                    value={storeSettings.storeDescription}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-gradient-to-r from-[#007fff] to-[#0040ff]">
                Salvar Alterações
              </Button>
            </div>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <div className="bg-white rounded-xl border p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-[#007fff]" />
                <h2 className="text-lg font-semibold">Configurações de E-mail</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Nome do Remetente</Label>
                  <Input
                    id="senderName"
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, senderName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderEmail">E-mail do Remetente</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, senderEmail: e.target.value }))}
                  />
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="orderConfirmationSubject">Assunto do E-mail de Confirmação</Label>
                  <Input
                    id="orderConfirmationSubject"
                    value={emailSettings.orderConfirmationSubject}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, orderConfirmationSubject: e.target.value }))}
                  />
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-medium text-gray-900">E-mails Automáticos</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Confirmação de Pedido</p>
                    <p className="text-sm text-gray-500">Enviar e-mail após confirmação do pagamento</p>
                  </div>
                  <Switch
                    checked={emailSettings.enableOrderConfirmation}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enableOrderConfirmation: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">E-mail de Boas-vindas</p>
                    <p className="text-sm text-gray-500">Enviar e-mail quando um novo cliente se cadastrar</p>
                  </div>
                  <Switch
                    checked={emailSettings.welcomeEmail}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, welcomeEmail: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-gradient-to-r from-[#007fff] to-[#0040ff]">
                Salvar Alterações
              </Button>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-white rounded-xl border p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-6 h-6 text-[#007fff]" />
                <h2 className="text-lg font-semibold">Notificações</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Novos Pedidos</p>
                    <p className="text-sm text-gray-500">Receber notificação quando houver um novo pedido</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Novos Clientes</p>
                    <p className="text-sm text-gray-500">Receber notificação quando um novo cliente se cadastrar</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Produtos com Estoque Baixo</p>
                    <p className="text-sm text-gray-500">Receber alerta quando produtos estiverem acabando</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-gradient-to-r from-[#007fff] to-[#0040ff]">
                Salvar Alterações
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
