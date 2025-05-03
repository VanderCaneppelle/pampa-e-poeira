import { Link } from 'react-router-dom';
import { products } from '../mocks/products';

export default function Colecao() {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Coleção</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {products.map((p) => (
                    <div key={p.id} className="bg-pampa-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center border border-pampa-beige">
                        <img src={p.imagens[0]} alt={p.nome} className="w-full h-48 object-cover" />
                        <div className="p-4 flex-1 flex flex-col justify-between w-full">
                            <h3 className="text-lg font-bold text-pampa-leather mb-2 text-center">{p.nome}</h3>
                            <p className="text-pampa-moss text-center font-semibold mb-4">R$ {p.preco.toFixed(2)}</p>
                            <Link to={`/produto/${p.id}`} className="w-full bg-pampa-leather text-pampa-white py-2 rounded hover:bg-pampa-moss transition text-center block font-bold">Ver Produto</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 