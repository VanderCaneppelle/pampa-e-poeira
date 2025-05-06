import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useState } from 'react';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Coleção', path: '/colecao' },
    { name: 'Produtos', path: '/loja' },
    { name: 'Sobre Nós', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black whitespace-nowrap" style={{ fontFamily: 'Esqadero, sans-serif' }}>
                    <img src={logo} alt="Logo PAMPA & POEIRA" className="h-8 w-auto md:h-10" />
                    <span className="truncate">PAMPA & POEIRA</span>
                </Link>
                {/* Menu desktop */}
                <div className="hidden md:flex gap-6">
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
                </div>
                {/* Menu mobile */}
                <button
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
                    onClick={() => setMenuOpen(m => !m)}
                    aria-label="Abrir menu"
                >
                    <span className={`block w-6 h-0.5 bg-black mb-1 transition ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-black mb-1 transition ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-black transition ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>
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
                    </div>
                </div>
            )}
        </nav>
    );
} 