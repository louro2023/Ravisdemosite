/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rocket, ArrowRight, MapPin, Calendar, Briefcase, ChevronRight, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

interface Noticia {
  id: string;
  categoria: string;
  data: string;
  titulo: string;
  resumo: string;
  imagem: string;
}

export default function App() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    const noticiasRef = ref(db, 'noticias');
    const unsubscribe = onValue(noticiasRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const noticiasArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        // Show only the 3 most recent news on the home page
        setNoticias(noticiasArray.slice(0, 3));
      }
    }, (error) => {
      console.error("Erro ao buscar notícias:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Rocket className="h-8 w-8 text-brand-red" />
              <span className="font-heading font-bold text-2xl tracking-tight text-brand-blue">
                FELIPINHO<span className="text-brand-red">RAVIS</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#sobre" className="text-slate-600 hover:text-brand-blue font-medium transition-colors">Sobre</a>
              <a href="#trajetoria" className="text-slate-600 hover:text-brand-blue font-medium transition-colors">Trajetória</a>
              <Link to="/noticias" className="text-slate-600 hover:text-brand-blue font-medium transition-colors">Notícias</Link>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-blue -skew-y-3 origin-top-left scale-110 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Rocket className="h-4 w-4 text-brand-orange" />
                <span className="text-sm font-medium tracking-wide uppercase">Decolando pelo Rio de Janeiro</span>
              </div>
              <h1 className="font-heading text-5xl lg:text-7xl font-black leading-tight mb-6">
                Trabalho que <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">transforma.</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
                De Nova Iguaçu para todo o estado. Empreendedor, pai de família e dedicado a melhorar a vida do cidadão fluminense.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#sobre" className="inline-flex justify-center items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-red-900/20">
                  Conheça a História
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a href="https://wa.me/5521970237719" target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-sm">
                  <MessageCircle className="h-5 w-5" />
                  Chama o Ravis!
                </a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border-8 border-white/10 shadow-2xl relative">
                <img 
                  src="/midia/foto.jpg" 
                  alt="Felipinho Ravis" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="bg-white text-brand-blue px-4 py-2 rounded-lg font-bold text-xl inline-block mb-2 shadow-lg">
                    Deputado Estadual
                  </div>
                  <div className="text-white font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Baixada Fluminense, RJ
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="/midia/foto2.jpg" alt="Família" className="rounded-2xl shadow-lg w-full h-64 object-cover" referrerPolicy="no-referrer" />
                <img src="/midia/foto3.jpg" alt="Nova Iguaçu" className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-brand-blue text-white p-6 rounded-2xl shadow-xl max-w-xs">
                <p className="font-heading font-bold text-2xl mb-1">"A política é ferramenta de transformação."</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-4xl font-bold text-brand-blue mb-6">Quem é Felipinho Ravis?</h2>
              <div className="prose prose-lg text-slate-600">
                <p>
                  Nascido em 13 de maio de 1988 em Nova Iguaçu, Felipe Rangel Garcia é um empreendedor nato. Casado com Cinthia e pai orgulhoso da Emanuela, da Lara e do Noah.
                </p>
                <p>
                  Aos 22 anos, decidiu abrir sua própria lanchonete. Essa experiência o forjou não apenas como dono do seu próprio negócio, mas como um líder que entende as dores e as necessidades do trabalhador e do empreendedor local.
                </p>
                <p>
                  Enxergando a política como a verdadeira ferramenta de transformação que a população precisava, decidiu agir. Aos 27 anos, candidatou-se pela primeira vez e iniciou uma trajetória meteórica baseada em muito trabalho e resultados.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-brand-red font-bold text-3xl mb-1">3</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Filhos</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-brand-red font-bold text-3xl mb-1">22</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Anos ao empreender</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="trajetoria" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-4xl font-bold text-brand-blue mb-4">Uma Trajetória de Decolagem</h2>
            <p className="text-xl text-slate-600">
              Da Câmara Municipal ao Governo do Estado, um histórico de votações expressivas e muito trabalho pela Baixada Fluminense.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-brand-blue/10 transform md:-translate-x-1/2 rounded-full"></div>

            <div className="space-y-12">
              {/* 2016 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center group">
                <div className="md:w-1/2 md:pr-12 text-left md:text-right mb-4 md:mb-0 pl-12 md:pl-0">
                  <h3 className="font-heading text-2xl font-bold text-brand-blue">Primeiro Mandato</h3>
                  <p className="text-slate-600 mt-2">Eleito vereador em Nova Iguaçu com 3.891 votos. Um dos mais jovens da cidade, com forte atuação legislativa e foco em saúde, educação e infraestrutura.</p>
                </div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-brand-red transform md:-translate-x-1/2 flex items-center justify-center shadow-md group-hover:scale-125 transition-transform">
                  <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 pl-12 md:pl-12">
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 text-brand-blue font-bold">
                    <Calendar className="h-4 w-4 text-brand-red" />
                    2016
                  </div>
                </div>
              </div>

              {/* 2019 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center group">
                <div className="md:w-1/2 md:pr-12 text-left md:text-right mb-4 md:mb-0 pl-12 md:pl-0 md:order-2 text-left">
                  <h3 className="font-heading text-2xl font-bold text-brand-blue">Presidente da Câmara</h3>
                  <p className="text-slate-600 mt-2">Eleito presidente da Câmara Municipal de Nova Iguaçu. O mais jovem a ocupar o cargo, consolidando sua liderança política local.</p>
                </div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-brand-red transform md:-translate-x-1/2 flex items-center justify-center shadow-md group-hover:scale-125 transition-transform md:order-1">
                  <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 pl-12 md:pr-12 md:pl-0 md:text-right md:order-0">
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 text-brand-blue font-bold">
                    <Calendar className="h-4 w-4 text-brand-red" />
                    2019-2020
                  </div>
                </div>
              </div>

              {/* 2020 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center group">
                <div className="md:w-1/2 md:pr-12 text-left md:text-right mb-4 md:mb-0 pl-12 md:pl-0">
                  <h3 className="font-heading text-2xl font-bold text-brand-blue">Reeleição Histórica</h3>
                  <p className="text-slate-600 mt-2">Reeleito vereador com 10.962 votos. Tornou-se o vereador mais votado da história de Nova Iguaçu. Durante a pandemia, criou leis essenciais para educação à distância e apoio a microempreendedores.</p>
                </div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-brand-red transform md:-translate-x-1/2 flex items-center justify-center shadow-md group-hover:scale-125 transition-transform">
                  <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 pl-12 md:pl-12">
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 text-brand-blue font-bold">
                    <Calendar className="h-4 w-4 text-brand-red" />
                    2020
                  </div>
                </div>
              </div>

              {/* 2022 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center group">
                <div className="md:w-1/2 md:pr-12 text-left md:text-right mb-4 md:mb-0 pl-12 md:pl-0 md:order-2 text-left">
                  <h3 className="font-heading text-2xl font-bold text-brand-blue">Deputado Estadual</h3>
                  <p className="text-slate-600 mt-2">Eleito para a Alerj com aproximadamente 47 mil votos. Atuação focada na Baixada Fluminense, fiscalização de serviços públicos e destinação de verbas para saúde, cultura e educação.</p>
                </div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-brand-red transform md:-translate-x-1/2 flex items-center justify-center shadow-md group-hover:scale-125 transition-transform md:order-1">
                  <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 pl-12 md:pr-12 md:pl-0 md:text-right md:order-0">
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 text-brand-blue font-bold">
                    <Calendar className="h-4 w-4 text-brand-red" />
                    2022
                  </div>
                </div>
              </div>

              {/* 2024 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center group">
                <div className="md:w-1/2 md:pr-12 text-left md:text-right mb-4 md:mb-0 pl-12 md:pl-0">
                  <h3 className="font-heading text-2xl font-bold text-brand-blue">Secretário de Estado</h3>
                  <p className="text-slate-600 mt-2">Nomeado Secretário Estadual de Trabalho e Renda. Foco na geração de empregos, qualificação profissional e inclusão de PCDs e trabalhadores mais velhos.</p>
                </div>
                <div className="absolute left-0 md:left-1/2 w-10 h-10 rounded-full bg-brand-red border-4 border-white transform md:-translate-x-1/2 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform z-10">
                  <Rocket className="h-4 w-4 text-white" />
                </div>
                <div className="md:w-1/2 md:pl-12 pl-12 md:pl-12">
                  <div className="inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-full shadow-sm font-bold">
                    <Briefcase className="h-4 w-4" />
                    2024-2025
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="noticias" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-4xl font-bold text-brand-blue mb-4">Últimas Notícias</h2>
              <p className="text-xl text-slate-600">Acompanhe o trabalho e as ações pelo Rio de Janeiro.</p>
            </div>
            <Link to="/noticias" className="hidden md:flex items-center gap-2 text-brand-red font-bold hover:text-red-700 transition-colors">
              Ver todas
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {noticias.length > 0 ? (
              noticias.map((noticia) => (
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
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-600">
                <p className="text-lg">Nenhuma notícia disponível no momento...</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/noticias" className="inline-flex items-center gap-2 text-brand-red font-bold hover:text-red-700 transition-colors border-2 border-brand-red px-6 py-3 rounded-full">
              Ver todas as notícias
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="py-20 bg-brand-blue relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange rounded-full blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <MessageCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
          <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-6">
            Tá com problemas? <br/>
            <span className="text-brand-orange">Chama o Ravis!</span>
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Nosso mandato é participativo. Se o seu bairro precisa de atenção, se falta algum serviço público, entre em contato direto com a nossa equipe.
          </p>
          <a 
            href="https://wa.me/5521970237719" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-full font-bold text-xl transition-all shadow-lg shadow-green-900/30 hover:scale-105"
          >
            <MessageCircle className="h-6 w-6" />
            Enviar mensagem no WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
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
                <li><a href="#sobre" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#trajetoria" className="hover:text-white transition-colors">Trajetória</a></li>
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

