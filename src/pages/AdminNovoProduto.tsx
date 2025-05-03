import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const categorias = [
    'Calçados',
    'Boinas',
    'Lenços',
    'Camisas',
    'Casacos',
];

function gerarIdProduto(numero: number) {
    return `PP${100 + numero}`;
}

export default function AdminNovoProduto() {
    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        preco: '',
        precoPromocional: '',
        categoria: categorias[0],
        lancamento: false,
        colecaoNova: false,
    });
    const [idProduto, setIdProduto] = useState(gerarIdProduto(Date.now() % 1000));
    const [imagens, setImagens] = useState<File[]>([]);
    const [preview, setPreview] = useState<string[]>([]);
    const [principal, setPrincipal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value, type, checked, files } = e.target as any;
        if (type === 'checkbox') {
            setForm(f => ({ ...f, [name]: checked }));
        } else if (type === 'file') {
            if (name === 'imagens' && files) {
                const filesArr = Array.from(files).slice(0, 5);
                setImagens(filesArr);
                setPreview(filesArr.map(file => URL.createObjectURL(file)));
                setPrincipal(0);
            }
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMsg(null);
        let urls: string[] = [];
        // Upload das imagens para o Supabase Storage
        for (let i = 0; i < imagens.length; i++) {
            const file = imagens[i];
            const { data, error } = await supabase.storage
                .from('produtos')
                .upload(`${idProduto}/${file.name}`, file, { upsert: true });
            if (error) {
                setMsg('Erro ao fazer upload da imagem: ' + error.message);
                setLoading(false);
                return;
            }
            const url = supabase.storage.from('produtos').getPublicUrl(`${idProduto}/${file.name}`).data.publicUrl;
            urls.push(url);
        }
        // Salva no banco: array de imagens e url da principal
        const { data, error } = await supabase.from('produtos').insert([
            {
                id: idProduto,
                nome: form.nome,
                descricao: form.descricao,
                preco: Number(form.preco),
                preco_promocional: form.precoPromocional ? Number(form.precoPromocional) : null,
                categoria: form.categoria,
                lancamento: form.lancamento,
                nova_colecao: form.colecaoNova,
                imagens: urls,
                imagem_principal: urls[principal] || null,
            },
        ]);
        setLoading(false);
        if (error) {
            setMsg('Erro ao cadastrar produto: ' + error.message);
        } else {
            setMsg('Produto cadastrado com sucesso!');
            setForm({
                nome: '', descricao: '', preco: '', precoPromocional: '', categoria: categorias[0], lancamento: false, colecaoNova: false,
            });
            setImagens([]);
            setPreview([]);
            setPrincipal(0);
            setIdProduto(gerarIdProduto(Date.now() % 1000));
        }
    }

    return (
        <div className="max-w-xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Cadastrar Novo Produto</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1 font-semibold">ID do Produto</label>
                    <input type="text" value={idProduto} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>
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
                <div>
                    <label className="block mb-1 font-semibold">Imagens (até 5)</label>
                    <input type="file" accept="image/*" name="imagens" multiple onChange={handleChange} />
                    <div className="flex gap-2 mt-2">
                        {preview.map((src, idx) => (
                            <div key={idx} className="relative">
                                <img src={src} alt={`Preview ${idx + 1}`} className={`h-24 rounded shadow border-2 ${principal === idx ? 'border-green-600' : 'border-gray-300'}`} />
                                <button type="button" onClick={() => setPrincipal(idx)} className="absolute top-1 right-1 bg-white rounded px-1 text-xs border">{principal === idx ? 'Principal' : 'Tornar principal'}</button>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit" className="bg-pampa-leather text-pampa-white py-3 rounded font-bold text-lg hover:bg-pampa-moss transition mt-4" disabled={loading}>{loading ? 'Salvando...' : 'Cadastrar Produto'}</button>
                {msg && <div className={`text-center mt-2 ${msg.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>{msg}</div>}
            </form>
        </div>
    );
} 