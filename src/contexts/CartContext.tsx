import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    size: string;
    color: string;
    product?: any; // Produto completo
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, quantity: number, size: string, color: string) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadCart();
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [items]);

    async function loadCart() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${session.user.id}`);
            const data = await response.json();

            if (response.ok) {
                setItems(data || []);
            } else {
                console.error('Erro ao carregar carrinho:', data.error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }

    async function addToCart(product: any, quantity: number, size: string, color: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            // Redirecionar para login ou mostrar modal de login
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: session.user.id,
                    product_id: product.id,
                    quantity,
                    size,
                    color
                })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Erro ao adicionar ao carrinho:', data.error);
                return;
            }
            setItems(prev => [...prev, { ...data, product }]);
        } catch (error) {
            console.error('Erro na requisição ao adicionar ao carrinho:', error);
        }
    }

    async function removeFromCart(itemId: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${itemId}`);
            if (!response.ok) {
                const data = await response.json();
                console.error('Erro ao remover do carrinho:', data.error);
                return;
            }
            setItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Erro na requisição ao remover do carrinho:', error);
        }
    }

    async function updateQuantity(itemId: string, quantity: number) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity })
            });
            if (!response.ok) {
                const data = await response.json();
                console.error('Erro ao atualizar quantidade:', data.error);
                return;
            }
            setItems(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                )
            );
        } catch (error) {
            console.error('Erro na requisição ao atualizar quantidade:', error);
        }
    }

    async function clearCart() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/user/${session.user.id}`);
            if (!response.ok) {
                const data = await response.json();
                console.error('Erro ao limpar carrinho:', data.error);
                return;
            }
            setItems([]);
        } catch (error) {
            console.error('Erro na requisição ao limpar carrinho:', error);
        }
    }

    function calculateTotal() {
        const newTotal = items.reduce((acc, item) => {
            const price = item.product?.preco_promocional || item.product?.preco || 0;
            return acc + (price * item.quantity);
        }, 0);
        setTotal(newTotal);
    }

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
} 