import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';

interface AuthGuardProps {
  children: ReactNode;
  requireProfile?: boolean;
}

export default function AuthGuard({ children, requireProfile = true }: AuthGuardProps) {
  const user = useUserStore((state) => state.user);
  const hasProfile = useUserStore((state) => state.hasProfile());
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireProfile && !hasProfile && location.pathname !== '/create-profile') {
    return <Navigate to="/create-profile" />;
  }

  return <>{children}</>;
}