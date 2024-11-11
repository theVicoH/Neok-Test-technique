import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
