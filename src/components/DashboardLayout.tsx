import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Package, 
  LogOut, 
  Menu, 
  X,
  Tags 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso",
    });
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      href: '/dashboard',
      onClick: () => navigate('/dashboard')
    },
    { 
      icon: FileText, 
      label: 'Orçamentos', 
      href: '/dashboard',
      onClick: () => navigate('/dashboard')
    },
    { 
      icon: Users, 
      label: 'Clientes', 
      href: '/dashboard/customers',
      onClick: () => navigate('/dashboard/customers')
    },
    { 
      icon: Package, 
      label: 'Materiais', 
      href: '/dashboard/materials',
      onClick: () => navigate('/dashboard/materials')
    },
    { 
      icon: Tags, 
      label: 'Status', 
      href: '/dashboard/status',
      onClick: () => navigate('/dashboard/status')
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar para desktop */}
      <div 
        className={`bg-sidebar border-r border-sidebar-border ${
          sidebarOpen ? 'w-64' : 'w-16'
        } transition-all duration-300 ease-in-out hidden md:flex flex-col`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen ? (
            <img src={logo} alt="Marmoraria Tech" className="h-10 w-auto" />
          ) : (
            <div className="font-bold text-xl text-sidebar-foreground">MT</div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-0 h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
        <div className="flex flex-col flex-1 py-4">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'} py-2 my-1 mx-2 text-sidebar-foreground hover:bg-sidebar-accent ${
                isActive(item.href) ? 'bg-sidebar-accent' : ''
              }`}
              onClick={item.onClick}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          ))}
        </div>
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={`flex items-center ${sidebarOpen ? 'justify-start w-full' : 'justify-center'} text-destructive hover:text-destructive hover:bg-destructive/10`}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Sair</span>}
          </Button>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
        <div className="flex justify-around">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`flex flex-col items-center py-2 hover:bg-accent ${
                isActive(item.href) ? 'bg-accent text-accent-foreground' : ''
              }`}
              onClick={item.onClick}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
          <Button
            variant="ghost"
            className="flex flex-col items-center py-2 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Sair</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top header for mobile */}
        <header className="bg-card border-b border-border p-4 md:hidden">
          <div className="flex justify-between items-center">
            <img src={logo} alt="Marmoraria Tech" className="h-8 w-auto" />
            <Button 
              variant="ghost" 
              size="sm"
              className="p-0 h-8 w-8"
              onClick={() => {
                const drawer = document.getElementById('mobile-drawer');
                if (drawer) {
                  drawer.classList.toggle('translate-x-0');
                  drawer.classList.toggle('-translate-x-full');
                }
              }}
            >
              <Menu size={20} />
            </Button>
          </div>
        </header>

        {/* Mobile drawer */}
        <div
          id="mobile-drawer"
          className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform -translate-x-full transition-transform duration-300 ease-in-out md:hidden"
        >
          <div className="p-4 border-b border-border flex justify-between items-center">
            <img src={logo} alt="Marmoraria Tech" className="h-8 w-auto" />
            <Button 
              variant="ghost" 
              size="sm"
              className="p-0 h-8 w-8"
              onClick={() => {
                const drawer = document.getElementById('mobile-drawer');
                if (drawer) {
                  drawer.classList.toggle('-translate-x-full');
                }
              }}
            >
              <X size={18} />
            </Button>
          </div>
          <div className="flex flex-col p-4">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`flex items-center justify-start px-4 py-2 my-1 hover:bg-accent ${
                  isActive(item.href) ? 'bg-accent' : ''
                }`}
                onClick={() => {
                  item.onClick();
                  const drawer = document.getElementById('mobile-drawer');
                  if (drawer) {
                    drawer.classList.add('-translate-x-full');
                  }
                }}
              >
                <item.icon size={20} />
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
