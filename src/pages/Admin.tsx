import { Rocket, ArrowLeft, Plus, Trash2, Edit, Save, X } from 'lucide-react';
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

export default function Admin() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [novaNoticia, setNovaNoticia] = useState({
    categoria: 'Trabalho',
    titulo: '',
    resumo: '',
    imagem: 'https://picsum.photos/seed/nova/600/400'
  });

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const response = await fetch('/api/noticias');
      const data = await response.json();
      setNoticias(data);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/noticias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaNoticia),
      });
      
      if (response.ok) {
        const addedNoticia = await response.json();
        setNoticias([addedNoticia, ...noticias]);
        setIsAdding(false);
        setNovaNoticia({
          categoria: 'Trabalho',
          titulo: '',
          resumo: '',
          imagem: `https://picsum.photos/seed/${Math.random()}/600/400`
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar notícia:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta notícia?")) return;
    
    try {
      const response = await fetch(`/api/noticias/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNoticias(noticias.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error("Erro ao deletar notícia:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Admin Header */}
      <nav className="bg-brand-blue text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-brand-orange" />
              <span className="font-heading font-bold text-xl tracking-tight">
                Painel Administrativo
              </span>
            </div>
            <Link to="/" className="text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Site
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-brand-blue">Gerenciar Notícias</h1>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-brand-red hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5" />
              Nova Notícia
            </button>
          )}
        </div>

        {/* Add Form */}
        {isAdding && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-bold text-brand-blue">Adicionar Nova Notícia</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                  <input 
                    type="text" 
                    required
                    value={novaNoticia.titulo}
                    onChange={e => setNovaNoticia({...novaNoticia, titulo: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                    placeholder="Ex: Novo projeto aprovado..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                  <select 
                    value={novaNoticia.categoria}
                    onChange={e => setNovaNoticia({...novaNoticia, categoria: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                  >
                    <option value="Trabalho">Trabalho</option>
                    <option value="Alerj">Alerj</option>
                    <option value="Ação Social">Ação Social</option>
                    <option value="Educação">Educação</option>
                    <option value="Infraestrutura">Infraestrutura</option>
                    <option value="Esporte">Esporte</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem</label>
                <input 
                  type="url" 
                  required
                  value={novaNoticia.imagem}
                  onChange={e => setNovaNoticia({...novaNoticia, imagem: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resumo</label>
                <textarea 
                  required
                  rows={3}
                  value={novaNoticia.resumo}
                  onChange={e => setNovaNoticia({...novaNoticia, resumo: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all resize-none"
                  placeholder="Breve descrição da notícia..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-brand-blue hover:bg-blue-900 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  Salvar Notícia
                </button>
              </div>
            </form>
          </div>
        )}

        {/* News List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Carregando notícias...</div>
          ) : noticias.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Nenhuma notícia cadastrada.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">Imagem</th>
                    <th className="p-4 font-medium">Título</th>
                    <th className="p-4 font-medium">Categoria</th>
                    <th className="p-4 font-medium">Data</th>
                    <th className="p-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {noticias.map((noticia) => (
                    <tr key={noticia.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <img src={noticia.imagem} alt="" className="w-16 h-12 object-cover rounded" referrerPolicy="no-referrer" />
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-900 line-clamp-1">{noticia.titulo}</div>
                        <div className="text-sm text-slate-500 line-clamp-1">{noticia.resumo}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {noticia.categoria}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-500 whitespace-nowrap">
                        {noticia.data}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => handleDelete(noticia.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
