# Firebase Realtime Database Configuration

## Regras de Segurança

Copie e cole as regras abaixo no Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "noticias": {
      ".read": true,
      ".write": false,
      "$noticia_id": {
        ".write": "root.child('admin').child('users').child(auth.uid).val() === true",
        "titulo": { ".validate": "newData.isString() && newData.val().length > 0" },
        "resumo": { ".validate": "newData.isString() && newData.val().length > 0" },
        "categoria": { ".validate": "newData.isString()" },
        "imagem": { ".validate": "newData.isString()" },
        "data": { ".validate": "newData.isString()" }
      }
    },
    "admin": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('admin').child('users').child(auth.uid).val() === true"
    }
  }
}
```

## Como Configurar o Banco de Dados

### 1. Estrutura Esperada no Firebase

O banco de dados deve ter a seguinte estrutura:

```
ravis-7620d-default-rtdb
├── noticias
│   ├── noticia_id_1
│   │   ├── categoria: "Trabalho"
│   │   ├── data: "15 de Março, 2026"
│   │   ├── titulo: "Secretaria de Trabalho lança novo programa..."
│   │   ├── resumo: "O novo programa visa capacitar..."
│   │   └── imagem: "/noticia 1.jpg"
│   ├── noticia_id_2
│   │   └── ...
│   └── noticia_id_3
│       └── ...
└── admin
    └── users
        └── user_uid: true
```

### 2. Inicializar o Banco de Dados

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto "ravis-7620d"
3. Vá para "Realtime Database"
4. Clique em "Criar banco de dados"
5. Escolha a localização (ex: us-central1)
6. Escolha "Iniciar no modo bloqueado"
7. Clique em "Ativar"

### 3. Adicionar as Regras de Segurança

1. No Realtime Database, vá para a aba "Regras"
2. Substitua o conteúdo pelas regras fornecidas acima
3. Clique em "Publicar"

### 4. Adicionar Dados Iniciais (Opcional)

Para adicionar dados manualmente:

1. No Firestore/Realtime Database, clique em "+"
2. Crie a estrutura manualmente ou importe um JSON com:

```json
{
  "noticias": {
    "noticia_001": {
      "titulo": "Secretaria de Trabalho lança novo programa de qualificação na Baixada",
      "resumo": "O novo programa visa capacitar mais de 5 mil jovens para o mercado de tecnologia até o final do ano, com foco em inclusão.",
      "categoria": "Trabalho",
      "data": "15 de Março, 2026",
      "imagem": "/noticia 1.jpg"
    },
    "noticia_002": {
      "titulo": "Aprovada emenda que destina recursos para hospitais de Nova Iguaçu",
      "resumo": "Foram garantidos mais de R$ 2 milhões para a compra de novos equipamentos para a rede municipal de saúde.",
      "categoria": "Alerj",
      "data": "02 de Março, 2026",
      "imagem": "/noticia2.jpg"
    },
    "noticia_003": {
      "titulo": "Mutirão de serviços atende centenas de famílias no fim de semana",
      "resumo": "Ação social promovida pelo mandato levou serviços de saúde, emissão de documentos e lazer para a comunidade.",
      "categoria": "Ação Social",
      "data": "20 de Fevereiro, 2026",
      "imagem": "/noticia 3.jpg"
    }
  }
}
```

### 5. Configurar Autenticação para Admin

Se desejar adicionar autenticação para o painel administrativo:

1. Vá para "Authentication" no Firebase Console
2. Clique em "Começar"
3. Escolha o método de autenticação (Email/Senha, Google, etc)
4. Ative o método desejado
5. Crie um usuário de teste

### 6. Variáveis de Ambiente

O arquivo `.env.local` já tem as credenciais do Firebase configuradas em `src/firebase.ts`.

## Imagens

As imagens continuam sendo servidas da pasta raiz do projeto:
- `/noticia 1.jpg`
- `/noticia2.jpg`
- `/noticia 3.jpg`

## Fluxo de Atualização

1. O usuário acessa `/admin` para gerenciar notícias
2. As mudanças são salvas no Firebase Realtime Database
3. O site (home e página de notícias) busca os dados em tempo real do Firebase
4. As imagens são servidas da pasta raiz do servidor

## Notas Importantes

- **Segurança**: As regras permitem leitura pública de notícias, mas apenas usuários autenticados como admin podem escrever
- **Performance**: Os dados são atualizados em tempo real usando `onValue()` do Firebase
- **Armazenamento de Imagens**: As imagens não são armazenadas no Firebase, apenas referenciadas pelos caminhos
