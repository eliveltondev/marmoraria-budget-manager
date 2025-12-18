import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Printer, Plus, Trash2 } from 'lucide-react';
import { 
  getOrderById, 
  getCustomers, 
  getMaterials, 
  getCustomerById,
  getMaterialById,
  updateOrder,
  Customer,
  Material,
  Order
} from '@/lib/dataStore';

const OrderEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  
  const [customerId, setCustomerId] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [shippingCost, setShippingCost] = useState('');
  const [installationCost, setInstallationCost] = useState('');
  const [discount, setDiscount] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // New item form states
  const [newItemMaterial, setNewItemMaterial] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemLength, setNewItemLength] = useState('');
  const [newItemWidth, setNewItemWidth] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');

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

    // Load customers and materials from dataStore
    setCustomers(getCustomers());
    setMaterials(getMaterials());

    // Fetch order data from dataStore
    if (id) {
      const orderId = parseInt(id);
      const orderData = getOrderById(orderId);
      
      if (orderData) {
        setOrder(orderData);
        setCustomerId(orderData.customerId?.toString() || '');
        setStatus(orderData.status);
        setItems(orderData.materials || []);
        setShippingCost(orderData.shippingCost?.toString() || '');
        setInstallationCost(orderData.installationCost?.toString() || '');
        setDiscount(orderData.discount?.toString() || '');
        
        // Fetch customer info
        if (orderData.customerId) {
          const customer = getCustomerById(orderData.customerId);
          if (customer) {
            setCustomerInfo({
              name: customer.name,
              phone: customer.phone,
              email: customer.email,
              address: customer.address
            });
          }
        }
      } else {
        toast({
          title: "Orçamento não encontrado",
          description: "O orçamento solicitado não foi encontrado",
          variant: "destructive",
        });
        navigate('/dashboard/orcamentos');
      }
    }
  }, [id, navigate, toast]);

  // Update customer info when customer selection changes
  useEffect(() => {
    if (customerId) {
      const customer = getCustomerById(parseInt(customerId));
      if (customer) {
        setCustomerInfo({
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address
        });
      }
    }
  }, [customerId]);

  const calculateItemPrice = (materialId: number, length: number, width: number, quantity: number) => {
    const material = getMaterialById(materialId);
    if (!material) return 0;
    const area = length * width;
    return material.price * area * quantity;
  };

  const handleAddItem = () => {
    if (!newItemMaterial || !newItemDescription || !newItemLength || !newItemWidth || !newItemQuantity) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos do item",
        variant: "destructive",
      });
      return;
    }

    const materialId = parseInt(newItemMaterial);
    const length = parseFloat(newItemLength);
    const width = parseFloat(newItemWidth);
    const quantity = parseInt(newItemQuantity);
    const subtotal = calculateItemPrice(materialId, length, width, quantity);
    const material = getMaterialById(materialId);

    const newItem = {
      id: Date.now(),
      materialId,
      materialName: material?.name || '',
      description: newItemDescription,
      length,
      width,
      quantity,
      subtotal
    };

    setItems([...items, newItem]);
    
    // Reset form
    setNewItemMaterial('');
    setNewItemDescription('');
    setNewItemLength('');
    setNewItemWidth('');
    setNewItemQuantity('1');
  };

  const handleRemoveItem = (itemId: number) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  };

  const calculateTotal = () => {
    let total = calculateSubtotal();
    if (shippingCost) total += parseFloat(shippingCost);
    if (installationCost) total += parseFloat(installationCost);
    if (discount) total -= parseFloat(discount);
    return total;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSave = () => {
    setIsLoading(true);
    
    if (!customerId || !status) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const customer = getCustomerById(parseInt(customerId));
    const total = calculateTotal();

    const updatedOrder = updateOrder(parseInt(id || '0'), {
      customer: customer?.name || '',
      customerId: parseInt(customerId),
      status,
      value: formatCurrency(total),
      materials: items,
      shippingCost: shippingCost ? parseFloat(shippingCost) : 0,
      installationCost: installationCost ? parseFloat(installationCost) : 0,
      discount: discount ? parseFloat(discount) : 0
    });

    if (updatedOrder) {
      toast({
        title: "Orçamento atualizado",
        description: "O orçamento foi atualizado com sucesso",
      });
      navigate('/dashboard/orcamentos');
    } else {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o orçamento",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erro ao imprimir",
        description: "Não foi possível abrir a janela de impressão",
        variant: "destructive",
      });
      return;
    }

    const customer = customers.find(c => c.id.toString() === customerId);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Orçamento #${id}</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 15px;
          }
          .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .info-block {
            margin-bottom: 15px;
          }
          .info-block h3 {
            margin: 0 0 5px 0;
            font-size: 14px;
            border-bottom: 1px solid #eee;
            padding-bottom: 3px;
          }
          .info-block p {
            margin: 5px 0;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
          .summary {
            margin-top: 20px;
            text-align: right;
          }
          .summary div {
            margin-bottom: 5px;
          }
          .total {
            font-weight: bold;
            font-size: 14px;
            border-top: 1px solid #ddd;
            padding-top: 5px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 15px;
            font-size: 10px;
          }
          @media print {
            @page {
              size: A4;
              margin: 15mm 10mm;
            }
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">MARMORARIA TECH</div>
          <div>Rua Exemplo, 123 - Bairro - Cidade/UF</div>
          <div>Tel: (11) 1234-5678 | Email: contato@marmorariatech.com</div>
        </div>
        
        <div class="title">ORÇAMENTO #${id}</div>
        <div>Data: ${new Date().toLocaleDateString()}</div>
        <div>Status: ${status}</div>
        
        <div class="info-grid">
          <div class="info-block">
            <h3>Informações do Cliente</h3>
            <p><strong>Nome:</strong> ${customer?.name || '-'}</p>
            <p><strong>Telefone:</strong> ${customer?.phone || '-'}</p>
            <p><strong>Email:</strong> ${customer?.email || '-'}</p>
            <p><strong>Endereço:</strong> ${customer?.address || '-'}</p>
          </div>
          
          <div class="info-block">
            <h3>Observações</h3>
            <p>${notes || 'Nenhuma observação'}</p>
          </div>
        </div>
        
        <div class="info-block">
          <h3>Itens do Orçamento</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Material</th>
                <th>Dimensões</th>
                <th>Qtd</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item, index) => {
                const material = getMaterialById(item.materialId);
                return `
                  <tr>
                    <td>${index + 1}. ${item.description}</td>
                    <td>${material?.name || item.materialName || 'Material'}</td>
                    <td>${item.length}m × ${item.width}m</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.subtotal || 0)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <div><strong>Subtotal:</strong> ${formatCurrency(calculateSubtotal())}</div>
            ${shippingCost ? `<div><strong>Frete:</strong> ${formatCurrency(parseFloat(shippingCost))}</div>` : ''}
            ${installationCost ? `<div><strong>Instalação:</strong> ${formatCurrency(parseFloat(installationCost))}</div>` : ''}
            ${discount ? `<div><strong>Desconto:</strong> ${formatCurrency(parseFloat(discount))}</div>` : ''}
            <div class="total"><strong>TOTAL:</strong> ${formatCurrency(calculateTotal())}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Este orçamento tem validade de 15 dias a partir da data de emissão.</p>
          <p>Marmoraria Tech | CNPJ: 00.000.000/0001-00</p>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }, 500);
          }
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  if (!order) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <p>Carregando orçamento...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Editar Orçamento #{id}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard/orcamentos')}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2" size={16} /> Imprimir
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Orçamento"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações do Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Cliente</Label>
                    <Select value={customerId} onValueChange={setCustomerId}>
                      <SelectTrigger id="customer">
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aberto">Aberto</SelectItem>
                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                        <SelectItem value="Finalizado">Finalizado</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {customerId && (
                  <Card className="border border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Informações do Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Nome</Label>
                          <p className="text-sm">{customerInfo.name}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Telefone</Label>
                          <p className="text-sm">{customerInfo.phone}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Email</Label>
                          <p className="text-sm">{customerInfo.email}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Endereço</Label>
                          <p className="text-sm">{customerInfo.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingCost">Frete (R$)</Label>
                    <Input
                      id="shippingCost"
                      type="number"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="installationCost">Instalação (R$)</Label>
                    <Input
                      id="installationCost"
                      type="number"
                      value={installationCost}
                      onChange={(e) => setInstallationCost(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Desconto (R$)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                {shippingCost && (
                  <div className="flex justify-between text-sm">
                    <span>Frete:</span>
                    <span>{formatCurrency(parseFloat(shippingCost))}</span>
                  </div>
                )}
                {installationCost && (
                  <div className="flex justify-between text-sm">
                    <span>Instalação:</span>
                    <span>{formatCurrency(parseFloat(installationCost))}</span>
                  </div>
                )}
                {discount && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>Desconto:</span>
                    <span>-{formatCurrency(parseFloat(discount))}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Itens do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Items list */}
              {items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Material</th>
                        <th className="text-left py-3 px-2">Descrição</th>
                        <th className="text-left py-3 px-2">Dimensões</th>
                        <th className="text-left py-3 px-2">Qtd</th>
                        <th className="text-left py-3 px-2">Total</th>
                        <th className="text-left py-3 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const material = getMaterialById(item.materialId);
                        return (
                          <tr key={item.id} className="border-b">
                            <td className="py-3 px-2">{material?.name || item.materialName || 'Material'}</td>
                            <td className="py-3 px-2">{item.description}</td>
                            <td className="py-3 px-2">{item.length}m × {item.width}m</td>
                            <td className="py-3 px-2">{item.quantity}</td>
                            <td className="py-3 px-2">{formatCurrency(item.subtotal || 0)}</td>
                            <td className="py-3 px-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 size={16} className="text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add new item form */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Adicionar Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>Material</Label>
                    <Select value={newItemMaterial} onValueChange={setNewItemMaterial}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map(material => (
                          <SelectItem key={material.id} value={material.id.toString()}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                      placeholder="Ex: Bancada"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Comp. (m)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItemLength}
                      onChange={(e) => setNewItemLength(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Larg. (m)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItemWidth}
                      onChange={(e) => setNewItemWidth(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Qtd</Label>
                    <Input
                      type="number"
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>
                <Button onClick={handleAddItem} variant="outline">
                  <Plus size={16} className="mr-2" /> Adicionar Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrderEditPage;
