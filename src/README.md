# Estrutura do Projeto MinhaIgrejaWebReact

## Organização de Pastas

### 📁 `components/`
Componentes React organizados por funcionalidade:

#### 🔐 `components/auth/`
Componentes relacionados à autenticação:
- `Login.jsx` - Tela de login
- `Signup.jsx` - Tela de cadastro
- `PasswordReset.jsx` - Recuperação de senha
- `PasswordUpdate.jsx` - Atualização de senha
- `EmailConfirmation.jsx` - Confirmação de email
- `AuthCallback.jsx` - Callback para OAuth

#### 📊 `components/dashboard/`
Componentes do painel principal:
- `Dashboard.jsx` - Dashboard principal

#### 📝 `components/content/`
Componentes de gerenciamento de conteúdo:
- `ConteudoForm.jsx` - Formulário de criação/edição de conteúdo
- `ConteudoDetalhe.jsx` - Visualização detalhada de conteúdo

#### 🏗️ `components/layout/`
Componentes de layout e estrutura:
- `Sidebar.jsx` - Barra lateral de navegação

#### 🎨 `components/ui/`
Componentes de interface reutilizáveis:
- `NotFound.jsx` - Página 404

### 🎨 `styles/`
Arquivos CSS organizados:
- `App.css` - Estilos globais da aplicação
- `index.css` - Estilos base
- `Dashboard.css` - Estilos do dashboard
- `Sidebar.css` - Estilos da barra lateral
- `ConteudoForm.css` - Estilos do formulário de conteúdo

### 🔧 `contexts/`
Contextos React para gerenciamento de estado:
- `AuthContext.jsx` - Contexto de autenticação

### 🛠️ `utils/`
Utilitários e configurações:
- `axios.js` - Configuração do Axios e interceptors

### 🪝 `hooks/`
Custom hooks React (pasta preparada para futuras implementações)

## Arquivos Principais

### 📄 `App.js`
Componente principal da aplicação com roteamento

### 📄 `index.js`
Ponto de entrada da aplicação

## Benefícios da Nova Estrutura

1. **Organização Clara**: Cada tipo de componente tem sua pasta específica
2. **Manutenibilidade**: Fácil localização e manutenção de arquivos
3. **Escalabilidade**: Estrutura preparada para crescimento do projeto
4. **Separação de Responsabilidades**: Estilos, lógica e componentes separados
5. **Reutilização**: Componentes UI podem ser facilmente reutilizados

## Convenções de Nomenclatura

- **Componentes**: PascalCase (ex: `Login.jsx`)
- **Arquivos CSS**: PascalCase (ex: `Dashboard.css`)
- **Pastas**: camelCase (ex: `components/auth/`)
- **Hooks**: camelCase com prefixo "use" (ex: `useAuth`)
- **Contextos**: PascalCase com sufixo "Context" (ex: `AuthContext.jsx`)

## Imports

Todos os imports foram atualizados para refletir a nova estrutura:

```javascript
// Exemplo de import de componente
import Login from './components/auth/Login';

// Exemplo de import de contexto
import { useAuth } from './contexts/AuthContext';

// Exemplo de import de utilitário
import api from './utils/axios';

// Exemplo de import de estilo
import './styles/Dashboard.css';
``` 