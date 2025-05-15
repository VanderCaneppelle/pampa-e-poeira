import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBar from '../components/AdminBar';
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminGerenciarProdutos() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [msg] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProdutos() {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/produtos`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Erro ao buscar produtos:', errorData.error);
                    setProdutos([]);
                } else {
                    const data = await response.json();
                    setProdutos(data || []);
                }
            } catch (error) {
                setProdutos([]);
                console.error('Erro ao buscar produtos:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProdutos();
    }, [API_URL]);

    async function handleExcluir(id: string) {
        if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/produtos/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                alert('Erro ao excluir produto: ' + errorData.error);
            } else {
                setProdutos(produtos.filter((p) => p.id !== id));
            }
        } catch (error) {
            alert('Erro ao excluir produto!');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <AdminBar />
            <div className="pt-12 max-w-3xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Gerenciar Produtos</h1>
                {msg && <div className="mb-4 text-center text-green-700 bg-green-100 rounded p-2">{msg}</div>}
                {loading ? (
                    <div className="text-center py-12">Carregando produtos...</div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {produtos.length === 0 && <div className="text-center text-gray-500">Nenhum produto cadastrado.</div>}
                        {produtos.map(produto => (
                            <div key={produto.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded shadow p-4 gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    {produto.imagem_principal && (
                                        <img src={produto.imagem_principal} alt={produto.nome} className="w-20 h-20 object-cover rounded border" />
                                    )}
                                    <div>
                                        <div className="font-bold text-lg">{produto.nome}</div>
                                        <div className="text-sm text-gray-500">ID: {produto.id}</div>
                                        <div className="text-sm text-gray-500">Categoria: {produto.categoria}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/editar-produto/${produto.id}`)}
                                        className="px-4 py-2 rounded bg-pampa-leather text-white font-bold hover:bg-pampa-leather-dark"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleExcluir(produto.id)}
                                        className="px-4 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 