import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
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
                .eq('lancamento', true)
                .order('created_at', { ascending: false })
                .limit(4);
            if (!error && data) {
                setProdutos(data);
            }
            setLoading(false);
        }
        fetchProdutos();
    }, []);

    return (
        <section className="py-16 bg-white" id="colecao">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-black text-center mb-10">Produtos em Destaque</h2>
                {loading ? (
                    <div className="text-center">Carregando...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {produtos.map((p) => (
                            <Link to={`/produto/${p.id}`} key={p.id} className="bg-pampa-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center border border-pampa-beige hover:shadow-xl transition cursor-pointer">
                                <img src={p.imagem_principal || 'https://via.placeholder.com/400x300?text=Sem+Imagem'} alt={p.nome} className="w-full h-48 object-cover" />
                                <div className="p-4 flex-1 flex flex-col justify-between w-full">
                                    <h3 className="text-lg font-bold text-pampa-leather mb-2 text-center">{p.nome}</h3>
                                    <p className="text-pampa-moss text-center font-semibold mb-4">R$ {Number(p.preco).toFixed(2)}</p>
                                    <button className="w-full bg-pampa-leather text-pampa-white py-2 rounded hover:bg-pampa-moss transition">Comprar</button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
} 