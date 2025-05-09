import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
    const { items, removeFromCart, updateQuantity, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
                        <Link
                            to="/loja"
                            className="inline-block bg-pampa-leather text-white px-6 py-2 rounded-md hover:bg-pampa-leather-dark"
                        >
                            Continuar comprando
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Seu carrinho</h2>

                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.product?.imagem_principal}
                                            alt={item.product?.nome}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{item.product?.nome}</h3>
                                            <p className="text-sm text-gray-500">
                                                Tamanho: {item.size} | Cor: {item.color}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    -
                                                </button>
                                                <span className="text-gray-700">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <p className="text-lg font-medium text-gray-900">
                                            R$ {((item.product?.preco_promocional || item.product?.preco) * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 border-t pt-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-medium text-gray-900">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">R$ {total.toFixed(2)}</p>
                                </div>
                                <Link
                                    to="/checkout"
                                    className="bg-pampa-leather text-white px-6 py-3 rounded-md hover:bg-pampa-leather-dark"
                                >
                                    Finalizar compra
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 