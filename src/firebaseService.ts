import { database } from './firebase';
import { ref, push, set, get, remove, update } from 'firebase/database';

export interface Noticia {
  id: string;
  categoria: string;
  data: string;
  titulo: string;
  resumo: string;
  imagem: string;
}

// ===== NOTÍCIAS =====

export const fetchNoticias = async (): Promise<Noticia[]> => {
  try {
    const noticiasRef = ref(database, 'noticias');
    const snapshot = await get(noticiasRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert object to array and sort by data (most recent first)
      return Object.entries(data)
        .map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }))
        .sort((a, b) => {
          // Assuming data is in format "DD de Mês, YYYY"
          // Parse and compare dates
          const dateA = new Date(a.data);
          const dateB = new Date(b.data);
          return dateB.getTime() - dateA.getTime();
        });
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    throw error;
  }
};

export const addNoticia = async (noticia: Omit<Noticia, 'id'>): Promise<Noticia> => {
  try {
    // Add to database
    const noticiasRef = ref(database, 'noticias');
    const newNoticia = await push(noticiasRef, {
      ...noticia,
      criado: new Date().toISOString(),
    });

    return {
      id: newNoticia.key!,
      ...noticia,
    };
  } catch (error) {
    console.error('Erro ao adicionar notícia:', error);
    throw error;
  }
};

export const updateNoticia = async (id: string, updates: Partial<Noticia>): Promise<void> => {
  try {
    // Update in database
    const noticiasRef = ref(database, `noticias/${id}`);
    await update(noticiasRef, {
      ...updates,
      atualizado: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error);
    throw error;
  }
};

export const deleteNoticia = async (id: string): Promise<void> => {
  try {
    // Delete from database
    const noticiasRef = ref(database, `noticias/${id}`);
    await remove(noticiasRef);
  } catch (error) {
    console.error('Erro ao deletar notícia:', error);
    throw error;
  }
};
