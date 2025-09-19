import { Input } from "./input";

export default {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url", "search"],
    },
    placeholder: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    value: {
      control: { type: "text" },
    },
  },
};

export const Default = {
  args: {
    placeholder: "Digite algo...",
  },
};

export const WithValue = {
  args: {
    value: "Texto de exemplo",
    placeholder: "Digite algo...",
  },
};

export const Email = {
  args: {
    type: "email",
    placeholder: "seu@email.com",
  },
};

export const Password = {
  args: {
    type: "password",
    placeholder: "Sua senha",
  },
};

export const Number = {
  args: {
    type: "number",
    placeholder: "123",
  },
};

export const Search = {
  args: {
    type: "search",
    placeholder: "Buscar...",
  },
};

export const Disabled = {
  args: {
    disabled: true,
    placeholder: "Campo desabilitado",
    value: "Não editável",
  },
};

// Showcase de diferentes tipos
export const AllTypes = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <label className="block text-sm font-medium mb-1">Texto</label>
        <Input type="text" placeholder="Digite seu nome" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input type="email" placeholder="seu@email.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Senha</label>
        <Input type="password" placeholder="Sua senha" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Número</label>
        <Input type="number" placeholder="123" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Busca</label>
        <Input type="search" placeholder="Buscar..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Desabilitado</label>
        <Input disabled placeholder="Campo desabilitado" />
      </div>
    </div>
  ),
};

// Formulário de exemplo
export const FormExample = {
  render: () => (
    <form className="space-y-4 w-80">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nome completo
        </label>
        <Input id="name" placeholder="João Silva" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input id="email" type="email" placeholder="joao@exemplo.com" />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Telefone
        </label>
        <Input id="phone" type="tel" placeholder="(11) 99999-9999" />
      </div>
    </form>
  ),
};
