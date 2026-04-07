/**
 * FIREBASE REALTIME DATABASE - REGRAS DE SEGURANÇA (Database Rules)
 * 
 * Cole estas regras no console do Firebase:
 * https://console.firebase.google.com/project/ravis-7620d/database/ravis-7620d-default-rtdb/rules
 * 
 * 1. Acesse seu projeto Firebase (ravis-7620d)
 * 2. Vá para "Realtime Database"
 * 3. Clique na aba "Rules"
 * 4. Cole o conteúdo abaixo
 * 5. Clique em "Publish"
 */

{
  "rules": {
    "noticias": {
      ".read": true,
      ".write": false,
      "$noticia": {
        ".write": "auth != null && auth.uid == 'admin_user_id'",
        "id": { ".validate": "newData.isString()" },
        "titulo": { ".validate": "newData.isString() && newData.val().length > 0" },
        "resumo": { ".validate": "newData.isString() && newData.val().length > 0" },
        "categoria": { ".validate": "newData.isString()" },
        "imagem": { ".validate": "newData.isString()" },
        "data": { ".validate": "newData.isString()" },
        "criado": { ".validate": "newData.isString()" },
        "atualizado": { ".validate": "newData.isString()" }
      }
    }
  }
}

/**
 * ALTERNATIVA: Regras mais permissivas para desenvolvimento
 * (Use apenas em ambiente de desenvolvimento, não em produção!)
 */

{
  "rules": {
    "noticias": {
      ".read": true,
      ".write": true,
      "": {
        ".validate": true
      }
    }
  }
}

/** 
 * FIREBASE STORAGE - REGRAS DE SEGURANÇA (Storage Rules)
 * 
 * Cole estas regras no console do Firebase:
 * https://console.firebase.google.com/project/ravis-7620d/storage/ravis-7620d.firebasestorage.app/rules
 * 
 * 1. Acesse seu projeto Firebase (ravis-7620d)
 * 2. Vá para "Storage"
 * 3. Clique na aba "Rules"
 * 4. Cole o conteúdo abaixo (substitua as regras padrão)
 * 5. Clique em "Publish"
 */

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir ler todas as imagens publicamente
    match /noticias/{allPaths=**} {
      allow read: if true;
      // Permitir escrever apenas para usuários autenticados
      allow create: if request.auth != null && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
      allow update: if false;
    }
    
    // Bloquear acesso a outros arquivos
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}

/**
 * CONFIGURAÇÃO IMPORTANTE:
 * 
 * 1. Usuário Admin:
 *    - Para autenticação de admin, você precisa configurar Authentication no Firebase
 *    - Use Email/Password ou Google Sign-In
 *    - Anote o UID do admin: "admin_user_id" nas regras acima
 * 
 * 2. Alternativamente (para desenvolvimento):
 *    - Use as regras mais permissivas acima (não recomendado para produção)
 * 
 * 3. Estrutura do Banco de Dados (Realtime Database):
 *    ravis-7620d (root)
 *    └── noticias
 *        ├── [chave_aleatória_1]
 *        │   ├── id: "string"
 *        │   ├── titulo: "string"
 *        │   ├── resumo: "string"
 *        │   ├── categoria: "string"
 *        │   ├── imagem: "https://..."
 *        │   ├── data: "DD de Mês, YYYY"
 *        │   ├── criado: "ISO_DATE"
 *        │   └── atualizado: "ISO_DATE"
 *        └── [chave_aleatória_2]
 *            └── ...
 *
 * 4. Estrutura do Storage:
 *    noticias/
 *    ├── 1712345678910_imagem1.jpg
 *    ├── 1712345678920_imagem2.png
 *    └── ...
 * 
 * PRÓXIMOS PASSOS:
 * 
 * 1. Configure as regras de segurança no Firebase Console
 * 2. Configure autenticação (Firebase Auth) se necessário
 * 3. Teste a integração acessando http://localhost:3000/admin
 * 4. Adicione notícias e imagens pelo painel administrativo
 * 5. Verifique que as imagens aparecem no site principal e na página de notícias
 * 6. Para produção, certifique-se de configurar corretamente a autenticação de admin
 */
