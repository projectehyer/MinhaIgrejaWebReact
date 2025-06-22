# Configuração do Reset de Senha

## Problema Identificado

O link de recuperação de senha estava redirecionando para a tela de login em vez de uma tela específica para redefinir a senha.

## Solução Implementada

### 1. Novo Componente: PasswordUpdate
- ✅ Tela específica para redefinir senha
- ✅ Validação de token
- ✅ Formulário de nova senha
- ✅ Confirmação de senha
- ✅ Tratamento de erros

### 2. URL de Redirecionamento Corrigida
- ✅ `redirect_to: /update-password`
- ✅ Rota configurada no App.js
- ✅ Fluxo completo implementado

## Configuração no Supabase

### 1. Configurar URLs de Redirecionamento

No painel do Supabase, vá para **Authentication > Settings**:

1. **Site URL**: `http://localhost:3000` (desenvolvimento)
2. **Redirect URLs**: Adicione:
   ```
   http://localhost:3000/update-password
   http://localhost:3000/confirm-email
   http://localhost:3000/auth/callback
   ```

### 2. Configurar Email Templates (Opcional)

Vá para **Authentication > Email Templates > Reset password**:

```html
<h2>Recuperação de Senha</h2>
<p>Você solicitou a recuperação de sua senha.</p>
<p>Clique no link abaixo para redefinir sua senha:</p>
<a href="{{ .ConfirmationURL }}">Redefinir Senha</a>
<p>Se você não solicitou esta recuperação, ignore este email.</p>
```

## Fluxo Correto

### 1. Usuário solicita recuperação
- Acessa `/reset-password`
- Digita email
- Clica em "Enviar Email"

### 2. Email enviado
- Supabase envia email com link
- Link contém token de recuperação
- URL: `http://localhost:3000/update-password?token=xxx&type=recovery`

### 3. Usuário clica no link
- Redireciona para `/update-password`
- Componente valida token
- Mostra formulário de nova senha

### 4. Usuário redefine senha
- Digita nova senha
- Confirma senha
- Clica em "Atualizar Senha"

### 5. Senha atualizada
- Tela de sucesso
- Redireciona para login
- Usuário faz login com nova senha

## Teste do Fluxo

1. **Acesse** `/reset-password`
2. **Digite** um email válido
3. **Clique** em "Enviar Email"
4. **Verifique** o email recebido
5. **Clique** no link do email
6. **Redefina** a senha
7. **Faça login** com a nova senha

## Problemas Comuns

### Link não funciona
- Verifique se as URLs estão configuradas no Supabase
- Confirme se o token não expirou
- Verifique se o email está correto

### Erro de token inválido
- Tokens expiram em 1 hora por padrão
- Solicite um novo link
- Verifique se o tipo é `recovery`

### Email não recebido
- Verifique a pasta de spam
- Confirme se o email está correto
- Aguarde alguns minutos

## Próximos Passos

1. **Teste o fluxo completo**
2. **Configure para produção** quando necessário
3. **Personalize os templates** de email
4. **Monitore os logs** de autenticação 