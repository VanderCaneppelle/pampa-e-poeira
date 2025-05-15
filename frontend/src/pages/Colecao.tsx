import { useEffect, useState } from 'react';
//import { supabase } from '../lib/supabaseClient';
import Banner from '../components/Banner';
import { Link } from 'react-router-dom';

export default function Colecao() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNovaColecao() {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/nova-colecao`);
                const data = await response.json();
                setProdutos(Array.isArray(data) ? data : []);
            } catch (error) {
                setProdutos([]);
                alert('Erro ao buscar nova coleção!');
            } finally {
                setLoading(false);
            }
        }
        fetchNovaColecao();
    }, []);

    if (loading) return <div>Carregando produtos...</div>;

    return (
        <>
            <Banner titulo="Coleção Nova" subtitulo="Confira os lançamentos exclusivos da Pampa & Poeira" />
            <div className="max-w-6xl mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Coleção</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {produtos.map((p) => (
                        <div key={p.id} className="bg-pampa-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center border border-pampa-beige">
                            <img src={p.imagem_principal} alt={p.nome} className="w-full h-48 object-cover" />
                            <div className="p-4 flex-1 flex flex-col justify-between w-full">
                                <h3 className="text-lg font-bold text-pampa-leather mb-2 text-center">{p.nome}</h3>
                                <p className="text-pampa-moss text-center font-semibold mb-4">R$ {p.preco.toFixed(2)}</p>
                                <Link to={`/produto/${p.id}`} className="w-full bg-pampa-leather text-pampa-white py-2 rounded hover:bg-pampa-moss transition text-center block font-bold mt-2">Ver Produto</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
} 