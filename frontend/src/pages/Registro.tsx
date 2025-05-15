import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Registro() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            // Redirecionar para página de confirmação
            navigate('/registro/confirmacao');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Crie sua conta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ou{' '}
                        <Link to="/login" className="font-medium text-pampa-leather hover:text-pampa-leather-dark">
                            faça login se já tiver uma conta
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pampa-leather focus:border-pampa-leather focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pampa-leather focus:border-pampa-leather focus:z-10 sm:text-sm"
                                placeholder="Senha"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">
                                Confirme sua senha
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pampa-leather focus:border-pampa-leather focus:z-10 sm:text-sm"
                                placeholder="Confirme sua senha"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pampa-leather hover:bg-pampa-leather-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pampa-leather"
                        >
                            {loading ? 'Criando conta...' : 'Criar conta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 