import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AdminBar from '../components/AdminBar';

const categorias = [
    'Calçados',
    'Boinas',
    'Lenços',
    'Camisas',
    'Casacos',
];
const tamanhosPadrao = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'];
const tamanhosCalcadoInfantil = Array.from({ length: 34 - 23 + 1 }, (_, i) => (23 + i).toString());
const tamanhosCalcadoAdulto = Array.from({ length: 43 - 35 + 1 }, (_, i) => (35 + i).toString());
const coresDisponiveis = [
    { nome: 'Azul Marinho', cor: '#1a237e' },
    { nome: 'Verde Musgo', cor: '#556b2f' },
    { nome: 'Preto', cor: '#222' },
    { nome: 'Bege', cor: '#e4d8b4' },
    { nome: 'Marrom', cor: '#795548' },
    { nome: 'Bordô', cor: '#400409' },
    { nome: 'Branco', cor: '#fff' },
];

export default function AdminEditarProduto() {
    const { id } = useParams();
    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        preco: '',
        precoPromocional: '',
        categoria: categorias[0],
        lancamento: false,
        colecaoNova: false,
    });
    const [imagens, setImagens] = useState<string[]>([]);
    const [principal, setPrincipal] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState<string | null>(null);
    const [tamanhos, setTamanhos] = useState<string[]>([]);
    const [cores, setCores] = useState<string[]>([]);
    const [subcategoriaCalcado, setSubcategoriaCalcado] = useState<'Adulto' | 'Infantil' | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProduto() {
            setLoading(true);
            const { data, error } = await supabase.from('produtos').select('*').eq('id', id).single();
            if (!error && data) {
                setForm({
                    nome: data.nome || '',
                    descricao: data.descricao || '',
                    preco: data.preco ? String(data.preco) : '',
                    precoPromocional: data.preco_promocional ? String(data.preco_promocional) : '',
                    categoria: data.categoria || categorias[0],
                    lancamento: !!data.lancamento,
                    colecaoNova: !!data.nova_colecao,
                });
                setImagens(data.imagens || []);
                setPrincipal(data.imagem_principal ? (data.imagens || []).indexOf(data.imagem_principal) : 0);
                setTamanhos(Array.isArray(data.tamanhos) ? data.tamanhos : typeof data.tamanhos === 'string' ? JSON.parse(data.tamanhos) : []);
                setCores(Array.isArray(data.cores) ? data.cores : typeof data.cores === 'string' ? JSON.parse(data.cores) : []);
                if (data.categoria === 'Calçados' && data.tamanhos && data.tamanhos.length > 0) {
                    const isInfantil = data.tamanhos.some((t: string) => Number(t) >= 23 && Number(t) <= 34);
                    setSubcategoriaCalcado(isInfantil ? 'Infantil' : 'Adulto');
                }
            }
            setLoading(false);
        }
        fetchProduto();
    }, [id]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value, type, checked } = e.target as any;
        if (type === 'checkbox') {
            setForm(f => ({ ...f, [name]: checked }));
        } else {
            setForm(f => ({ ...f, [name]: value }));
            if (name === 'categoria') {
                setSubcategoriaCalcado(null);
                setTamanhos([]);
            }
        }
    }

    function handleTamanhoChange(t: string) {
        setTamanhos(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    }

    function handleCorChange(c: string) {
        setCores(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        // Update normal com todos os campos
        const payload = {
            nome: form.nome,
            descricao: form.descricao,
            preco: Number(form.preco),
            preco_promocional: form.precoPromocional ? Number(form.precoPromocional) : null,
            categoria: form.categoria,
            lancamento: form.lancamento,
            nova_colecao: form.colecaoNova,
            tamanhos,
            cores,
            imagem_principal: imagens[principal] || null,
        };

        const { data, error } = await supabase
            .from('produtos')
            .update(payload)
            .eq('id', id)
            .select();

        setLoading(false);
        if (error) {
            setMsg('Erro ao atualizar produto: ' + error.message);
            console.error('Erro ao atualizar produto:', error);
        } else {
            setMsg('Produto atualizado com sucesso!');
            setTimeout(() => navigate('/admin/gerenciar-produtos'), 1200);
        }
    }

    return (
        <div>
            <AdminBar />
            <div className="pt-12 max-w-xl mx-auto py-12 px-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Editar Produto</h1>
                {msg && <div className={`mb-4 text-center ${msg.includes('sucesso') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded p-2`}>{msg}</div>}
                {loading ? (
                    <div className="text-center py-12">Carregando...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block mb-1 font-semibold">Nome *</label>
                            <input required name="nome" value={form.nome} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Descrição</label>
                            <textarea name="descricao" value={form.descricao} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block mb-1 font-semibold">Preço *</label>
                                <input required name="preco" type="number" min="0" step="0.01" value={form.preco} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-1 font-semibold">Preço Promocional</label>
                                <input name="precoPromocional" type="number" min="0" step="0.01" value={form.precoPromocional} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block mb-1 font-semibold">Categoria</label>
                                <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full border rounded px-3 py-2">
                                    {categorias.map(cat => <option key={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col justify-end gap-2">
                                <label className="inline-flex items-center gap-2">
                                    <input type="checkbox" name="lancamento" checked={form.lancamento} onChange={handleChange} />
                                    É lançamento
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input type="checkbox" name="colecaoNova" checked={form.colecaoNova} onChange={handleChange} />
                                    É coleção nova
                                </label>
                            </div>
                        </div>
                        {/* Subcategoria para calçados */}
                        {form.categoria === 'Calçados' && (
                            <div className="mt-4">
                                <label className="block mb-1 font-semibold">Subcategoria</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="subcategoria-calcado"
                                            value="Adulto"
                                            checked={subcategoriaCalcado === 'Adulto'}
                                            onChange={() => {
                                                setSubcategoriaCalcado('Adulto');
                                                setTamanhos([]);
                                            }}
                                        />
                                        Adulto
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="subcategoria-calcado"
                                            value="Infantil"
                                            checked={subcategoriaCalcado === 'Infantil'}
                                            onChange={() => {
                                                setSubcategoriaCalcado('Infantil');
                                                setTamanhos([]);
                                            }}
                                        />
                                        Infantil
                                    </label>
                                </div>
                            </div>
                        )}
                        {/* Seleção de tamanhos */}
                        <div className="mt-4">
                            <label className="block mb-1 font-semibold">Tamanhos disponíveis</label>
                            <div className="flex flex-wrap gap-2">
                                {form.categoria === 'Calçados' && subcategoriaCalcado === 'Infantil' && tamanhosCalcadoInfantil.map(t => (
                                    <label key={t} className={`px-3 py-1 rounded border cursor-pointer ${tamanhos.includes(t) ? 'bg-pampa-leather text-white border-pampa-leather' : 'bg-white border-gray-300'}`}>
                                        <input type="checkbox" className="hidden" checked={tamanhos.includes(t)} onChange={() => handleTamanhoChange(t)} />
                                        {t}
                                    </label>
                                ))}
                                {form.categoria === 'Calçados' && subcategoriaCalcado === 'Adulto' && tamanhosCalcadoAdulto.map(t => (
                                    <label key={t} className={`px-3 py-1 rounded border cursor-pointer ${tamanhos.includes(t) ? 'bg-pampa-leather text-white border-pampa-leather' : 'bg-white border-gray-300'}`}>
                                        <input type="checkbox" className="hidden" checked={tamanhos.includes(t)} onChange={() => handleTamanhoChange(t)} />
                                        {t}
                                    </label>
                                ))}
                                {form.categoria !== 'Calçados' && tamanhosPadrao.map(t => (
                                    <label key={t} className={`px-3 py-1 rounded border cursor-pointer ${tamanhos.includes(t) ? 'bg-pampa-leather text-white border-pampa-leather' : 'bg-white border-gray-300'}`}>
                                        <input type="checkbox" className="hidden" checked={tamanhos.includes(t)} onChange={() => handleTamanhoChange(t)} />
                                        {t}
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* Seleção de cores */}
                        <div className="mt-4">
                            <label className="block mb-1 font-semibold">Cores disponíveis</label>
                            <div className="flex flex-wrap gap-2">
                                {coresDisponiveis.map(c => (
                                    <label key={c.nome} className={`flex items-center gap-2 px-3 py-1 rounded border cursor-pointer ${cores.includes(c.nome) ? 'ring-2 ring-pampa-leather border-pampa-leather' : 'bg-white border-gray-300'}`}>
                                        <input type="checkbox" className="hidden" checked={cores.includes(c.nome)} onChange={() => handleCorChange(c.nome)} />
                                        <span className="w-5 h-5 rounded-full border" style={{ background: c.cor, borderColor: '#888' }}></span>
                                        {c.nome}
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* Imagens (apenas visualização) */}
                        <div className="mt-4">
                            <label className="block mb-1 font-semibold">Imagens</label>
                            <div className="flex gap-2 flex-wrap">
                                {imagens.map((img, idx) => (
                                    <div key={img} className={`relative border-2 rounded ${principal === idx ? 'border-pampa-leather' : 'border-transparent'}`}>
                                        <img src={img} alt="img" className="w-24 h-24 object-cover rounded" />
                                        <button type="button" className="absolute top-1 right-1 bg-white rounded-full px-2 py-1 text-xs border" onClick={() => setPrincipal(idx)}>
                                            {principal === idx ? 'Principal' : 'Tornar principal'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="bg-pampa-leather text-white py-2 px-4 rounded hover:bg-pampa-leather-dark disabled:opacity-50">
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
} 