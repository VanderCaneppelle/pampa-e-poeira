import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabaseClient';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Coleção', path: '/colecao' },
    { name: 'Produtos', path: '/loja' },
    { name: 'Sobre Nós', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const { items } = useCart();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        // Verificar usuário atual
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Escutar mudanças na autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black whitespace-nowrap" style={{ fontFamily: 'Esqadero, sans-serif' }}>
                        <img src={logo} alt="Logo PAMPA & POEIRA" className="h-8 w-auto md:h-10" />
                        <span>2 PAMPA & POEIRA |  </span>
                    </Link>

                    {/* Menu desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map(item => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `text-lg px-2 py-1 rounded transition-colors duration-200 ${isActive ? 'text-pampa-leather font-bold' : 'text-black hover:text-pampa-leather'}`
                                }
                                end={item.path === '/'}
                            >
                                {item.name}
                            </NavLink>
                        ))}
                        <Link
                            to="/carrinho"
                            className="relative text-black hover:text-pampa-leather transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-pampa-leather text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">{user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-pampa-leather hover:text-pampa-leather-dark"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-sm text-pampa-leather hover:text-pampa-leather-dark"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    to="/registro"
                                    className="text-sm bg-pampa-leather text-white px-4 py-2 rounded hover:bg-pampa-leather-dark"
                                >
                                    Criar conta
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Menu mobile */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link
                            to="/carrinho"
                            className="relative text-black hover:text-pampa-leather transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-pampa-leather text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            className="flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
                            onClick={() => setMenuOpen(m => !m)}
                            aria-label="Abrir menu"
                        >
                            <span className={`block w-6 h-0.5 bg-black mb-1 transition ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-black mb-1 transition ${menuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-black transition ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                        </button>
                    </div>
                </div>

                {/* Dropdown mobile */}
                {menuOpen && (
                    <div className="md:hidden bg-white shadow-lg border-t border-pampa-beige w-full absolute left-0 top-16 z-50 animate-fade-in">
                        <div className="flex flex-col py-2">
                            {navItems.map(item => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `text-base px-4 py-3 border-b border-pampa-beige ${isActive ? 'text-pampa-leather font-bold' : 'text-black hover:text-pampa-leather'}`
                                    }
                                    end={item.path === '/'}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                            {user ? (
                                <>
                                    <div className="px-4 py-3 border-b border-pampa-beige">
                                        <span className="text-sm text-gray-600">{user.email}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMenuOpen(false);
                                        }}
                                        className="text-left text-base px-4 py-3 border-b border-pampa-beige text-pampa-leather hover:text-pampa-leather-dark"
                                    >
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-base px-4 py-3 border-b border-pampa-beige text-pampa-leather hover:text-pampa-leather-dark"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Entrar
                                    </Link>
                                    <Link
                                        to="/registro"
                                        className="text-base px-4 py-3 border-b border-pampa-beige text-pampa-leather hover:text-pampa-leather-dark"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Criar conta
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            <div className="h-16" />
        </>
    );
} 