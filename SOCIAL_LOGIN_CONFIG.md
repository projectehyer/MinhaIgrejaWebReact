# Configuração do Login Social

## Status Atual: DESABILITADO

O login social (Google e Facebook) está **desabilitado por padrão** para evitar erros de configuração.

## Como Habilitar

### 1. Configurar Variável de Ambiente

No arquivo `.env`, altere:

```env
# De:
REACT_APP_ENABLE_SOCIAL_LOGIN=false

# Para:
REACT_APP_ENABLE_SOCIAL_LOGIN=true
```

### 2. Configurar Provedores OAuth

Antes de habilitar, configure os provedores no Supabase:

#### Google OAuth:
- Siga o guia: `GOOGLE_OAUTH_QUICK_SETUP.md`
- Configure no Supabase: **Authentication > Providers > Google**

#### Facebook OAuth:
- Siga o guia: `OAUTH_SETUP.md` (seção Facebook)
- Configure no Supabase: **Authentication > Providers > Facebook**

### 3. Reiniciar Servidor

```bash
npm start
```

## Verificação

Após habilitar, você deve ver na tela de login:

- ✅ Botão "Continuar com Google"
- ✅ Botão "Continuar com Facebook"
- ✅ Separador "ou" entre login social e email/senha

## Desabilitar Novamente

Para desabilitar, altere no `.env`:

```env
REACT_APP_ENABLE_SOCIAL_LOGIN=false
```

E reinicie o servidor.

## Estrutura do Código

O login social está implementado de forma modular:

- **Condicional**: Só aparece se `ENABLE_SOCIAL_LOGIN=true`
- **Funcional**: Toda a lógica está pronta
- **Configurável**: Fácil de habilitar/desabilitar
- **Seguro**: Não quebra se os provedores não estiverem configurados

## Próximos Passos

1. **Configure os provedores OAuth** quando necessário
2. **Teste localmente** antes de ir para produção
3. **Monitore os logs** de autenticação
4. **Configure URLs de produção** quando necessário 