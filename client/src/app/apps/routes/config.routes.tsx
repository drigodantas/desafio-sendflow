import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

interface Props {
  children: ReactNode;
  auth: boolean;
}

export default function ConfigRoute(props: Props) {
  const { children, auth } = props;

  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (auth) {
    if (!user) {
      return <Navigate to="/" />;
    }

    return <>{children}</>;
  }

  if (!auth) {
    if (user) {
      return <Navigate to="/connections" />;
    }

    return <>{children}</>;
  }

  return null;
}
