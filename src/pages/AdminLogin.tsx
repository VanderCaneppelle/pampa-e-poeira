import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setMsg('');
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) setMsg('Erro: ' + error.message);
        else {
            setMsg('Login realizado! Redirecionando...');
            setTimeout(() => navigate('/admin/novo-produto'), 1000);
        }
    }

    return (
        <div className="max-w-sm mx-auto py-12">
            <h1 className="text-2xl font-bold mb-6 text-center">Login Admin</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border rounded px-3 py-2" />
                <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required className="border rounded px-3 py-2" />
                <button type="submit" className="bg-pampa-leather text-pampa-white py-2 rounded font-bold">Entrar</button>
                {msg && <div className="text-center text-red-600">{msg}</div>}
            </form>
        </div>
    );
} 