import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { products } from '../mocks/products';

export default function ProductPage() {
    const { id } = useParams();
    const product = products.find(p => p.id === id);
    const [imgIdx, setImgIdx] = useState(0);
    const [tamanho, setTamanho] = useState(product?.tamanhos[0] || '');
    const [cor, setCor] = useState(product?.cores[0] || '');

    if (!product) {
        return <div className="text-center py-20">Produto não encontrado. <Link to="/colecao" className="text-pampa-leather underline">Voltar para a Coleção</Link></div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col md:flex-row gap-10">
            {/* Carrossel de imagens */}
            <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-80 bg-pampa-beige rounded-lg flex items-center justify-center overflow-hidden mb-4">
                    <img src={product.imagens[imgIdx]} alt={product.nome} className="object-contain h-full w-full" />
                </div>
                <div className="flex gap-2 justify-center">
                    {product.imagens.map((img, idx) => (
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
                <p className="text-lg text-pampa-moss mb-2">R$ {product.preco.toFixed(2)}</p>
                <p className="mb-4 text-base text-gray-700">{product.descricao}</p>
                <div className="flex gap-4 mb-4">
                    <div>
                        <label className="block text-sm mb-1">Tamanho</label>
                        <select value={tamanho} onChange={e => setTamanho(e.target.value)} className="border rounded px-2 py-1">
                            {product.tamanhos.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Cor</label>
                        <select value={cor} onChange={e => setCor(e.target.value)} className="border rounded px-2 py-1">
                            {product.cores.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button className="bg-pampa-leather text-pampa-white py-3 rounded font-bold text-lg hover:bg-pampa-moss transition">Adicionar ao Carrinho</button>
            </div>
        </div>
    );
} 