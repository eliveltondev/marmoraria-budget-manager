// Data store using localStorage for persistence

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  document: string;
  totalSpent: string;
}

export interface Material {
  id: number;
  name: string;
  type: string;
  price: number;
  stock: number;
  unit: string;
  description?: string;
}

export interface Order {
  id: number;
  customer: string;
  customerId?: number;
  date: string;
  status: string;
  value: string;
  materials?: any[];
  shippingCost?: number;
  installationCost?: number;
  discount?: number;
}

// Initial mock data
const initialCustomers: Customer[] = [
  { 
    id: 1, 
    name: 'João Silva', 
    phone: '(11) 98765-4321', 
    email: 'joao@exemplo.com',
    address: 'Rua das Flores, 123 - São Paulo/SP',
    document: '123.456.789-00',
    totalSpent: 'R$ 5.800,00'
  },
  { 
    id: 2, 
    name: 'Maria Oliveira', 
    phone: '(11) 91234-5678', 
    email: 'maria@exemplo.com',
    address: 'Av. Paulista, 1000 - São Paulo/SP',
    document: '987.654.321-00',
    totalSpent: 'R$ 3.200,00'
  },
  { 
    id: 3, 
    name: 'Carlos Santos', 
    phone: '(11) 99876-5432', 
    email: 'carlos@exemplo.com',
    address: 'Rua Augusta, 500 - São Paulo/SP',
    document: '456.789.123-00',
    totalSpent: 'R$ 1.800,00'
  },
];

const initialMaterials: Material[] = [
  { 
    id: 1, 
    name: 'Mármore Carrara', 
    type: 'Mármore', 
    price: 350.00,
    stock: 50,
    unit: 'm²',
    description: 'Mármore branco de alta qualidade, importado da Itália.'
  },
  { 
    id: 2, 
    name: 'Granito Preto São Gabriel', 
    type: 'Granito', 
    price: 280.00,
    stock: 35,
    unit: 'm²',
    description: 'Granito nacional de cor preta com pequenos cristais.'
  },
  { 
    id: 3, 
    name: 'Quartzo Branco', 
    type: 'Quartzo', 
    price: 420.00,
    stock: 25,
    unit: 'm²',
    description: 'Quartzo branco com alta resistência a manchas e riscos.'
  },
  { 
    id: 4, 
    name: 'Mármore Travertino', 
    type: 'Mármore', 
    price: 300.00,
    stock: 40,
    unit: 'm²'
  },
  { 
    id: 5, 
    name: 'Granito Verde Ubatuba', 
    type: 'Granito', 
    price: 260.00,
    stock: 30,
    unit: 'm²'
  },
];

const initialOrders: Order[] = [
  { id: 1, customer: 'João Silva', date: '2023-10-15', status: 'Aberto', value: 'R$ 2.500,00' },
  { id: 2, customer: 'Maria Oliveira', date: '2023-10-14', status: 'Em Andamento', value: 'R$ 3.200,00' },
  { id: 3, customer: 'Carlos Santos', date: '2023-10-12', status: 'Finalizado', value: 'R$ 1.800,00' },
  { id: 4, customer: 'Ana Ferreira', date: '2023-10-10', status: 'Aberto', value: 'R$ 4.100,00' },
];

// Get data from localStorage or initialize with mock data
export const getCustomers = (): Customer[] => {
  const stored = localStorage.getItem('customers');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('customers', JSON.stringify(initialCustomers));
  return initialCustomers;
};

export const getMaterials = (): Material[] => {
  const stored = localStorage.getItem('materials');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('materials', JSON.stringify(initialMaterials));
  return initialMaterials;
};

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem('orders');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('orders', JSON.stringify(initialOrders));
  return initialOrders;
};

// Save functions
export const saveCustomers = (customers: Customer[]) => {
  localStorage.setItem('customers', JSON.stringify(customers));
};

export const saveMaterials = (materials: Material[]) => {
  localStorage.setItem('materials', JSON.stringify(materials));
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

// Add single item functions
export const addCustomer = (customer: Omit<Customer, 'id' | 'totalSpent'>): Customer => {
  const customers = getCustomers();
  const newId = Math.max(...customers.map(c => c.id), 0) + 1;
  const newCustomer: Customer = { ...customer, id: newId, totalSpent: 'R$ 0,00' };
  customers.push(newCustomer);
  saveCustomers(customers);
  return newCustomer;
};

export const addMaterial = (material: Omit<Material, 'id'>): Material => {
  const materials = getMaterials();
  const newId = Math.max(...materials.map(m => m.id), 0) + 1;
  const newMaterial: Material = { ...material, id: newId };
  materials.push(newMaterial);
  saveMaterials(materials);
  return newMaterial;
};

export const addOrder = (order: Omit<Order, 'id'>): Order => {
  const orders = getOrders();
  const newId = Math.max(...orders.map(o => o.id), 0) + 1;
  const newOrder: Order = { ...order, id: newId };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
};

// Update functions
export const updateCustomer = (id: number, data: Partial<Customer>): Customer | null => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) return null;
  customers[index] = { ...customers[index], ...data };
  saveCustomers(customers);
  return customers[index];
};

export const updateMaterial = (id: number, data: Partial<Material>): Material | null => {
  const materials = getMaterials();
  const index = materials.findIndex(m => m.id === id);
  if (index === -1) return null;
  materials[index] = { ...materials[index], ...data };
  saveMaterials(materials);
  return materials[index];
};

export const updateOrder = (id: number, data: Partial<Order>): Order | null => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...data };
  saveOrders(orders);
  return orders[index];
};

// Delete functions
export const deleteCustomer = (id: number): boolean => {
  const customers = getCustomers();
  const filtered = customers.filter(c => c.id !== id);
  if (filtered.length === customers.length) return false;
  saveCustomers(filtered);
  return true;
};

export const deleteMaterial = (id: number): boolean => {
  const materials = getMaterials();
  const filtered = materials.filter(m => m.id !== id);
  if (filtered.length === materials.length) return false;
  saveMaterials(filtered);
  return true;
};

export const deleteOrder = (id: number): boolean => {
  const orders = getOrders();
  const filtered = orders.filter(o => o.id !== id);
  if (filtered.length === orders.length) return false;
  saveOrders(filtered);
  return true;
};

// Get single item functions
export const getCustomerById = (id: number): Customer | undefined => {
  return getCustomers().find(c => c.id === id);
};

export const getMaterialById = (id: number): Material | undefined => {
  return getMaterials().find(m => m.id === id);
};

export const getOrderById = (id: number): Order | undefined => {
  return getOrders().find(o => o.id === id);
};
