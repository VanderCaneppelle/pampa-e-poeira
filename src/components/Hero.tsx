export default function Hero() {
    return (
        <section className="relative h-[40vh] flex items-center justify-center bg-white">
            <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                alt="Cavalo no campo"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
            />
            <div className="relative z-10 text-center text-black">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    PAMPA & POEIRA
                </h1>
                <p className="text-xl md:text-2xl mb-8 drop-shadow">
                    Conheça nossa nova coleção campeira
                </p>
                <a href="#colecao" className="inline-block bg-pampa-leather px-8 py-3 rounded text-lg font-bold shadow hover:bg-pampa-beige hover:text-pampa-black transition">
                    Ver Coleção
                </a>
            </div>
            <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        </section>
    );
} 