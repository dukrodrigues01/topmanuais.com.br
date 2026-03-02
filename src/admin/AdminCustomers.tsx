import { useState } from 'react';
import { Users, Search, Mail, ShoppingCart } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { currentUser } from '@/data/mockData';

export function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock customers list
  const customers = [
    currentUser,
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      role: 'customer',
      purchases: [],
      favorites: [],
      createdAt: '2024-02-15',
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      role: 'customer',
      purchases: [],
      favorites: [],
      createdAt: '2024-03-01',
    },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-500">Gerencie os clientes cadastrados</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total de Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Novos este mês</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Clientes ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-xl border overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum cliente encontrado
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">Cliente</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">E-mail</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">Cadastro</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007fff] to-[#00bfff] flex items-center justify-center text-white font-medium">
                            {customer.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600">{customer.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600">
                          {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar E-mail
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
    </AdminLayout>
  );
}
