import { Link } from 'react-router-dom';

export default function RegistroConfirmacao() {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Verifique seu email
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enviamos um link de confirmação para seu email. Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pampa-leather hover:bg-pampa-leather-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pampa-leather"
                            >
                                Ir para o login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 