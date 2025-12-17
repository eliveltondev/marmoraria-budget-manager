import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

// Dados fictícios para demonstração
const mockOrders = [
  { 
    id: 1, 
    customer: 'João Silva', 
    date: '2023-10-15', 
    status: 'Aberto', 
    value: 'R$ 2.500,00',
    items: [
      { material: 'Mármore Carrara', quantity: 5, unit: 'm²', unitPrice: 'R$ 350,00', total: 'R$ 1.750,00' },
      { material: 'Instalação', quantity: 1, unit: 'serviço', unitPrice: 'R$ 750,00', total: 'R$ 750,00' },
    ],
    notes: 'Cliente solicitou entrega urgente.'
  },
  { 
    id: 2, 
    customer: 'Maria Oliveira', 
    date: '2023-10-14', 
    status: 'Em Andamento', 
    value: 'R$ 3.200,00',
    items: [
      { material: 'Granito Preto São Gabriel', quantity: 8, unit: 'm²', unitPrice: 'R$ 280,00', total: 'R$ 2.240,00' },
      { material: 'Polimento', quantity: 1, unit: 'serviço', unitPrice: 'R$ 960,00', total: 'R$ 960,00' },
    ],
    notes: ''
  },
  { 
    id: 3, 
    customer: 'Carlos Santos', 
    date: '2023-10-12', 
    status: 'Finalizado', 
    value: 'R$ 1.800,00',
    items: [
      { material: 'Quartzo Branco', quantity: 3, unit: 'm²', unitPrice: 'R$ 420,00', total: 'R$ 1.260,00' },
      { material: 'Instalação', quantity: 1, unit: 'serviço', unitPrice: 'R$ 540,00', total: 'R$ 540,00' },
    ],
    notes: 'Concluído dentro do prazo.'
  },
  { 
    id: 4, 
    customer: 'Ana Ferreira', 
    date: '2023-10-10', 
    status: 'Aberto', 
    value: 'R$ 4.100,00',
    items: [
      { material: 'Mármore Travertino', quantity: 10, unit: 'm²', unitPrice: 'R$ 300,00', total: 'R$ 3.000,00' },
      { material: 'Instalação', quantity: 1, unit: 'serviço', unitPrice: 'R$ 1.100,00', total: 'R$ 1.100,00' },
    ],
    notes: 'Aguardando confirmação do cliente.'
  },
];

const statusVariant = (status: string) => {
  switch (status) {
    case 'Aberto':
      return 'outline';
    case 'Em Andamento':
      return 'secondary';
    case 'Finalizado':
      return 'default';
    default:
      return 'outline';
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<typeof mockOrders[0] | null>(null);

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

    const foundOrder = mockOrders.find(o => o.id === parseInt(id || '0'));
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      toast({
        title: "Orçamento não encontrado",
        description: "O orçamento solicitado não foi encontrado",
        variant: "destructive",
      });
      navigate('/dashboard/orcamentos');
    }
  }, [id, navigate, toast]);

  if (!order) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center">
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Orçamento #{order.id}</h1>
            <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard/orcamentos')}>
              Voltar
            </Button>
            <Button onClick={() => navigate(`/dashboard/orders/${order.id}/edit`)}>
              Editar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Cliente:</strong> {order.customer}</p>
              <p><strong>Data:</strong> {order.date}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Valor Total:</strong> {order.value}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Itens do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Material</th>
                    <th className="text-left py-3 px-2">Quantidade</th>
                    <th className="text-left py-3 px-2">Unidade</th>
                    <th className="text-left py-3 px-2">Preço Unit.</th>
                    <th className="text-left py-3 px-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-2">{item.material}</td>
                      <td className="py-3 px-2">{item.quantity}</td>
                      <td className="py-3 px-2">{item.unit}</td>
                      <td className="py-3 px-2">{item.unitPrice}</td>
                      <td className="py-3 px-2">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailPage;
