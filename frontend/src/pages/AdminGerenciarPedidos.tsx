import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

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
    user_email?: string;
}

const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'processing', label: 'Em processamento' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' }
];

export default function AdminGerenciarPedidos() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [emailFilter, setEmailFilter] = useState<string>('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, emailFilter]);

    async function fetchOrders() {
        try {
            setLoading(true);

            let url = `${API_URL}/api/orders`;
            const params = new URLSearchParams();

            if (statusFilter) params.append('status', statusFilter);
            if (emailFilter) params.append('email', emailFilter);

            if ([...params].length > 0) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            setOrders(data.map((order: any) => ({
                ...order,
                user_email: order.user?.email || order.user_email
            })));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
        } finally {
            setLoading(false);
        }
    }


    async function updateOrderStatus(orderId: string, newStatus: string) {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            // Atualizar a lista de pedidos
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

            // Fechar o modal
            setSelectedOrder(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Pedidos</h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {/* Filtros */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Filtrar por Status
                                </label>
                                <select
                                    id="status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pampa-leather focus:ring-pampa-leather"
                                >
                                    <option value="">Todos os status</option>
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Filtrar por Email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    value={emailFilter}
                                    onChange={(e) => setEmailFilter(e.target.value)}
                                    placeholder="Digite o email do cliente"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pampa-leather focus:ring-pampa-leather"
                                />
                            </div>
                        </div>

                        {/* Lista de Pedidos */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.user_email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                R$ {order.total_amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                                                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {statusOptions.find(s => s.value === order.status)?.label || order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-pampa-leather hover:text-pampa-leather-dark"
                                                >
                                                    Alterar Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Alteração de Status */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Alterar Status do Pedido
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Pedido: {selectedOrder.id}
                        </p>
                        <div className="space-y-4">
                            {statusOptions.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => updateOrderStatus(selectedOrder.id, option.value)}
                                    className={`w-full px-4 py-2 rounded-md text-sm font-medium
                                        ${selectedOrder.status === option.value
                                            ? 'bg-pampa-leather text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 