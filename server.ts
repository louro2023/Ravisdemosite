import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

// In-memory storage for news (since Firebase was declined)
// In a real app without a database, this would reset on every server restart.
// We'll try to persist it to a local JSON file for this demo.
const DATA_FILE = path.join(process.cwd(), "data.json");

let noticias = [
  {
    id: 1,
    categoria: "Trabalho",
    data: "15 de Março, 2026",
    titulo: "Secretaria de Trabalho lança novo programa de qualificação na Baixada",
    resumo: "O novo programa visa capacitar mais de 5 mil jovens para o mercado de tecnologia até o final do ano, com foco em inclusão.",
    imagem: "/midia/noticia%201.jpg"
  },
  {
    id: 2,
    categoria: "Alerj",
    data: "02 de Março, 2026",
    titulo: "Aprovada emenda que destina recursos para hospitais de Nova Iguaçu",
    resumo: "Foram garantidos mais de R$ 2 milhões para a compra de novos equipamentos para a rede municipal de saúde.",
    imagem: "/midia/noticia2.jpg"
  },
  {
    id: 3,
    categoria: "Ação Social",
    data: "20 de Fevereiro, 2026",
    titulo: "Mutirão de serviços atende centenas de famílias no fim de semana",
    resumo: "Ação social promovida pelo mandato levou serviços de saúde, emissão de documentos e lazer para a comunidade.",
    imagem: "/midia/noticia%203.jpg"
  }
];

// Try to load existing data
if (fs.existsSync(DATA_FILE)) {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    noticias = JSON.parse(data);
  } catch (e) {
    console.error("Error reading data file", e);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(noticias, null, 2));
  } catch (e) {
    console.error("Error saving data file", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/noticias", (req, res) => {
    res.json(noticias);
  });

  app.post("/api/noticias", (req, res) => {
    const newNoticia = {
      id: Date.now(),
      ...req.body,
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    };
    noticias.unshift(newNoticia); // Add to beginning
    saveData();
    res.status(201).json(newNoticia);
  });

  app.delete("/api/noticias/:id", (req, res) => {
    const id = parseInt(req.params.id);
    noticias = noticias.filter(n => n.id !== id);
    saveData();
    res.status(204).send();
  });

  // Serve static files from midia folder
  app.use('/midia', express.static(path.join(process.cwd(), 'midia')));

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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
