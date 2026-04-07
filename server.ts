import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// Initialize Firebase Admin
const serviceAccount = {
  projectId: "ravis-7620d",
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

let db: ReturnType<typeof getDatabase>;

try {
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    initializeApp({
      credential: cert(serviceAccount as any),
      databaseURL: "https://ravis-7620d-default-rtdb.firebaseio.com",
    });
    db = getDatabase();
  }
} catch (e) {
  console.log("Firebase Admin not configured - seed endpoint won't be available");
}

const NOTICIAS_SEED = [
  {
    id: "noticia_001",
    titulo: "Secretaria de Trabalho lança novo programa de qualificação na Baixada",
    resumo: "O novo programa visa capacitar mais de 5 mil jovens para o mercado de tecnologia até o final do ano, com foco em inclusão.",
    categoria: "Trabalho",
    data: "15 de Março, 2026",
    imagem: "/midia/noticia 1.jpg"
  },
  {
    id: "noticia_002",
    titulo: "Aprovada emenda que destina recursos para hospitais de Nova Iguaçu",
    resumo: "Foram garantidos mais de R$ 2 milhões para a compra de novos equipamentos para a rede municipal de saúde.",
    categoria: "Alerj",
    data: "02 de Março, 2026",
    imagem: "/midia/noticia2.jpg"
  },
  {
    id: "noticia_003",
    titulo: "Mutirão de serviços atende centenas de famílias no fim de semana",
    resumo: "Ação social promovida pelo mandato levou serviços de saúde, emissão de documentos e lazer para a comunidade.",
    categoria: "Ação Social",
    data: "20 de Fevereiro, 2026",
    imagem: "/midia/noticia 3.jpg"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Seed endpoint - populate database with initial news
  app.post("/api/seed-noticias", async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: "Firebase not configured" });
      }

      const noticiasRef = db.ref("noticias");
      
      // Add each news item
      for (const noticia of NOTICIAS_SEED) {
        await noticiasRef.child(noticia.id).set({
          titulo: noticia.titulo,
          resumo: noticia.resumo,
          categoria: noticia.categoria,
          data: noticia.data,
          imagem: noticia.imagem
        });
      }

      res.json({ success: true, message: "Notícias adicionadas com sucesso!", count: NOTICIAS_SEED.length });
    } catch (error: any) {
      console.error("Seed error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
  }

  // Serve static files (images, etc)
  app.use(express.static(path.join(process.cwd())));

  // Fallback to index.html for SPA (production only)
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), 'dist');
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (db) {
      console.log(`📰 Execute POST http://localhost:${PORT}/api/seed-noticias para popular o banco com as 3 notícias`);
    }
  });
}

startServer();
