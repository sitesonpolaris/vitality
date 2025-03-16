import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  // Check if user is authenticated and has admin role
  if (!user || !user.app_metadata?.role === 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}