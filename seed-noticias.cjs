#!/usr/bin/env node

/**
 * Script para fazer seed (popular) o Firebase com as 3 notícias
 * 
 * Como usar:
 * npm run seed
 */

const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

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

async function seedNoticias() {
  try {
    console.log("🔥 Inicializando Firebase Admin...");
    
    let credential;
    if (serviceAccountPath) {
      const serviceAccount = require(path.resolve(serviceAccountPath));
      credential = admin.credential.cert(serviceAccount);
    } else {
      // Usar credenciais do ambiente
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "ravis-7620d",
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      });
    }
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: credential,
        databaseURL: "https://ravis-7620d-default-rtdb.firebaseio.com"
      });
    }
    
    const db = admin.database();
    
    console.log("📰 Inserindo 3 notícias...\n");
    
    for (let i = 0; i < NOTICIAS.length; i++) {
      const noticia = NOTICIAS[i];
      const noticia_id = `noticia_${String(i + 1).padStart(3, '0')}`;
      
      await db.ref(`noticias/${noticia_id}`).set({
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
    console.error("❌ Erro ao fazer seed:", error.message || error);
    console.error("\n📋 Se recebeu erro de credenciais, tente um desses métodos:");
    console.error("   1. Coloque arquivo JSON em: ./firebase-service-account.json");
    console.error("   2. Defina variáveis de ambiente:");
    console.error("      - FIREBASE_PROJECT_ID");
    console.error("      - FIREBASE_PRIVATE_KEY");
    console.error("      - FIREBASE_CLIENT_EMAIL");
    console.error("   3. Use o Firebase Console para importar noticias-seed.json");
    process.exit(1);
  }
}

seedNoticias();
