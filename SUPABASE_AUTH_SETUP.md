# Configuração de Autenticação no Supabase

## 1. Verificar Configurações de Autenticação

### Acesse o Painel do Supabase
1. Vá para [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Navegue para **Authentication** no menu lateral

### Configurações Essenciais

#### 1.1 Habilitar Signups
- Vá para **Authentication** &gt; **Settings**
- Certifique-se de que **Enable signups** está **ON**
- Se estiver OFF, os usuários não conseguirão se cadastrar

#### 1.2 Configurar Email Confirmations
- Em **Authentication** &gt; **Settings**
- **Enable email confirmations**:
  - **ON**: Usuários precisam confirmar email antes de fazer login
  - **OFF**: Login automático após signup (recomendado para testes)

#### 1.3 Configurar Site URL
- Em **Authentication** &gt; **Settings**
- **Site URL**: Configure para `http://localhost:3000` (desenvolvimento)
- **Redirect URLs**: Adicione `http://localhost:3000/**`

### 2. Verificar Email Templates (Opcional)

#### 2.1 Personalizar Templates
- Vá para **Authentication** &gt; **Email Templates**
- Você pode personalizar:
  - **Confirm signup**: Email de confirmação
  - **Reset password**: Email de recuperação de senha
  - **Magic Link**: Login sem senha

#### 2.2 Configurar SMTP (Opcional)
- Para emails personalizados, configure SMTP em **Authentication** &gt; **Settings**

### 3. Configurar Políticas de Segurança

#### 3.1 Password Policy
- Em **Authentication** &gt; **Settings**
- **Minimum password length**: Recomendado 6+ caracteres
- **Password strength**: Configure conforme necessário

#### 3.2 Rate Limiting
- **Rate limiting**: Protege contra ataques de força bruta
- **Max attempts**: Configure o número máximo de tentativas

### 4. Testar Configuração

#### 4.1 Teste Manual
1. Tente criar uma conta real
2. Verifique se recebe o email de confirmação (se habilitado)
3. Teste o login após o cadastro

### 5. Problemas Comuns

#### 5.1 Erro 400 - "User already registered"
- O email já está cadastrado
- Solução: Use um email diferente ou reset a senha

#### 5.2 Erro 422 - "Invalid email"
- Formato de email inválido
- Solução: Verifique o formato do email

#### 5.3 Erro 429 - "Too many requests"
- Muitas tentativas de cadastro
- Solução: Aguarde alguns minutos

#### 5.4 Email não recebido
- Verifique a pasta de spam
- Confirme se o email está correto
- Verifique as configurações de SMTP

### 6. Configurações Avançadas

#### 6.1 OAuth Providers
- **Google**: Para login com Google
- **GitHub**: Para login com GitHub
- **Facebook**: Para login com Facebook

#### 6.2 Webhooks
- Configure webhooks para eventos de autenticação
- Útil para integrações externas

#### 6.3 Custom Claims
- Adicione claims personalizados aos tokens JWT
- Útil para roles e permissões

### 7. Monitoramento

#### 7.1 Logs de Autenticação
- Vá para **Authentication** &gt; **Logs**
- Monitore tentativas de login e cadastro
- Identifique possíveis problemas

#### 7.2 Métricas
- Acompanhe o número de usuários ativos
- Monitore taxas de conversão de signup

## Próximos Passos

1. **Teste o signup** criando uma conta real
2. **Verifique os logs** no painel do Supabase
3. **Configure email templates** se necessário
4. **Implemente recuperação de senha** se desejado 