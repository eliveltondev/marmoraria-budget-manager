import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { getOrderById, getCustomerById, getMaterialById, Order } from '@/lib/dataStore';

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
  const [order, setOrder] = useState<Order | null>(null);
  const [customerName, setCustomerName] = useState<string>('');

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

    const orderId = parseInt(id || '0');
    const foundOrder = getOrderById(orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
      
      // Get customer name if customerId exists
      if (foundOrder.customerId) {
        const customer = getCustomerById(foundOrder.customerId);
        if (customer) {
          setCustomerName(customer.name);
        } else {
          setCustomerName(foundOrder.customer);
        }
      } else {
        setCustomerName(foundOrder.customer);
      }
    } else {
      toast({
        title: "Orçamento não encontrado",
        description: "O orçamento solicitado não foi encontrado",
        variant: "destructive",
      });
      navigate('/dashboard/orcamentos');
    }
  }, [id, navigate, toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

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
              <p><strong>Cliente:</strong> {customerName}</p>
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

        {order.materials && order.materials.length > 0 && (
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
                      <th className="text-left py-3 px-2">Descrição</th>
                      <th className="text-left py-3 px-2">Dimensões</th>
                      <th className="text-left py-3 px-2">Qtd</th>
                      <th className="text-left py-3 px-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.materials.map((item, index) => {
                      const material = item.materialId ? getMaterialById(item.materialId) : null;
                      return (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-2">{material?.name || item.materialName || 'Material'}</td>
                          <td className="py-3 px-2">{item.description || '-'}</td>
                          <td className="py-3 px-2">{item.length}m × {item.width}m</td>
                          <td className="py-3 px-2">{item.quantity}</td>
                          <td className="py-3 px-2">{formatCurrency(item.subtotal || 0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {(order.shippingCost || order.installationCost || order.discount) && (
          <Card>
            <CardHeader>
              <CardTitle>Custos Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.shippingCost && order.shippingCost > 0 && (
                <p><strong>Frete:</strong> {formatCurrency(order.shippingCost)}</p>
              )}
              {order.installationCost && order.installationCost > 0 && (
                <p><strong>Instalação:</strong> {formatCurrency(order.installationCost)}</p>
              )}
              {order.discount && order.discount > 0 && (
                <p><strong>Desconto:</strong> {formatCurrency(order.discount)}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailPage;
