# Configuração Rápida do Google OAuth

## Passo 1: Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em **"Select a project"** no topo
3. Clique em **"New Project"**
4. Nome: `Minha Igreja OAuth`
5. Clique em **"Create"**

## Passo 2: Habilitar Google+ API

1. No menu lateral, vá para **APIs & Services** > **Library**
2. Procure por **"Google+ API"** ou **"Google Identity"**
3. Clique e depois **"Enable"**

## Passo 3: Configurar OAuth Consent Screen

1. Vá para **APIs & Services** > **OAuth consent screen**
2. **User Type**: External
3. Clique em **"Create"**
4. Preencha:
   - **App name**: Minha Igreja
   - **User support email**: seu-email@gmail.com
   - **Developer contact information**: seu-email@gmail.com
5. Clique em **"Save and Continue"**
6. Em **Scopes**, clique em **"Save and Continue"**
7. Em **Test users**, clique em **"Save and Continue"**

## Passo 4: Criar Credenciais OAuth

1. Vá para **APIs & Services** > **Credentials**
2. Clique em **"Create Credentials"** > **"OAuth 2.0 Client IDs"**
3. **Application type**: Web application
4. **Name**: Minha Igreja Web
5. **Authorized redirect URIs**:
   ```
   https://uutmdodovftdaipqavpf.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
6. Clique em **"Create"**
7. **Anote o Client ID e Client Secret**

## Passo 5: Configurar no Supabase

1. Vá para [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Authentication** > **Providers**
4. Encontre **Google** e clique no toggle para ativar
5. Preencha:
   - **Client ID**: (cole o Client ID do Google)
   - **Client Secret**: (cole o Client Secret do Google)
6. Clique em **"Save"**

## Passo 6: Testar

1. Volte para seu app: `http://localhost:3000/login`
2. Clique em **"Continuar com Google"**
3. Deve funcionar agora!

## Problemas Comuns:

### Erro "Invalid redirect URI"
- Verifique se as URIs estão exatamente como mostrado acima
- Não adicione espaços extras
- Confirme se o domínio do Supabase está correto

### Erro "App not configured"
- Verifique se o Google+ API está habilitado
- Confirme se as credenciais estão corretas
- Aguarde alguns minutos após criar as credenciais

### Erro "OAuth consent screen not configured"
- Complete a configuração da tela de consentimento
- Adicione seu email como usuário de teste se necessário 