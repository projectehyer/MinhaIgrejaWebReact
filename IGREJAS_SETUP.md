# Cadastro de Igrejas - Setup e Uso

## 📋 Visão Geral

A funcionalidade de Cadastro de Igrejas permite gerenciar informações de igrejas no sistema, incluindo dados de endereço completos.

## 🗄️ Estrutura da Tabela

A tabela `igrejas` no Supabase deve ter a seguinte estrutura:

```sql
create table public.igrejas (
  id bigint generated by default as identity not null,
  created_at timestamp with time zone not null default now(),
  nome character varying null,
  logradouro character varying null,
  numero numeric null,
  complemento character varying null,
  bairro character varying null,
  id_cidade bigint null,
  id_uf bigint null,
  constraint igrejas_pkey primary key (id)
) TABLESPACE pg_default;
```

## 🔧 Configuração no Supabase

### 1. Criar a Tabela
Execute o SQL acima no SQL Editor do Supabase para criar a tabela.

### 2. Configurar Políticas de Segurança (RLS)
Adicione as seguintes políticas para permitir acesso autenticado:

```sql
-- Habilitar RLS
ALTER TABLE public.igrejas ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados
CREATE POLICY "Usuários autenticados podem gerenciar igrejas" ON public.igrejas
FOR ALL USING (auth.role() = 'authenticated');
```

## 🎯 Como Usar

### Acessar a Funcionalidade
1. Faça login no sistema
2. No menu lateral, vá em **Administração** → **Igrejas**
3. Você verá o formulário de cadastro de igrejas

### Campos do Formulário
- **Nome da Igreja**: Nome completo da igreja
- **Logradouro**: Rua, avenida, etc.
- **Número**: Número do endereço
- **Complemento**: Apto, sala, etc. (opcional)
- **Bairro**: Bairro da igreja
- **Estado (UF)**: Selecione o estado
- **Cidade**: Nome da cidade

### Funcionalidades
- ✅ **Adicionar Nova Igreja**: Preencha o formulário e clique em "Adicionar Igreja"
- ✅ **Editar Igreja**: Clique em uma igreja da lista para editar
- ✅ **Lista de Igrejas**: Visualize todas as igrejas cadastradas
- ✅ **Validação**: Campos obrigatórios são validados automaticamente

## 🔄 Integração com o Sistema

### Endpoints Utilizados
- **GET** `/rest/v1/igrejas` - Buscar todas as igrejas
- **POST** `/rest/v1/igrejas` - Criar nova igreja
- **PATCH** `/rest/v1/igrejas?id=eq.{id}` - Atualizar igreja existente

### Autenticação
Todas as requisições incluem:
- `apikey`: Chave anon do Supabase
- `Authorization`: Token Bearer do usuário logado

## 🎨 Interface

### Design Responsivo
- ✅ Funciona em desktop e mobile
- ✅ Layout adaptativo
- ✅ Formulário organizado em colunas

### Estilos
- Cores consistentes com o tema do sistema
- Animações suaves
- Feedback visual para interações

## 🚀 Próximos Passos

### Melhorias Sugeridas
1. **Integração com API de CEP**: Busca automática de endereço
2. **Upload de Imagem**: Foto da igreja
3. **Geolocalização**: Coordenadas GPS
4. **Horários de Culto**: Agenda de atividades
5. **Contatos**: Telefone, email, redes sociais

### Funcionalidades Futuras
- Mapa interativo com localização das igrejas
- Relatórios de igrejas por região
- Integração com Google Maps
- Sistema de avaliações e comentários

## 🐛 Solução de Problemas

### Erro 401 (Não Autorizado)
- Verifique se está logado
- Confirme se as políticas RLS estão configuradas

### Erro 422 (Dados Inválidos)
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme o formato dos dados

### Erro de Conexão
- Verifique sua conexão com a internet
- Confirme se o Supabase está acessível

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Confirme a configuração do Supabase
3. Teste a conectividade com a API 