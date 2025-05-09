import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../contexts/CartContext';

// Exemplo de tamanhos e cores disponíveis (ajuste conforme sua lógica)
const tamanhosPadrao = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'];
const coresPossiveis = [
    { nome: 'Azul Marinho', cor: '#1a237e' },
    { nome: 'Verde Musgo', cor: '#556b2f' },
    { nome: 'Preto', cor: '#222' },
    { nome: 'Bege', cor: '#e4d8b4' },
    { nome: 'Marrom', cor: '#795548' },
    { nome: 'Bordô', cor: '#400409' },
    { nome: 'Branco', cor: '#fff' },
];
console.log('tamanhosPadrao:', tamanhosPadrao);

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any | null>(null);
    const [imgIdx, setImgIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(null);
    const [corSelecionada, setCorSelecionada] = useState<string | null>(null);
    const [quantidade, setQuantidade] = useState(1);
    const [error, setError] = useState<string | null>(null);

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

    async function handleAddToCart() {
        if (!tamanhoSelecionado) {
            setError('Por favor, selecione um tamanho');
            return;
        }
        if (!corSelecionada) {
            setError('Por favor, selecione uma cor');
            return;
        }

        try {
            await addToCart(product, quantidade, tamanhoSelecionado, corSelecionada);
            navigate('/carrinho');
        } catch (err) {
            setError('Erro ao adicionar ao carrinho. Por favor, tente novamente.');
        }
    }

    if (loading) return <div className="text-center py-20">Carregando produto...</div>;
    if (!product) {
        return <div className="text-center py-20">Produto não encontrado. <Link to="/colecao" className="text-pampa-leather underline">Voltar para a Coleção</Link></div>;
    }
    console.log('categoria:', product.categoria);


    // Garantir que tamanhosDisponiveis é sempre um array
    const tamanhosDisponiveis = Array.isArray(product.tamanhos)
        ? product.tamanhos
        : typeof product.tamanhos === 'string'
            ? JSON.parse(product.tamanhos)
            : [];
    console.log('tamanhosDisponiveis:', tamanhosDisponiveis);

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
                        {tamanhosDisponiveis.length > 0 ? (
                            (product.categoria === 'Calçado' || product.categoria === 'Calçados') ? (
                                tamanhosDisponiveis.map((t: string) => (
                                    <button
                                        key={t}
                                        onClick={() => setTamanhoSelecionado(t)}
                                        className={`px-4 py-2 rounded border ${tamanhoSelecionado === t ? 'bg-pampa-leather text-white border-pampa-leather' : 'bg-white border-gray-300'}`}
                                    >
                                        {t}
                                    </button>
                                ))
                            ) : (
                                tamanhosPadrao.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => tamanhosDisponiveis.includes(t) && setTamanhoSelecionado(t)}
                                        disabled={!tamanhosDisponiveis.includes(t)}
                                        className={`px-4 py-2 rounded border ${tamanhoSelecionado === t ? 'bg-pampa-leather text-white border-pampa-leather' : 'bg-white border-gray-300'} ${!tamanhosDisponiveis.includes(t) ? 'line-through opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {t}
                                    </button>
                                ))
                            )
                        ) : (
                            <span className="text-gray-400">Nenhum tamanho disponível</span>
                        )}
                    </div>
                </div>

                {/* Seleção de Cor */}
                <div className="mb-4">
                    <span className="font-semibold">Cor:</span>
                    <div className="flex gap-2 mt-2">
                        {coresPossiveis.map((c) => {
                            const disponivel = Array.isArray(product.cores)
                                ? product.cores.includes(c.nome)
                                : typeof product.cores === 'string'
                                    ? JSON.parse(product.cores).includes(c.nome)
                                    : false;
                            return (
                                <div key={c.nome} className="relative w-8 h-8">
                                    <button
                                        onClick={() => disponivel && setCorSelecionada(c.nome)}
                                        disabled={!disponivel}
                                        className={`w-8 h-8 rounded-full border-2 transition-all
                                            ${corSelecionada === c.nome && disponivel ? 'ring-2 ring-pampa-leather border-pampa-leather' : 'border-gray-300'}
                                            ${!disponivel ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        style={{ background: c.cor }}
                                        title={c.nome}
                                    />
                                    {/* X vermelho para riscar cor indisponível, fora do botão para não herdar opacidade */}
                                    {!disponivel && (
                                        <>
                                            <span
                                                className="pointer-events-none absolute left-1.5 right-1.5 top-1/2 border-t-4 border-red-800 rotate-45 z-10"
                                                style={{ borderColor: '#dc2626' }}
                                            />
                                            <span
                                                className="pointer-events-none absolute left-1.5 right-1.5 top-1/2 border-t-4 border-red-800 -rotate-45 z-10"
                                                style={{ borderColor: '#dc2626' }}
                                            />
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quantidade */}
                <div className="mb-4">
                    <span className="font-semibold">Quantidade:</span>
                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={() => setQuantidade(q => Math.max(1, q - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            -
                        </button>
                        <span className="text-lg">{quantidade}</span>
                        <button
                            onClick={() => setQuantidade(q => q + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="text-red-600 text-sm mb-4">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleAddToCart}
                    className="bg-pampa-leather text-pampa-white py-3 rounded font-bold text-lg hover:bg-pampa-moss transition"
                >
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    );
} 