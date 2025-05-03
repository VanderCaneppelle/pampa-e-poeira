import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Banner from '../components/Banner';

export default function Loja() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProdutos() {
            setLoading(true);
            const { data, error } = await supabase
                .from('produtos')
                .select('*')
                .or('nova_colecao.is.false,nova_colecao.is.null')
                .order('id', { ascending: false });
            if (!error) setProdutos(data || []);
            setLoading(false);
        }
        fetchProdutos();
    }, []);

    if (loading) return <div>Carregando produtos...</div>;

    return (
        <>
            <Banner titulo="Loja" subtitulo="Todos os produtos disponíveis para você" />
            <div className="max-w-6xl mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Todos os Produtos</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {produtos.map((p) => (
                        <div key={p.id} className="bg-pampa-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center border border-pampa-beige">
                            <img src={p.imagem_principal} alt={p.nome} className="w-full h-48 object-cover" />
                            <div className="p-4 flex-1 flex flex-col justify-between w-full">
                                <h3 className="text-lg font-bold text-pampa-leather mb-2 text-center">{p.nome}</h3>
                                <p className="text-pampa-moss text-center font-semibold mb-4">R$ {p.preco.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
} 