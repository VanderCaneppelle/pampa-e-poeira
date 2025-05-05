import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<any | null>(null);
    const [imgIdx, setImgIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tamanho, setTamanho] = useState('');
    const [cor, setCor] = useState('');

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            const { data, error } = await supabase
                .from('produtos')
                .select('*')
                .eq('id', id)
                .single();
            if (!error) setProduct(data);
            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center py-20">Carregando produto...</div>;
    if (!product) {
        return <div className="text-center py-20">Produto não encontrado. <Link to="/colecao" className="text-pampa-leather underline">Voltar para a Coleção</Link></div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col md:flex-row gap-10">
            {/* Carrossel de imagens */}
            <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-80 bg-pampa-beige rounded-lg flex items-center justify-center overflow-hidden mb-4">
                    {product.imagens && product.imagens.length > 0 && (
                        <img src={product.imagens[imgIdx]} alt={product.nome} className="object-contain h-full w-full" />
                    )}
                </div>
                <div className="flex gap-2 justify-center">
                    {product.imagens && product.imagens.map((img: string, idx: number) => (
                        <button
                            key={img}
                            className={`w-16 h-16 rounded border-2 ${imgIdx === idx ? 'border-pampa-leather' : 'border-pampa-beige'} overflow-hidden`}
                            onClick={() => setImgIdx(idx)}
                        >
                            <img src={img} alt="thumb" className="object-cover w-full h-full" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Detalhes do produto */}
            <div className="flex-1 flex flex-col gap-4">
                <h1 className="text-3xl font-bold mb-2">{product.nome}</h1>
                <p className="text-lg text-pampa-moss mb-2">R$ {Number(product.preco).toFixed(2)}</p>
                <p className="mb-4 text-base text-gray-700">{product.descricao}</p>
                <div className="flex gap-4 mb-4">
                    {product.tamanhos && product.tamanhos.length > 0 && (
                        <div>
                            <label className="block text-sm mb-1">Tamanho</label>
                            <select value={tamanho} onChange={e => setTamanho(e.target.value)} className="border rounded px-2 py-1">
                                {product.tamanhos.map((t: string) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {product.cores && product.cores.length > 0 && (
                        <div>
                            <label className="block text-sm mb-1">Cor</label>
                            <select value={cor} onChange={e => setCor(e.target.value)} className="border rounded px-2 py-1">
                                {product.cores.map((c: string) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <button className="bg-pampa-leather text-pampa-white py-3 rounded font-bold text-lg hover:bg-pampa-moss transition">Adicionar ao Carrinho</button>
            </div>
        </div>
    );
} 