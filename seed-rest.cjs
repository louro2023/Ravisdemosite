#!/usr/bin/env node

/**
 * Script alternativo de seed usando REST API do Firebase
 * Não requer credenciais de Admin
 */

const https = require('https');
require('dotenv').config();

const DATABASE_URL = "https://ravis-7620d-default-rtdb.firebaseio.com";

const NOTICIAS = [
  {
    titulo: "Secretaria de Trabalho lança novo programa de qualificação na Baixada",
    resumo: "O novo programa visa capacitar mais de 5 mil jovens para o mercado de tecnologia até o final do ano, com foco em inclusão.",
    categoria: "Trabalho",
    data: "15 de Março, 2026",
    imagem: "/midia/noticia 1.jpg"
  },
  {
    titulo: "Aprovada emenda que destina recursos para hospitais de Nova Iguaçu",
    resumo: "Foram garantidos mais de R$ 2 milhões para a compra de novos equipamentos para a rede municipal de saúde.",
    categoria: "Alerj",
    data: "02 de Março, 2026",
    imagem: "/midia/noticia2.jpg"
  },
  {
    titulo: "Mutirão de serviços atende centenas de famílias no fim de semana",
    resumo: "Ação social promovida pelo mandato levou serviços de saúde, emissão de documentos e lazer para a comunidade.",
    categoria: "Ação Social",
    data: "20 de Fevereiro, 2026",
    imagem: "/midia/noticia 3.jpg"
  }
];

function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const url = `${DATABASE_URL}${path}.json`;
    
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function seedNoticias() {
  try {
    console.log("🔥 Inicializando seed via REST API...");
    console.log("📰 Inserindo 3 notícias...\n");
    
    for (let i = 0; i < NOTICIAS.length; i++) {
      const noticia = NOTICIAS[i];
      const noticia_id = `noticia_${String(i + 1).padStart(3, '0')}`;
      
      await makeRequest(`/noticias/${noticia_id}`, {
        titulo: noticia.titulo,
        resumo: noticia.resumo,
        categoria: noticia.categoria,
        data: noticia.data,
        imagem: noticia.imagem
      });
      
      console.log(`✅ Notícia ${i + 1}/3 inserida: "${noticia.titulo.substring(0, 50)}..."`);
    }
    
    console.log("\n✅ Sucesso! As 3 notícias foram adicionadas ao Firebase!");
    console.log("🌐 Atualize a página para ver as notícias aparecerem.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error.message);
    console.error("\n📋 Alternativa: Use o Firebase Console");
    console.error("   1. Abra: https://console.firebase.google.com");
    console.error("   2. Projeto: ravis-7620d → Realtime Database");
    console.error("   3. Clique em '...' → 'Importar JSON'");
    console.error("   4. Selecione: noticias-seed.json");
    process.exit(1);
  }
}

seedNoticias();
