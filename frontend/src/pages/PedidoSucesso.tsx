import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface Order {
    id: string;
    total_amount: number;
    status: string;
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
}

export default function PedidoSucesso() {
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            if (!orderId) return;

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (error) {
                console.error('Erro ao buscar pedido:', error);
                return;
            }

            setOrder(data);
            setLoading(false);
        }

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h2>
                        <Link
                            to="/loja"
                            className="inline-block bg-pampa-leather text-white px-6 py-2 rounded-md hover:bg-pampa-leather-dark"
                        >
                            Voltar para a loja
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="text-center mb-8">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Pedido realizado com sucesso!
                            </h2>
                            <p className="text-gray-600">
                                Obrigado por comprar conosco. Seu pedido foi recebido e está sendo processado.
                            </p>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Número do pedido</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{order.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Data do pedido</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Total</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        R$ {order.total_amount.toFixed(2)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {order.status === 'pending' ? 'Pendente' : order.status}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço de entrega</h3>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {order.shipping_address.rua}, {order.shipping_address.numero}
                                        {order.shipping_address.complemento && ` - ${order.shipping_address.complemento}`}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Bairro</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{order.shipping_address.bairro}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Cidade/Estado</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {order.shipping_address.cidade}/{order.shipping_address.estado}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">CEP</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{order.shipping_address.cep}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <Link
                                to="/loja"
                                className="bg-pampa-leather text-white px-6 py-2 rounded-md hover:bg-pampa-leather-dark"
                            >
                                Continuar comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 