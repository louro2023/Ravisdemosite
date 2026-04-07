import { Rocket, ArrowLeft, Plus, Trash2, Edit, Save, X, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';

interface Noticia {
  id: string;
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
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [novaNoticia, setNovaNoticia] = useState({
    categoria: 'Trabalho',
    titulo: '',
    resumo: '',
    imagem: ''
  });

  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null);

  // Imagens disponíveis na pasta raiz
  const imageFiles = [
    'noticia 1.jpg',
    'noticia2.jpg',
    'noticia 3.jpg',
  ];

  useEffect(() => {
    // Fetch noticias from Firebase
    const noticiasRef = ref(db, 'noticias');
    const unsubscribe = onValue(noticiasRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const noticiasArray = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key]
          }))
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        setNoticias(noticiasArray);
      } else {
        setNoticias([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Erro ao buscar notícias:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaNoticia.titulo || !novaNoticia.resumo || !novaNoticia.imagem) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      const noticiasRef = ref(db, 'noticias');
      await push(noticiasRef, {
        categoria: novaNoticia.categoria,
        titulo: novaNoticia.titulo,
        resumo: novaNoticia.resumo,
        imagem: novaNoticia.imagem,
        data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
      });

      setNovaNoticia({
        categoria: 'Trabalho',
        titulo: '',
        resumo: '',
        imagem: ''
      });
      setIsAdding(false);
    } catch (error) {
      console.error("Erro ao adicionar notícia:", error);
      alert('Erro ao adicionar notícia');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar essa notícia?')) return;

    try {
      const noticiasRef = ref(db, `noticias/${id}`);
      await remove(noticiasRef);
    } catch (error) {
      console.error("Erro ao deletar notícia:", error);
      alert('Erro ao deletar notícia');
    }
  };

  const handleEditStart = (noticia: Noticia) => {
    setEditingId(noticia.id);
    setEditingNoticia(noticia);
  };

  const handleEditSave = async () => {
    if (!editingNoticia || !editingNoticia.titulo || !editingNoticia.resumo) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      const noticiasRef = ref(db, `noticias/${editingNoticia.id}`);
      await update(noticiasRef, {
        categoria: editingNoticia.categoria,
        titulo: editingNoticia.titulo,
        resumo: editingNoticia.resumo,
        imagem: editingNoticia.imagem,
        data: editingNoticia.data
      });
      setEditingId(null);
      setEditingNoticia(null);
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      alert('Erro ao atualizar notícia');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingNoticia(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue/80">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <Rocket className="h-8 w-8 text-brand-red" />
              <span className="font-heading font-bold text-2xl text-white">
                ADMIN
              </span>
            </div>
            <Link to="/" className="flex items-center gap-2 text-white hover:text-brand-orange transition-colors">
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-brand-blue">Gerenciar Notícias</h1>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition-all"
              >
                <Plus className="h-5 w-5" />
                Nova Notícia
              </button>
            )}
          </div>

          {/* Add Form */}
          {isAdding && (
            <div className="mb-12 p-6 bg-slate-50 rounded-xl border-2 border-brand-blue">
              <h2 className="text-2xl font-bold text-brand-blue mb-6">Adicionar Nova Notícia</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
                    <select
                      value={novaNoticia.categoria}
                      onChange={(e) => setNovaNoticia({ ...novaNoticia, categoria: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue"
                    >
                      <option value="Trabalho">Trabalho</option>
                      <option value="Alerj">Alerj</option>
                      <option value="Ação Social">Ação Social</option>
                      <option value="Educação">Educação</option>
                      <option value="Saúde">Saúde</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Imagem</label>
                    <select
                      value={novaNoticia.imagem}
                      onChange={(e) => setNovaNoticia({ ...novaNoticia, imagem: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue"
                    >
                      <option value="">Selecionar imagem...</option>
                      {imageFiles.map((file) => (
                        <option key={file} value={`/${file}`}>
                          {file}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={novaNoticia.titulo}
                    onChange={(e) => setNovaNoticia({ ...novaNoticia, titulo: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue"
                    placeholder="Título da notícia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Resumo</label>
                  <textarea
                    value={novaNoticia.resumo}
                    onChange={(e) => setNovaNoticia({ ...novaNoticia, resumo: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue"
                    placeholder="Resumo da notícia"
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
                  >
                    <Save className="h-5 w-5" />
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex items-center gap-2 bg-slate-400 hover:bg-slate-500 text-white px-6 py-2 rounded-lg font-bold transition-all"
                  >
                    <X className="h-5 w-5" />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">Carregando notícias...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && noticias.length === 0 && !isAdding && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg mb-4">Nenhuma notícia encontrada</p>
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition-all"
              >
                <Plus className="h-5 w-5" />
                Criar primeira notícia
              </button>
            </div>
          )}

          {/* News List */}
          <div className="space-y-6">
            {noticias.map((noticia) => (
              <div key={noticia.id} className="border-2 border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                {editingId === noticia.id && editingNoticia ? (
                  // Edit Mode
                  <div className="p-6 bg-slate-50">
                    <h3 className="text-xl font-bold text-brand-blue mb-4">Editar Notícia</h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
                          <select
                            value={editingNoticia.categoria}
                            onChange={(e) => setEditingNoticia({ ...editingNoticia, categoria: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue"
                          >
                            <option value="Trabalho">Trabalho</option>
                            <option value="Alerj">Alerj</option>
                            <option value="Ação Social">Ação Social</option>
                            <option value="Educação">Educação</option>
                            <option value="Saúde">Saúde</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Imagem</label>
                          <select
                            value={editingNoticia.imagem}
                            onChange={(e) => setEditingNoticia({ ...editingNoticia, imagem: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue"
                          >
                            <option value="">Selecionar imagem...</option>
                            {imageFiles.map((file) => (
                              <option key={file} value={`/${file}`}>
                                {file}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Título</label>
                        <input
                          type="text"
                          value={editingNoticia.titulo}
                          onChange={(e) => setEditingNoticia({ ...editingNoticia, titulo: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Resumo</label>
                        <textarea
                          value={editingNoticia.resumo}
                          onChange={(e) => setEditingNoticia({ ...editingNoticia, resumo: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue"
                          rows={4}
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleEditSave}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
                        >
                          <Save className="h-5 w-5" />
                          Salvar
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="flex items-center gap-2 bg-slate-400 hover:bg-slate-500 text-white px-6 py-2 rounded-lg font-bold transition-all"
                        >
                          <X className="h-5 w-5" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="grid md:grid-cols-3 gap-6 p-6">
                    <div className="md:col-span-1">
                      {noticia.imagem && (
                        <img
                          src={noticia.imagem}
                          alt={noticia.titulo}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="inline-block bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                            {noticia.categoria}
                          </span>
                          <p className="text-slate-500 text-sm flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {noticia.data}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-brand-blue mb-3">{noticia.titulo}</h3>
                      <p className="text-slate-600 mb-6 line-clamp-2">{noticia.resumo}</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditStart(noticia)}
                          className="flex items-center gap-2 bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(noticia.id)}
                          className="flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                          Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

