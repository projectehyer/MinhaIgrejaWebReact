# Configuração das Variáveis de Ambiente

## 1. Criar arquivo .env

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Configurações do Supabase
REACT_APP_SUPABASE_API_BASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_API_KEY=sua-chave-anon-aqui
NODE_ENV=development

# Login Social (opcional)
REACT_APP_ENABLE_SOCIAL_LOGIN=false
```

## 2. Obter credenciais do Supabase

1. Acesse o [painel do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Settings** > **API**
4. Copie:
   - **Project URL** → `REACT_APP_SUPABASE_API_BASE_URL`
   - **anon public** → `REACT_APP_SUPABASE_API_KEY`

## 3. Exemplo de configuração

```env
REACT_APP_SUPABASE_API_BASE_URL=https://uutmdodovftdaipqavpf.supabase.co
REACT_APP_SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
REACT_APP_ENABLE_SOCIAL_LOGIN=false
```

## 4. Habilitar Login Social (Opcional)

Para habilitar login com Google e Facebook:

1. **Configure os provedores OAuth** seguindo o guia `OAUTH_SETUP.md`
2. **Altere a variável de ambiente**:
   ```env
   REACT_APP_ENABLE_SOCIAL_LOGIN=true
   ```
3. **Reinicie o servidor**:
   ```bash
   npm start
   ```

## 5. Reiniciar o servidor

Após criar/modificar o arquivo `.env`, reinicie o servidor de desenvolvimento:

```bash
npm start
```

## 6. Problemas comuns

### Erro 401
- Verifique se a chave anon está correta
- Confirme se o projeto Supabase está ativo

### Erro de conexão
- Verifique sua conexão com a internet
- Confirme se a URL do projeto está correta

### Variáveis não carregadas
- Certifique-se de que o arquivo se chama `.env` (não `.env.txt`)
- Reinicie o servidor após criar/modificar o arquivo
- Verifique se não há espaços extras nas variáveis

### Login social não aparece
- Verifique se `REACT_APP_ENABLE_SOCIAL_LOGIN=true`
- Confirme se os provedores estão configurados no Supabase
- Reinicie o servidor após alterar a variável 