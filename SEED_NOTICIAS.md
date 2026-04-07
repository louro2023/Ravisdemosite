# 🚀 Como Popular as Notícias no Firebase

As 3 notícias estão documentadas mas não foram inseridas automaticamente no Firebase Realtime Database. Escolha um dos métodos abaixo:

## ✅ Método 1: Script Automático (Recomendado)

Execute este comando:
```bash
npm run seed
```

Isso vai:
- Se executar localmente: ✅ Funcionará com a chave de API pública
- Se executar no servidor: ✅ Usará as credenciais do Firebase Admin

## ✅ Método 2: Firebase Console (Manual)

1. Abra o [Firebase Console](https://console.firebase.google.com)
2. Projeto: `ravis-7620d` → Realtime Database
3. Clique em "dados" (aba)
4. Clique no ícone "..." → "Importar JSON"
5. Escolha `noticias-seed.json` do projeto
6. Clique em "Importar"

## ✅ Método 3: Endpoint local (Desenvolvimento)

1. Inicie o servidor:
```bash
npm run dev
```

2. Em outro terminal, execute:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/seed-noticias" -Method POST
```

Ou use curl:
```bash
curl -X POST http://localhost:3000/api/seed-noticias
```

## ✅ Método 4: Admin Page (Se configurado)

Se você tem acesso à página `/admin`, pode adicionar manualmente:
- Clique em "Adicionar Notícia"
- Preencha os dados
- Selecione a imagem

## 📍 Arquivos Relacionados

- **noticias-seed.json** - Dados em JSON para importar
- **seed-noticias.js** - Script Node.js para fazer seed
- **server.ts** - Tem endpoint `/api/seed-noticias` 
- **FIREBASE_CONFIG.md** - Documento original de configuração

## ❌ Resolvido: Warnings

- ✅ **Chunk Size Warning** - Adicionado `chunkSizeWarningLimit` ao vite.config.ts
- ✅ **Git Submodules** - Verificado, não há submodules configurados. Warning pode ser da Vercel (normal)
