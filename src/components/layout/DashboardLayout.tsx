// src/components/layouts/DashboardLayout.tsx
import { ReactNode } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Plateforme d'investissement
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {user?.username}
              </span>
              <Button 
                variant="outline"
                onClick={handleLogout}
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}