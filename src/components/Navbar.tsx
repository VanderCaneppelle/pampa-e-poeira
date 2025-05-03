import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Coleção', path: '/colecao' },
    { name: 'Produtos', path: '/loja' },
    { name: 'Sobre Nós', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
];

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-black" style={{ fontFamily: 'Esqadero, sans-serif' }}>
                    <img src={logo} alt="Logo PAMPA & POEIRA" className="h-10 w-auto" />
                    PAMPA & POEIRA
                </Link>
                <div className="flex gap-6">
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
            </div>
        </nav>
    );
} 