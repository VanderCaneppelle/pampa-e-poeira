import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabaseClient';

interface ShippingAddress {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export default function Checkout() {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState<ShippingAddress>({
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Você precisa estar logado para finalizar a compra');
            }

            // Criar o pedido
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([
                    {
                        user_id: session.user.id,
                        status: 'pending',
                        total_amount: total,
                        shipping_address: address,
                        payment_method: 'credit_card' // Você pode adicionar mais opções depois
                    }
                ])
                .select()
                .single();

            if (orderError) throw orderError;

            // Criar os itens do pedido
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_time: item.product?.preco_promocional || item.product?.preco,
                size: item.size,
                color: item.color
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Limpar o carrinho
            await clearCart();

            // Redirecionar para página de sucesso
            navigate(`/pedido/sucesso/${order.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao processar pedido');
        } finally {
            setLoading(false);
        }
    }

    function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
                        <button
                            onClick={() => navigate('/loja')}
                            className="bg-pampa-leather text-white px-6 py-2 rounded-md hover:bg-pampa-leather-dark"
                        >
                            Continuar comprando
                        </button>
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Finalizar compra</h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço de entrega</h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                                            CEP
                                        </label>
                                        <input
                                            type="text"
                                            name="cep"
                                            id="cep"
                                            required
                                            value={address.cep}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pampa-leather focus:ring-pampa-leather"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="rua" className="block text-sm font-medium text-gray-700">
                                            Rua
                                        </label>
                                        <input
                                            type="text"
                                            name="rua"
                                            id="rua"
                                            required
                                            value={address.rua}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pampa-leather focus:ring-pampa-leather"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                                            Número
                                        </label>
                                        <input
                                            type="text"
                                            name="numero"
                                            id="numero"
                                            required
                                            value={address.numero}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pampa-leather focus:ring-pampa-leather"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                                            Complemento
                                        </label>
                                        <input
                                            type="text"
                                            name="complemento"
                                            id="complemento"
                                            value={address.complemento}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pampa-leather focus:ring-pampa-leather"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                                            Bairro
                                        </label>
                                        <input
                                            type="text"
                                            name="bairro"
                                            id="bairro"
                                            required
                                            value={address.bairro}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pampa-leather focus:ring-pampa-leather"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            name="cidade"
                                            id="cidade"
                                            required
                                            value={address.cidade}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pampa-leather focus:ring-pampa-leather"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                                            Estado
                                        </label>
                                        <input
                                            type="text"
                                            name="estado"
                                            id="estado"
                                            required
                                            value={address.estado}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pampa-leather focus:ring-pampa-leather"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-lg font-medium text-gray-900">Total</p>
                                        <p className="text-2xl font-bold text-gray-900">R$ {total.toFixed(2)}</p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-pampa-leather text-white px-6 py-3 rounded-md hover:bg-pampa-leather-dark disabled:opacity-50"
                                    >
                                        {loading ? 'Processando...' : 'Finalizar pedido'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 