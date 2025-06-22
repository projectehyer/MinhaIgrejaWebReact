# Configuração de OAuth (Google e Facebook)

## 1. Configurar Google OAuth

### 1.1 Criar Projeto no Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth 2.0 Client IDs**

### 1.2 Configurar OAuth Consent Screen
1. Selecione **External** (para usuários externos)
2. Preencha as informações:
   - **App name**: Minha Igreja
   - **User support email**: seu-email@exemplo.com
   - **Developer contact information**: seu-email@exemplo.com

### 1.3 Criar OAuth Client ID
1. **Application type**: Web application
2. **Name**: Minha Igreja Web
3. **Authorized redirect URIs**:
   - `https://uutmdodovftdaipqavpf.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (desenvolvimento)

### 1.4 Configurar no Supabase
1. Vá para **Authentication** > **Providers**
2. Ative **Google**
3. Preencha:
   - **Client ID**: ID do Google Cloud Console
   - **Client Secret**: Secret do Google Cloud Console
   - **Redirect URL**: `https://uutmdodovftdaipqavpf.supabase.co/auth/v1/callback`

## 2. Configurar Facebook OAuth

### 2.1 Criar App no Facebook Developers
1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Clique em **Create App**
3. Selecione **Consumer** ou **Business**
4. Preencha as informações do app

### 2.2 Configurar Facebook Login
1. No painel do app, vá para **Add Product**
2. Adicione **Facebook Login**
3. Configure **Valid OAuth Redirect URIs**:
   - `https://uutmdodovftdaipqavpf.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (desenvolvimento)

### 2.3 Obter Credenciais
1. Vá para **Settings** > **Basic**
2. Anote o **App ID** e **App Secret**

### 2.4 Configurar no Supabase
1. Vá para **Authentication** > **Providers**
2. Ative **Facebook**
3. Preencha:
   - **Client ID**: App ID do Facebook
   - **Client Secret**: App Secret do Facebook
   - **Redirect URL**: `https://uutmdodovftdaipqavpf.supabase.co/auth/v1/callback`

## 3. Configurações Adicionais no Supabase

### 3.1 Site URL
- Vá para **Authentication** > **Settings**
- **Site URL**: `http://localhost:3000` (desenvolvimento)
- **Redirect URLs**: Adicione `http://localhost:3000/**`

### 3.2 Configurar Email Templates (Opcional)
- Vá para **Authentication** > **Email Templates**
- Personalize os templates para incluir informações sobre login social

## 4. Testar a Configuração

### 4.1 Teste Local
1. Inicie o servidor: `npm start`
2. Acesse `http://localhost:3000/login`
3. Clique em "Continuar com Google" ou "Continuar com Facebook"
4. Complete o fluxo de autenticação

### 4.2 Verificar Logs
- Vá para **Authentication** > **Logs**
- Monitore as tentativas de login social
- Verifique se há erros

## 5. Problemas Comuns

### 5.1 Erro "Invalid redirect URI"
- Verifique se as URIs estão configuradas corretamente
- Confirme se não há espaços extras
- Teste com e sem `www`

### 5.2 Erro "App not configured"
- Verifique se o app está ativo no Google/Facebook
- Confirme se as credenciais estão corretas
- Verifique se o domínio está autorizado

### 5.3 Erro "OAuth consent screen not configured"
- Configure a tela de consentimento no Google Cloud Console
- Adicione os domínios necessários

### 5.4 Erro "App not in development mode"
- No Facebook, coloque o app em modo de desenvolvimento
- Adicione usuários de teste se necessário

## 6. Configuração de Produção

### 6.1 URLs de Produção
- Substitua `localhost:3000` pela URL de produção
- Configure HTTPS para produção
- Atualize as URIs de redirecionamento

### 6.2 Segurança
- Use variáveis de ambiente para as credenciais
- Configure CORS adequadamente
- Monitore logs de autenticação

## 7. Próximos Passos

1. **Teste ambos os provedores** localmente
2. **Configure para produção** quando necessário
3. **Monitore os logs** de autenticação
4. **Personalize a experiência** do usuário
5. **Implemente fallbacks** para casos de erro 