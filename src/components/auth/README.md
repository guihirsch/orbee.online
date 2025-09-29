# Sistema de Autenticação - OrBee.Online

Este diretório contém todos os componentes relacionados à autenticação do usuário.

## Componentes

### LoginForm

Formulário de login com validação de email/celular e senha.

**Props:**

- `onSwitchToRegister`: Função chamada para alternar para o formulário de cadastro
- `onSuccess`: Função chamada quando o login é bem-sucedido

### RegisterForm

Formulário de cadastro com campos para nome completo, email, nome de usuário e senha.

**Props:**

- `onSwitchToLogin`: Função chamada para alternar para o formulário de login
- `onSuccess`: Função chamada quando o cadastro é bem-sucedido

### AuthModal

Modal que gerencia a alternância entre login e cadastro.

**Props:**

- `isOpen`: Boolean que controla se o modal está aberto
- `onClose`: Função chamada para fechar o modal
- `initialMode`: 'login' ou 'register' - modo inicial do modal

### AuthButton

Botão que mostra o estado de autenticação do usuário. Quando não autenticado, mostra um botão "Entrar". Quando autenticado, mostra um menu com opções do usuário.

### ProtectedRoute

Componente que protege rotas que requerem autenticação. Redireciona usuários não autenticados para a página inicial.

## Hook useAuth

O hook `useAuth` fornece acesso ao estado de autenticação:

```javascript
const {
   user, // Dados do usuário autenticado
   loading, // Estado de carregamento
   error, // Erro de autenticação
   isAuthenticated, // Boolean indicando se está autenticado
   register, // Função para cadastro
   login, // Função para login
   logout, // Função para logout
   refresh, // Função para atualizar dados do usuário
   clearError, // Função para limpar erros
} = useAuth();
```

## Context AuthContext

O contexto `AuthContext` gerencia o estado global de autenticação e deve ser usado como provider na raiz da aplicação.

## Serviços

### authService.js

Contém as funções para comunicação com a API de autenticação:

- `register(userData)`: Cadastra um novo usuário
- `login(credentials)`: Autentica um usuário
- `logout()`: Desautentica o usuário
- `me()`: Obtém dados do usuário atual

## Rotas Protegidas

Para proteger uma rota, envolva o componente com `ProtectedRoute`:

```javascript
<Route
   path="/perfil"
   element={
      <ProtectedRoute>
         <Profile />
      </ProtectedRoute>
   }
/>
```

## Exemplo de Uso

```javascript
import { useAuth } from "../hooks/useAuth";
import { AuthButton, AuthModal } from "../components/auth";

function MyComponent() {
   const { isAuthenticated, user } = useAuth();

   return (
      <div>
         <AuthButton />
         {isAuthenticated && <p>Bem-vindo, {user.full_name}!</p>}
      </div>
   );
}
```

## Integração com Backend

O sistema está configurado para trabalhar com as seguintes rotas da API:

- `POST /api/v1/auth/register` - Cadastro
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Dados do usuário

## Validações

### Login

- Email/celular é obrigatório
- Senha é obrigatória
- Senha deve ter pelo menos 6 caracteres

### Cadastro

- Nome completo é obrigatório (mínimo 2 caracteres)
- Email é obrigatório
- Nome de usuário é obrigatório (mínimo 3 caracteres)
- Senha é obrigatória (mínimo 6 caracteres)
- Confirmação de senha deve coincidir

## Estilização

Os componentes usam classes do Tailwind CSS e seguem o design system do OrBee.Online. As cores primárias são definidas no tema "orbee".
