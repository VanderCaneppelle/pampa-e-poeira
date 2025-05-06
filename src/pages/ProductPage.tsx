import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Exemplo de tamanhos e cores disponíveis (ajuste conforme sua lógica)
const tamanhosPossiveis = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'];
const coresPossiveis = [
    { nome: 'Azul Marinho', cor: '#1a237e' },
    { nome: 'Verde Musgo', cor: '#556b2f' },
    { nome: 'Preto', cor: '#222' },
    { nome: 'Bege', cor: '#e4d8b4' },
    { nome: 'Marrom', cor: '#795548' },
    { nome: 'Vermelho', cor: '#b71c1c' },
    { nome: 'Branco', cor: '#fff' },
];

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<any | null>(null);
    const [imgIdx, setImgIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null);
    const [corSelecionada, setCorSelecionada] = useState<string | null>(null);

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

    // Garantir arrays para evitar erro caso undefined
    const tamanhosDisponiveis = Array.isArray(product.tamanhos) ? product.tamanhos : [];
    const coresDisponiveis = Array.isArray(product.cores) ? product.cores : [];

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

                {/* Seleção de Tamanho */}
                <div className="mb-4">
                    <span className="font-semibold">Tamanho:</span>
                    <div className="flex gap-2 mt-2">
                        {tamanhosPossiveis.map((t) => {
                            const disponivel = tamanhosDisponiveis.includes(t);
                            return (
                                <button
                                    key={t}
                                    onClick={() => disponivel && setTamanhoSelecionado(t)}
                                    disabled={!disponivel}
                                    className={`px-4 py-2 rounded border transition-all
                                        ${tamanhoSelecionado === t && disponivel ? 'bg-pampa-leather text-white border-pampa-leather' : 'bg-white border-gray-300'}
                                        ${!disponivel ? 'line-through opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Seleção de Cor */}
                <div className="mb-4">
                    <span className="font-semibold">Cor:</span>
                    <div className="flex gap-2 mt-2">
                        {coresPossiveis.map((c) => {
                            const disponivel = coresDisponiveis.includes(c.nome);
                            return (
                                <button
                                    key={c.nome}
                                    onClick={() => disponivel && setCorSelecionada(c.nome)}
                                    disabled={!disponivel}
                                    className={`w-8 h-8 rounded-full border-2 transition-all
                                        ${corSelecionada === c.nome && disponivel ? 'ring-2 ring-pampa-leather border-pampa-leather' : 'border-gray-300'}
                                        ${!disponivel ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                                    style={{ background: c.cor }}
                                    title={c.nome}
                                />
                            );
                        })}
                    </div>
                </div>

                <button className="bg-pampa-leather text-pampa-white py-3 rounded font-bold text-lg hover:bg-pampa-moss transition">Adicionar ao Carrinho</button>
            </div>
        </div>
    );
} 