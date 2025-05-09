import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AdminBar from '../components/AdminBar';

interface Order {
    id: string;
    user_id: string;
    status: string;
    total_amount: number;
    created_at: string;
    shipping_address: {
        cep: string;
        rua: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        estado: string;
    };
    user?: {
        email: string;
    };
}

interface Stats {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    recentOrders: Order[];
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    const [, setStats] = useState<Stats>({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        recentOrders: []
    });

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            setLoading(true);

            // Buscar total de produtos
            const { count: productsCount, error: productsError } = await supabase
                .from('produtos')
                .select('*', { count: 'exact', head: true });

            if (productsError) throw productsError;

            // Buscar total de pedidos
            const { count: ordersCount, error: ordersError } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            if (ordersError) throw ordersError;

            // Buscar total de usuários
            const { count: usersCount, error: usersError } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            if (usersError) throw usersError;

            // Buscar pedidos recentes
            const { data: recentOrders, error: recentOrdersError } = await supabase
                .from('orders')
                .select(`
                    *,
                    user:user_id (
                        email
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            if (recentOrdersError) throw recentOrdersError;

            setStats({
                totalProducts: productsCount || 0,
                totalOrders: ordersCount || 0,
                totalUsers: usersCount || 0,
                recentOrders: recentOrders || []
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminBar />
            <div className="pt-12 min-h-screen bg-gray-100">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Link
                            to="/admin/novo-produto"
                            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-pampa-leather rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Cadastrar Produto</dt>
                                            <dd className="text-lg font-medium text-gray-900">Adicionar novo produto</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <Link
                            to="/admin/gerenciar-produtos"
                            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-pampa-leather rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Gerenciar Produtos</dt>
                                            <dd className="text-lg font-medium text-gray-900">Editar ou excluir produtos</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className="bg-white overflow-hidden shadow rounded-lg opacity-60 cursor-not-allowed">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-pampa-leather rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Gerenciar Pedidos</dt>
                                            <dd className="text-lg font-medium text-gray-900">Em breve</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 