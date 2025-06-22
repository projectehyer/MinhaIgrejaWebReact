# Configuração do Supabase para Signup

## 1. Configurações de Autenticação no Supabase

### Habilitar Signup
1. Acesse o painel do Supabase
2. Vá para **Authentication** > **Settings**
3. Em **Enable email confirmations**, você pode escolher:
   - **ON**: Usuários precisam confirmar email antes de fazer login
   - **OFF**: Login automático após signup (recomendado para testes)

### Configurar Email Templates (Opcional)
1. Vá para **Authentication** > **Email Templates**
2. Personalize os templates de:
   - Confirmação de email
   - Reset de senha
   - Magic link

## 2. Configurar RLS (Row Level Security)

Se você quiser que os usuários só vejam seus próprios dados:

```sql
-- Exemplo para tabela de perfil do usuário
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nome TEXT,
  telefone TEXT,
  tipo_usuario TEXT DEFAULT 'membro',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Política para usuários verem apenas seus dados
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários editarem apenas seus dados
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 3. Variáveis de Ambiente

Certifique-se de que seu arquivo `.env` contenha:

```env
REACT_APP_SUPABASE_API_BASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_API_KEY=your-anon-key
```

## 4. Funcionalidades Implementadas

### Signup
- ✅ Criação de conta com email/senha
- ✅ Validação de senha (mín. 6 caracteres)
- ✅ Confirmação de senha
- ✅ Dados adicionais (nome, telefone)
- ✅ Tratamento de erros
- ✅ Tela de sucesso após cadastro

### Login
- ✅ Link para signup na tela de login
- ✅ Navegação entre login e signup

### Fluxo de Autenticação
- ✅ Login automático após signup (se email confirmation estiver OFF)
- ✅ Redirecionamento para dashboard após login
- ✅ Proteção de rotas

## 5. Próximos Passos (Opcionais)

### Adicionar Validações
- Validação de formato de email
- Validação de força da senha
- Validação de telefone

### Adicionar Recursos
- Recuperação de senha
- Login com Google/Facebook
- Verificação de email
- Perfil do usuário

### Melhorar UX
- Loading states mais detalhados
- Mensagens de erro mais específicas
- Animações de transição 