import { useState } from 'react';
import { ShoppingCart, Search, Eye, Download, Mail } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { orders } from '@/data/mockData';

export function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700',
    };
    return styles[status] || styles.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado',
    };
    return labels[status] || status;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
            <p className="text-gray-500">Gerencie os pedidos da loja</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por número, cliente ou e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'Tente ajustar a busca' : 'Os pedidos aparecerão aqui'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">Pedido</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">Cliente</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">Total</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">Data</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className="font-medium text-[#007fff]">{order.orderNumber}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer.name}</p>
                          <p className="text-sm text-gray-500">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">
                          R$ {order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={getStatusBadge(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pedido {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
                <p className="text-gray-700">{selectedOrder.customer.name}</p>
                <p className="text-gray-500">{selectedOrder.customer.email}</p>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.manual.image}
                        alt={item.manual.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.manual.title}</p>
                        <p className="text-sm text-gray-500">{item.manual.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#007fff]">
                          R$ {item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Links */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Links de Download</h4>
                <div className="space-y-2">
                  {selectedOrder.downloadLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-700 line-clamp-1">{link.manualTitle}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-gray-600">Total do Pedido</span>
                <span className="text-2xl font-bold text-[#007fff]">
                  R$ {selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
