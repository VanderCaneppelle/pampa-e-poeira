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

        const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select('*, product:produtos(*)')
            .eq('user_id', session.user.id);

        if (error) {
            console.error('Erro ao carregar carrinho:', error);
            return;
        }

        setItems(cartItems || []);
    }

    async function addToCart(product: any, quantity: number, size: string, color: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            // Redirecionar para login ou mostrar modal de login
            return;
        }

        const { data, error } = await supabase
            .from('cart_items')
            .insert([
                {
                    user_id: session.user.id,
                    product_id: product.id,
                    quantity,
                    size,
                    color
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            return;
        }

        setItems(prev => [...prev, { ...data, product }]);
    }

    async function removeFromCart(itemId: string) {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId);

        if (error) {
            console.error('Erro ao remover do carrinho:', error);
            return;
        }

        setItems(prev => prev.filter(item => item.id !== itemId));
    }

    async function updateQuantity(itemId: string, quantity: number) {
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', itemId);

        if (error) {
            console.error('Erro ao atualizar quantidade:', error);
            return;
        }

        setItems(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    }

    async function clearCart() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', session.user.id);

        if (error) {
            console.error('Erro ao limpar carrinho:', error);
            return;
        }

        setItems([]);
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