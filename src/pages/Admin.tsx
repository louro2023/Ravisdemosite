import { Rocket, ArrowLeft, Plus, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchNoticias, addNoticia, deleteNoticia, type Noticia } from '../firebaseService';

export default function Admin() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [novaNoticia, setNovaNoticia] = useState({
    categoria: 'Trabalho',
    titulo: '',
    resumo: '',
    imagem: ''
  });

  useEffect(() => {
    loadNoticias();
  }, []);

  const loadNoticias = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchNoticias();
      setNoticias(data);
    } catch (err) {
      setError("Erro ao carregar notícias. Verifique sua conexão.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaNoticia.titulo || !novaNoticia.resumo) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (!selectedFile && !novaNoticia.imagem) {
      setError("Selecione uma imagem ou forneça uma URL");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      let imagemUrl = novaNoticia.imagem;

      // Upload image to server if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Erro ao fazer upload da imagem');
        }

        const uploadData = await uploadResponse.json();
        imagemUrl = uploadData.url;
      }

      // Add news to database
      await addNoticia(
        {
          categoria: novaNoticia.categoria,
          titulo: novaNoticia.titulo,
          resumo: novaNoticia.resumo,
          imagem: imagemUrl,
          data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
        }
      );

      // Reload noticias
      await loadNoticias();
      
      // Reset form
      setIsAdding(false);
      setNovaNoticia({
        categoria: 'Trabalho',
        titulo: '',
        resumo: '',
        imagem: ''
      });
      setImagePreview(null);
      setSelectedFile(null);
    } catch (err) {
      setError("Erro ao adicionar notícia. Tente novamente.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta notícia?")) return;
    
    try {
      setError(null);
      await deleteNoticia(id);
      setNoticias(noticias.filter(n => n.id !== id));
    } catch (err) {
      setError("Erro ao deletar notícia. Tente novamente.");
      console.error(err);
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-red-800">{error}</div>
          </div>
        )}

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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoria *</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Imagem *</label>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full"
                    />
                    <p className="text-xs text-slate-500 mt-2">Ou forneça uma URL:</p>
                    <input 
                      type="url" 
                      value={novaNoticia.imagem}
                      onChange={e => setNovaNoticia({...novaNoticia, imagem: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-sm mt-2"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resumo *</label>
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
                  onClick={() => {
                    setIsAdding(false);
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-blue hover:bg-blue-900 disabled:bg-slate-400 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Salvando...' : 'Salvar Notícia'}
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
                        <img 
                          src={noticia.imagem} 
                          alt="" 
                          className="w-16 h-12 object-cover rounded" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64x48?text=Erro';
                          }}
                        />
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
