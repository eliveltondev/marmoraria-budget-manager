import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { getOrders, deleteOrder, Order } from '@/lib/dataStore';

const statusClass = (status: string) => {
  switch (status) {
    case 'Aberto':
      return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
    case 'Em Andamento':
      return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
    case 'Finalizado':
      return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
    default:
      return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
  }
};

const OrcamentosPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (!authUser) {
      navigate('/login');
      toast({
        title: "Acesso não autorizado",
        description: "Faça login para acessar o sistema",
        variant: "destructive",
      });
      return;
    }
    // Load orders from dataStore
    setOrders(getOrders());
  }, [navigate, toast]);

  const handleDeleteOrder = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      deleteOrder(id);
      setOrders(getOrders());
      toast({
        title: "Orçamento excluído",
        description: "O orçamento foi excluído com sucesso",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-64">
              <Input
                placeholder="Buscar orçamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate('/dashboard/new-order')}>
              Novo Orçamento
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum orçamento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <span className={statusClass(order.status)}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>{order.value}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                          >
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/dashboard/orders/${order.id}/edit`)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                          >
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrcamentosPage;
