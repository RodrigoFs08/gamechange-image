# Configuração do Google Cloud Storage

## Problemas Resolvidos

### 1. Erro de Arquivo de Credenciais Não Encontrado
- **Problema**: `ENOENT: no such file or directory, open '/app/plim-ai-cb3ed5bfa6e7.json'`
- **Solução**: O código agora suporta tanto arquivos de credenciais quanto JSON strings

### 2. Erro "File is not defined"
- **Problema**: Incompatibilidade com Node.js no ambiente de produção
- **Solução**: Substituído pela API de geração de imagens mais estável

## Configuração das Credenciais

### Opção 1: JSON String (Recomendado para Produção)

1. Baixe o arquivo de credenciais do Google Cloud Console
2. Abra o arquivo JSON e copie todo o conteúdo
3. Configure a variável de ambiente:

```bash
GOOGLE_CLOUD_KEYFILE='{"type":"service_account","project_id":"seu-projeto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

### Opção 2: Arquivo de Credenciais (Desenvolvimento Local)

1. Baixe o arquivo de credenciais do Google Cloud Console
2. Salve como `gcs-keyfile.json` na raiz do projeto
3. Configure a variável de ambiente:

```bash
GOOGLE_CLOUD_KEYFILE=./gcs-keyfile.json
```

## Variáveis de Ambiente Necessárias

```bash
# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id
GOOGLE_CLOUD_BUCKET_NAME=seu-bucket-name
GOOGLE_CLOUD_KEYFILE=conteudo-json-ou-caminho-do-arquivo

# OpenAI
OPENAI_API_KEY=sua-chave-openai

# JWT
JWT_SECRET=seu-jwt-secret

# Database
DATABASE_URL=sua-url-do-banco

# App
NEXT_PUBLIC_BASE_URL=https://seu-dominio.com
```

## Configuração no Coolify

1. Vá para as configurações do seu projeto no Coolify
2. Adicione as variáveis de ambiente:
   - `GOOGLE_CLOUD_PROJECT_ID`
   - `GOOGLE_CLOUD_BUCKET_NAME`
   - `GOOGLE_CLOUD_KEYFILE` (conteúdo JSON completo)
   - `OPENAI_API_KEY`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_BASE_URL`

## Permissões do Bucket

Certifique-se de que o bucket do Google Cloud Storage tenha as seguintes permissões:

1. **Acesso público para leitura** (se quiser URLs públicas)
2. **Permissões de escrita** para a service account

## Teste da Configuração

Após configurar, teste fazendo upload de uma imagem. Se tudo estiver correto, você verá:

```
✅ Imagem salva no GCS: original/uuid.png
✅ Imagem salva no GCS: generated/uuid.png
```

Se houver problemas, o sistema usará imagens mock como fallback. 