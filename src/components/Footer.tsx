export default function Footer() {
    return (
        <footer className="bg-white text-black py-10 mt-10 border-t border-pampa-beige">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-2">Poeira & Pampa</h3>
                    <p className="text-sm">Moda campeira com elegância e tradição. Feito para quem ama o campo e o universo do rodeio.</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">Newsletter</h3>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input type="email" placeholder="Seu e-mail" className="px-3 py-2 rounded text-black border border-pampa-beige flex-1" />
                        <button className="bg-pampa-leather text-pampa-white px-4 py-2 rounded hover:bg-pampa-moss transition">Inscrever</button>
                    </form>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">Redes Sociais</h3>
                    <div className="flex gap-4 mt-2">
                        <a href="#" className="hover:text-pampa-leather transition">Instagram</a>
                        <a href="#" className="hover:text-pampa-leather transition">Facebook</a>
                    </div>
                    <p className="text-xs mt-4">Rua do Campo, 123 - Centro<br />contato@poeiraepampa.com.br</p>
                </div>
            </div>
            <div className="text-center text-xs text-pampa-black mt-8 opacity-70">
                &copy; {new Date().getFullYear()} Poeira & Pampa. Todos os direitos reservados.
            </div>
        </footer>
    );
} 