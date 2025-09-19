import { useState } from "react";
import Modal from "./Modal";
import { Button } from "./button";

export default {
  title: "UI/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl", "full"],
    },
    showCloseButton: {
      control: { type: "boolean" },
    },
    closeOnBackdrop: {
      control: { type: "boolean" },
    },
  },
};

// Template base para stories interativas
const Template = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {args.children}
      </Modal>
    </>
  );
};

export const Default = {
  render: Template,
  args: {
    title: "Modal Padrão",
    children: (
      <div>
        <p className="text-slate-300 mb-4">
          Este é um modal básico com conteúdo simples.
        </p>
        <p className="text-slate-400 text-sm">
          Você pode fechar clicando no X, pressionando Escape ou clicando fora
          do modal.
        </p>
      </div>
    ),
  },
};

export const Small = {
  render: Template,
  args: {
    title: "Modal Pequeno",
    size: "sm",
    children: (
      <div>
        <p className="text-slate-300">
          Modal com tamanho pequeno para confirmações rápidas.
        </p>
      </div>
    ),
  },
};

export const Large = {
  render: Template,
  args: {
    title: "Modal Grande",
    size: "lg",
    children: (
      <div>
        <p className="text-slate-300 mb-4">
          Modal grande para conteúdo mais extenso.
        </p>
        <div className="space-y-4">
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Seção 1</h4>
            <p className="text-slate-300 text-sm">
              Conteúdo da primeira seção.
            </p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Seção 2</h4>
            <p className="text-slate-300 text-sm">Conteúdo da segunda seção.</p>
          </div>
        </div>
      </div>
    ),
  },
};

export const WithForm = {
  render: Template,
  args: {
    title: "Formulário de Contato",
    size: "md",
    children: (
      <div>
        <Modal.Input label="Nome" placeholder="Seu nome completo" required />
        <Modal.Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          required
        />
        <Modal.Input
          label="Mensagem"
          type="textarea"
          placeholder="Sua mensagem..."
          rows={4}
          required
        />
        <Modal.Footer>
          <Modal.Button variant="secondary">Cancelar</Modal.Button>
          <Modal.Button variant="primary">Enviar</Modal.Button>
        </Modal.Footer>
      </div>
    ),
  },
};

export const WithActions = {
  render: Template,
  args: {
    title: "Confirmar Ação",
    size: "sm",
    children: (
      <div>
        <p className="text-slate-300 mb-6">
          Tem certeza que deseja excluir este item? Esta ação não pode ser
          desfeita.
        </p>
        <Modal.Footer>
          <Modal.Button variant="secondary">Cancelar</Modal.Button>
          <Modal.Button variant="danger">Excluir</Modal.Button>
        </Modal.Footer>
      </div>
    ),
  },
};

export const NoCloseButton = {
  render: Template,
  args: {
    title: "Modal sem botão de fechar",
    showCloseButton: false,
    closeOnBackdrop: false,
    children: (
      <div>
        <p className="text-slate-300 mb-4">
          Este modal só pode ser fechado através dos botões de ação.
        </p>
        <Modal.Footer>
          <Modal.Button variant="primary">Confirmar</Modal.Button>
        </Modal.Footer>
      </div>
    ),
  },
};

export const LongContent = {
  render: Template,
  args: {
    title: "Modal com Conteúdo Longo",
    size: "lg",
    children: (
      <div>
        <p className="text-slate-300 mb-4">
          Este modal demonstra como o conteúdo longo é tratado com scroll.
        </p>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="mb-4 p-4 bg-slate-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">Item {i + 1}</h4>
            <p className="text-slate-300 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}
        <Modal.Footer>
          <Modal.Button variant="primary">Fechar</Modal.Button>
        </Modal.Footer>
      </div>
    ),
  },
};

// Showcase de todos os tamanhos
export const AllSizes = {
  render: () => {
    const [openModal, setOpenModal] = useState(null);
    const sizes = ["sm", "md", "lg", "xl", "full"];

    return (
      <div className="flex flex-wrap gap-4">
        {sizes.map((size) => (
          <div key={size}>
            <Button onClick={() => setOpenModal(size)}>
              Modal {size.toUpperCase()}
            </Button>
            <Modal
              isOpen={openModal === size}
              onClose={() => setOpenModal(null)}
              title={`Modal ${size.toUpperCase()}`}
              size={size}
            >
              <p className="text-slate-300">
                Este é um modal de tamanho {size}.
              </p>
              <Modal.Footer>
                <Modal.Button
                  variant="primary"
                  onClick={() => setOpenModal(null)}
                >
                  Fechar
                </Modal.Button>
              </Modal.Footer>
            </Modal>
          </div>
        ))}
      </div>
    );
  },
};
