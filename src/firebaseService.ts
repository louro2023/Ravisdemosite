import { database, storage } from './firebase';
import { ref, push, set, get, remove, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Noticia {
  id: string;
  categoria: string;
  data: string;
  titulo: string;
  resumo: string;
  imagem: string;
  imagemFile?: string; // Storage path
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

export const addNoticia = async (noticia: Omit<Noticia, 'id'>, imagemFile?: File): Promise<Noticia> => {
  try {
    let imagemUrl = noticia.imagem;

    // Upload image if provided
    if (imagemFile) {
      const timestamp = Date.now();
      const fileName = `noticias/${timestamp}_${imagemFile.name}`;
      const imageStorageRef = storageRef(storage, fileName);
      
      await uploadBytes(imageStorageRef, imagemFile);
      imagemUrl = await getDownloadURL(imageStorageRef);
    }

    // Add to database
    const noticiasRef = ref(database, 'noticias');
    const newNoticia = await push(noticiasRef, {
      ...noticia,
      imagem: imagemUrl,
      criado: new Date().toISOString(),
    });

    return {
      id: newNoticia.key!,
      ...noticia,
      imagem: imagemUrl,
    };
  } catch (error) {
    console.error('Erro ao adicionar notícia:', error);
    throw error;
  }
};

export const updateNoticia = async (id: string, updates: Partial<Noticia>, imagemFile?: File): Promise<void> => {
  try {
    let imagemUrl = updates.imagem;

    // Upload new image if provided
    if (imagemFile) {
      const timestamp = Date.now();
      const fileName = `noticias/${timestamp}_${imagemFile.name}`;
      const imageStorageRef = storageRef(storage, fileName);
      
      await uploadBytes(imageStorageRef, imagemFile);
      imagemUrl = await getDownloadURL(imageStorageRef);
    }

    // Update in database
    const noticiasRef = ref(database, `noticias/${id}`);
    await update(noticiasRef, {
      ...updates,
      ...(imagemUrl && { imagem: imagemUrl }),
      atualizado: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error);
    throw error;
  }
};

export const deleteNoticia = async (id: string, imagemPath?: string): Promise<void> => {
  try {
    // Delete image from storage if path is provided
    if (imagemPath && imagemPath.startsWith('noticias/')) {
      try {
        const imageRef = storageRef(storage, imagemPath);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('Erro ao deletar imagem:', error);
      }
    }

    // Delete from database
    const noticiasRef = ref(database, `noticias/${id}`);
    await remove(noticiasRef);
  } catch (error) {
    console.error('Erro ao deletar notícia:', error);
    throw error;
  }
};
