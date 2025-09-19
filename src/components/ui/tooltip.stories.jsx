import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Button } from "./button";
import { Info, Help, Settings, User } from "lucide-react";

export default {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="p-20">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};

export const Default = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Este é um tooltip básico</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Informações adicionais sobre este item</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const LongContent = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Informações detalhadas</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>
          Este tooltip contém uma descrição mais longa que pode ser útil para
          explicar funcionalidades complexas ou fornecer contexto adicional.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithDelay = {
  render: () => (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover com delay</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Este tooltip aparece após 1 segundo</p>
      </TooltipContent>
    </Tooltip>
  ),
};

// Showcase de diferentes posições
export const AllPositions = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 place-items-center">
      {/* Top */}
      <div></div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip no topo</p>
        </TooltipContent>
      </Tooltip>
      <div></div>

      {/* Left and Right */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip à esquerda</p>
        </TooltipContent>
      </Tooltip>

      <div className="text-center text-sm text-muted-foreground">
        Hover nos botões
        <br />
        para ver os tooltips
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip à direita</p>
        </TooltipContent>
      </Tooltip>

      {/* Bottom */}
      <div></div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip embaixo</p>
        </TooltipContent>
      </Tooltip>
      <div></div>
    </div>
  ),
};

// Exemplo com diferentes elementos
export const DifferentTriggers = {
  render: () => (
    <div className="flex gap-4 items-center">
      {/* Botão */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Botão</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip em botão</p>
        </TooltipContent>
      </Tooltip>

      {/* Ícone */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-2 rounded-md hover:bg-accent cursor-pointer">
            <Settings className="h-4 w-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Configurações</p>
        </TooltipContent>
      </Tooltip>

      {/* Texto */}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted cursor-help">
            Texto com tooltip
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Informação adicional sobre este texto</p>
        </TooltipContent>
      </Tooltip>

      {/* Avatar */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Perfil do usuário</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Exemplo de uso em formulário
export const FormExample = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="flex items-center gap-2">
        <label htmlFor="username" className="text-sm font-medium">
          Nome de usuário
        </label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Help className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>O nome de usuário deve ter entre 3 e 20 caracteres</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Usaremos este email para notificações importantes</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};
