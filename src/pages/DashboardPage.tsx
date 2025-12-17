import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const mockOrders = [
  { id: 1, customer: 'João Silva', date: '2023-10-15', status: 'Aberto', value: 2500 },
  { id: 2, customer: 'Maria Oliveira', date: '2023-10-14', status: 'Em Andamento', value: 3200 },
  { id: 3, customer: 'Carlos Santos', date: '2023-10-12', status: 'Finalizado', value: 1800 },
  { id: 4, customer: 'Ana Ferreira', date: '2023-10-10', status: 'Aberto', value: 4100 },
  { id: 5, customer: 'Pedro Lima', date: '2023-10-08', status: 'Finalizado', value: 2900 },
  { id: 6, customer: 'Lucia Costa', date: '2023-10-05', status: 'Em Andamento', value: 3600 },
];

const monthlyData = [
  { month: 'Jul', valor: 12500 },
  { month: 'Ago', valor: 18200 },
  { month: 'Set', valor: 15800 },
  { month: 'Out', valor: 21000 },
];

const COLORS = ['hsl(45, 93%, 47%)', 'hsl(210, 100%, 50%)', 'hsl(142, 76%, 36%)'];

const DashboardPage = () => {
  const [orders] = useState(mockOrders);
  const navigate = useNavigate();
  const { toast } = useToast();

  const statusData = [
    { name: 'Aberto', value: orders.filter(o => o.status === 'Aberto').length },
    { name: 'Em Andamento', value: orders.filter(o => o.status === 'Em Andamento').length },
    { name: 'Finalizado', value: orders.filter(o => o.status === 'Finalizado').length },
  ];

  const totalValue = orders.reduce((sum, o) => sum + o.value, 0);

  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (!authUser) {
      navigate('/login');
      toast({
        title: "Acesso não autorizado",
        description: "Faça login para acessar o dashboard",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Orçamentos Abertos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => order.status === 'Aberto').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => order.status === 'Em Andamento').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Finalizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => order.status === 'Finalizado').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Faturamento Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalValue.toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Faturamento Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                    />
                    <Bar dataKey="valor" fill="hsl(210, 100%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
