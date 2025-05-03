type BannerProps = {
    titulo: string;
    subtitulo?: string;
    imagem?: string;
};

export default function Banner({ titulo, subtitulo, imagem }: BannerProps) {
    return (
        <div
            className="w-full h-48 flex flex-col justify-center items-center text-center bg-pampa-leather text-pampa-white mb-8"
            style={imagem ? { backgroundImage: `url(${imagem})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
            <h1 className="text-3xl font-bold drop-shadow">{titulo}</h1>
            {subtitulo && <p className="text-lg mt-2 drop-shadow">{subtitulo}</p>}
        </div>
    );
} 