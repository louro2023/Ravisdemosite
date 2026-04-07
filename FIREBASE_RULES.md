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
      "$noticia": {
        ".validate": "newData.hasChildren(['titulo', 'resumo', 'categoria', 'imagem', 'data'])"
      }
    }
  }
}

/**
 * OBSERVAÇÕES IMPORTANTES:
 * 
 * ✅ O que mudou nesta versão:
 * - Removemos completamente o Firebase Storage
 * - Imagens agora são armazenadas localmente na pasta /midianoticias
 * - O banco de dados armazena apenas referências às imagens (/midianoticias/filename.jpg)
 * - O servidor Express faz upload das imagens via /api/upload
 * 
 * 📁 Estrutura de Pastas:
 * midianoticias/
 * ├── 1712345678910_imagem1.jpg
 * ├── 1712345678920_imagem2.png
 * └── ...
 * 
 * 💾 Estrutura do Banco de Dados (Realtime Database):
 * ravis-7620d (root)
 * └── noticias
 *     ├── -NyZtQ9L5_k1a2b3c4d5e
 *     │   ├── categoria: "Trabalho"
 *     │   ├── data: "15 de Março, 2026"
 *     │   ├── titulo: "Secretaria de Trabalho..."
 *     │   ├── resumo: "O novo programa..."
 *     │   ├── imagem: "/midianoticias/1712345678910_imagem1.jpg"
 *     │   ├── criado: "2026-04-07T10:00:00Z"
 *     │   └── atualizado: "2026-04-07T10:00:00Z"
 *     └── ...
 */
