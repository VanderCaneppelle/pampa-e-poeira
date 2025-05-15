import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();

    useEffect(() => {
        async function checkAuth() {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (!session) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }
                const { data: userData, error: userError } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', session.user.id)
                    .single();
                if (userError) throw userError;
                setIsAuthenticated(true);
                setIsAdmin(userData?.is_admin || false);
            } catch (error) {
                setIsAuthenticated(false);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        }
        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pampa-leather"></div>
            </div>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
} 