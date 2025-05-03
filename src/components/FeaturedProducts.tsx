const produtos = [
    {
        nome: 'Camisa Campeira',
        preco: 'R$ 189,90',
        imagem: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    },
    {
        nome: 'Bota de Couro',
        preco: 'R$ 349,90',
        imagem: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    },
    {
        nome: 'Chapéu de Palha',
        preco: 'R$ 99,90',
        imagem: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
    },
    {
        nome: 'Lenço Tradicional',
        preco: 'R$ 49,90',
        imagem: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    },
];

export default function FeaturedProducts() {
    return (
        <section className="py-16 bg-white" id="colecao">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-black text-center mb-10">Produtos em Destaque</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {produtos.map((p) => (
                        <div key={p.nome} className="bg-pampa-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center border border-pampa-beige">
                            <img src={p.imagem} alt={p.nome} className="w-full h-48 object-cover" />
                            <div className="p-4 flex-1 flex flex-col justify-between w-full">
                                <h3 className="text-lg font-bold text-pampa-leather mb-2 text-center">{p.nome}</h3>
                                <p className="text-pampa-moss text-center font-semibold mb-4">{p.preco}</p>
                                <button className="w-full bg-pampa-leather text-pampa-white py-2 rounded hover:bg-pampa-moss transition">Comprar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 