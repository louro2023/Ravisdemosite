import { Rocket, ArrowRight, MapPin, Calendar, Instagram, Facebook, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Noticia {
  id: number;
  categoria: string;
  data: string;
  titulo: string;
  resumo: string;
  imagem: string;
}

export default function Noticias() {
  const [todasNoticias, setTodasNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await fetch('/api/noticias');
        const data = await response.json();
        setTodasNoticias(data);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Rocket className="h-8 w-8 text-brand-red" />
              <span className="font-heading font-bold text-2xl tracking-tight text-brand-blue">
                FELIPINHO<span className="text-brand-red">RAVIS</span>
              </span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/#sobre" className="text-slate-600 hover:text-brand-blue font-medium transition-colors">Sobre</Link>
              <Link to="/#trajetoria" className="text-slate-600 hover:text-brand-blue font-medium transition-colors">Trajetória</Link>
              <Link to="/noticias" className="text-brand-blue font-bold transition-colors">Notícias</Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <a href="#" className="text-slate-400 hover:text-brand-blue transition-colors p-2">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-brand-blue transition-colors p-2">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
              <a 
                href="https://wa.me/5521970237719" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm hover:shadow-md"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Chama o Ravis!</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-12 bg-brand-blue text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a página inicial
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-black mb-4">
            Todas as <span className="text-brand-orange">Notícias</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Acompanhe de perto todas as ações, projetos e novidades do nosso mandato pelo Rio de Janeiro.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todasNoticias.map((noticia) => (
              <div key={noticia.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col">
                <div className="aspect-video overflow-hidden relative">
                  <img src={noticia.imagem} alt={noticia.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {noticia.categoria}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {noticia.data}
                  </div>
                  <h3 className="font-heading font-bold text-xl text-brand-blue mb-3 group-hover:text-brand-red transition-colors line-clamp-2">
                    {noticia.titulo}
                  </h3>
                  <p className="text-slate-600 line-clamp-3 mb-4 flex-grow">
                    {noticia.resumo}
                  </p>
                  <span className="text-brand-red font-medium flex items-center gap-1 group-hover:gap-2 transition-all mt-auto pt-4 border-t border-slate-50">
                    Ler mais <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination (Visual only for now) */}
          <div className="mt-16 flex justify-center gap-2">
            <button className="w-10 h-10 rounded-full bg-brand-blue text-white font-bold flex items-center justify-center">1</button>
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold flex items-center justify-center transition-colors">2</button>
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold flex items-center justify-center transition-colors">3</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="h-6 w-6 text-brand-red" />
                <span className="font-heading font-bold text-xl tracking-tight text-white">
                  FELIPINHO<span className="text-brand-red">RAVIS</span>
                </span>
              </div>
              <p className="max-w-sm mb-6">
                Trabalho sério e compromisso com a população do Rio de Janeiro, especialmente da nossa Baixada Fluminense.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-slate-800 hover:bg-brand-blue text-white p-3 rounded-full transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-slate-800 hover:bg-brand-blue text-white p-3 rounded-full transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Navegação</h4>
              <ul className="space-y-2">
                <li><Link to="/#sobre" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link to="/#trajetoria" className="hover:text-white transition-colors">Trajetória</Link></li>
                <li><Link to="/noticias" className="hover:text-white transition-colors">Notícias</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contato</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  (21) 97023-7719
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Alerj - Rio de Janeiro, RJ
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} Felipinho Ravis. Todos os direitos reservados.</p>
            <p className="mt-2 md:mt-0">Solidariedade (SD)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
