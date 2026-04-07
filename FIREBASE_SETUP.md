# Guia de Configuração Firebase - Ravisdemosite

## Sumário Executivo

O projeto foi migrado para usar **Firebase Realtime Database** para armazenar dados das notícias. As imagens são armazenadas **localmente** na pasta `/midianoticias` do repositório, oferecendo uma solução mais simples e controlada.

## O que foi alterado?

### ✅ Mudanças Implementadas

1. **Firebase Realtime Database Integrado**
   - `src/firebase.ts` - Configuração do Firebase
   - `src/firebaseService.ts` - Serviço para operações de notícias

2. **Admin Melhorado**
   - `src/pages/Admin.tsx` - Painel com upload de imagens e gerenciamento em tempo real
   - Upload de imagens para `/midianoticias` via API
   - Preview de imagens antes de salvar

3. **Home Page Atualizada**
   - `src/App.tsx` - Carrega notícias do Firebase
   - `src/pages/Noticias.tsx` - Página de notícias com dados do Firebase

4. **Servidor Atualizado**
   - `server.ts` - Endpoint `/api/upload` para receber imagens
   - Serve automaticamente imagens de `/midianoticias`
   - Validação de tipos de arquivo e tamanho

## Como Configurar o Firebase

### Passo 1: Acessar o Firebase Console

1. Acesse: https://console.firebase.google.com
2. Selecione o projeto `ravis-7620d`

### Passo 2: Configurar Realtime Database

1. Vá para **Realtime Database**
2. Clique em **Criar banco de dados**
3. Selecione `ravis-7620d` (ou use o existente)
4. Escolha **Iniciar no modo de teste** (para desenvolvimento)
5. Clique em **Ativar**

### Passo 3: Configurar Regras de Segurança

1. Clique na aba **Rules**
2. Cole as regras do arquivo `FIREBASE_RULES.md`:

```json
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
```

3. Clique em **Publish**

**Para Produção**: Use regras mais restritivas com autenticação.

## Usando o Painel Administrativo

### Acessar o Painel

- URL: http://localhost:3000/admin
- Nenhuma autenticação é necessária em modo de desenvolvimento

### Adicionar Nova Notícia

1. Clique em "Nova Notícia"
2. Preencha:
   - **Título**: Título da notícia
   - **Categoria**: Selecione entre as opções disponíveis
   - **Imagem**: 
     - Clique para selecionar um arquivo do computador (.jpg, .png, .gif, .webp)
     - Máximo 5MB por imagem
   - **Resumo**: Descrição breve da notícia
3. Clique em "Salvar Notícia"

A imagem será automaticamente:
- Salva em `/midianoticias` com um nome único (timestamp + nome original)
- Disponível via URL: `/midianoticias/timestamp_nome.jpg`
- Referenciada no banco de dados Firebase

### Deletar Notícia

1. Localize a notícia na tabela
2. Clique no ícone da lixeira (🗑️)
3. Confirme a exclusão

## Estrutura do Projeto

### Realtime Database

```
ravis-7620d (root)
└── noticias
    ├── -NyZtQ9L5_k1a2b3c4d5e
    │   ├── categoria: "Trabalho"
    │   ├── data: "15 de Março, 2026"
    │   ├── titulo: "Secretaria de Trabalho..."
    │   ├── resumo: "O novo programa..."
    │   ├── imagem: "/midianoticias/1712345678910_noticia1.jpg"
    │   ├── criado: "2026-04-07T10:00:00Z"
    │   └── atualizado: "2026-04-07T10:00:00Z"
    └── -NyZtQ9L5_k2a2b3c4d5f
        └── ...
```

### Sistema de Arquivos

```
projeto/
├── src/
│   ├── firebase.ts              (Configuração do Firebase)
│   ├── firebaseService.ts       (Serviço de notícias)
│   ├── App.tsx                  (App principal)
│   └── pages/
│       ├── Admin.tsx            (Painel administrativo)
│       └── Noticias.tsx         (Página de notícias)
├── midianoticias/               (Imagens das notícias)
│   ├── 1712345678910_noticia1.jpg
│   ├── 1712345678920_noticia2.png
│   └── ...
├── server.ts                    (Servidor Express com upload)
└── ...
```

## Fluxo de Upload de Imagens

1. **Frontend** (`Admin.tsx`):
   - Usuário seleciona arquivo
   - Preview é exibido
   - Ao salvar, arquivo é enviado via `POST /api/upload`

2. **Backend** (`server.ts`):
   - Recebe arquivo via multer
   - Valida tipo (apenas imagens)
   - Valida tamanho (máximo 5MB)
   - Salva em `/midianoticias` com nome único
   - Retorna URL: `/midianoticias/timestamp_nome.jpg`

3. **Frontend** (continua):
   - Recebe URL da imagem
   - Salva notícia no Firebase com a URL
   - Recarrega lista de notícias

## Configuração em Produção

### ⚠️ Segurança

Para produção, é **altamente recomendado**:

1. **Configurar Autenticação**
   ```json
   {
     "rules": {
       "noticias": {
         ".read": true,
         ".write": "auth != null && auth.uid == 'seu_admin_uid'"
       }
     }
   }
   ```

2. **Validação no Backend**
   - O servidor já valida tipos e tamanho
   - Adicione validação de tokens se usar Auth

3. **Backup Regular**
   - Exporte dados do Firebase regularmente
   - Mantenha backups da pasta `/midianoticias`

4. **Cleanup de Arquivos**
   - Implemente limpeza automática de imagens não usadas
   - Monitore tamanho da pasta `/midianoticias`

## Variáveis de Ambiente

Nenhuma configuração de ambiente é necessária. A chave do Firebase já está configurada em `src/firebase.ts`.

## Troubleshooting

### Erro: "Permission denied" ao salvar notícia

**Solução**: Verifique se as regras de segurança foram publicadas corretamente no Firebase Console.

### Erro: "Images not loading"

**Solução**: 
1. Verifique se as imagens foram salvas em `/midianoticias`
2. Recarregue a página (Ctrl+F5)
3. Verifique o console do navegador para erros

### Dados não aparecem na home page

**Solução**:
1. Verifique se as notícias foram salvas no Firebase
2. Recarregue a página (Ctrl+F5)
3. Verifique o console do navegador para erros

### Erro ao fazer upload: "Arquivo muito grande"

**Solução**: A imagem excede 5MB. Redimensione ou comprima a imagem.

## Próximos Passos

1. ✅ Instalar Firebase SDK
2. ✅ Implementar Realtime Database
3. ✅ Configurar upload local em `/midianoticias`
4. ✅ Atualizar painel administrativo
5. ⏳ **AGORA**: Configure as regras no Firebase Console
6. ⏳ Teste a funcionalidade localmente
7. ⏳ Deploy para produção
8. ⏳ Migre dados existentes (se houver)
9. ⏳ Configure autenticação para produção

## Contato e Suporte

- Documentação Firebase: https://firebase.google.com/docs
- Console Firebase: https://console.firebase.google.com
- Projeto: ravis-7620d
