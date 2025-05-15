import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Banner from '../components/Banner';
import { Link } from 'react-router-dom';

export default function FeaturedProducts() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProdutos() {
            setLoading(true);
            const { data, error } = await supabase
                .from('produtos')
                .select('*')
                .eq('nova_colecao', true)
                .order('id', { ascending: false })
                .limit(4);
            if (!error) setProdutos(data || []);
            setLoading(false);
        }
        fetchProdutos();
    }, []);

    if (loading) return <div>Carregando destaques...</div>;

    return (
        <>
            <Banner titulo="Destaques" subtitulo="Os produtos mais desejados do momento" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
                {produtos.map(produto => (
                    <div key={produto.id} className="border rounded p-4 shadow bg-white">
                        {produto.imagem_principal && (
                            <img src={produto.imagem_principal} alt={produto.nome} className="h-40 w-full object-cover mb-2 rounded" />
                        )}
                        <h2 className="font-bold text-lg">{produto.nome}</h2>
                        <p className="text-gray-600">{produto.descricao}</p>
                        <div className="mt-2 font-semibold text-pampa-leather">
                            R$ {produto.preco}
                        </div>
                        <Link to={`/produto/${produto.id}`} className="w-full bg-pampa-leather text-pampa-white py-2 rounded hover:bg-pampa-moss transition text-center block font-bold mt-2">Ver Produto</Link>
                    </div>
                ))}
            </div>
        </>
    );
} 