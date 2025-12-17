import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import OrcamentosPage from "./pages/OrcamentosPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import NewOrderPage from "./pages/NewOrderPage";
import OrderEditPage from "./pages/OrderEditPage";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import MaterialsPage from "./pages/MaterialsPage";
import MaterialDetailPage from "./pages/MaterialDetailPage";
import StatusPage from "./pages/StatusPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/orcamentos" element={<OrcamentosPage />} />
          <Route path="/dashboard/orders/:id" element={<OrderDetailPage />} />
          <Route path="/dashboard/orders/:id/edit" element={<OrderEditPage />} />
          <Route path="/dashboard/new-order" element={<NewOrderPage />} />
          <Route path="/dashboard/customers" element={<CustomersPage />} />
          <Route path="/dashboard/customers/new" element={<CustomerDetailPage />} />
          <Route path="/dashboard/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/dashboard/materials" element={<MaterialsPage />} />
          <Route path="/dashboard/materials/new" element={<MaterialDetailPage />} />
          <Route path="/dashboard/materials/:id/edit" element={<MaterialDetailPage />} />
          <Route path="/dashboard/status" element={<StatusPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
