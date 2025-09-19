import React from 'react';

export default {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sistema tipográfico do OrBee.Online com hierarquia de títulos, textos de dados e padrões de legibilidade.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showSizes: {
      control: { type: 'boolean' },
      description: 'Exibir tamanhos das fontes',
    },
    showColors: {
      control: { type: 'boolean' },
      description: 'Exibir variações de cores',
    },
    showUsage: {
      control: { type: 'boolean' },
      description: 'Exibir contextos de uso',
    },
  },
};

const TypographyExample = ({ 
  text, 
  className, 
  description, 
  usage, 
  size, 
  showSizes, 
  showColors, 
  showUsage 
}) => (
  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm mb-4">
    <div className="mb-4">
      <div className={className}>{text}</div>
    </div>
    <div className="space-y-2">
      <p className="text-slate-300 text-sm">{description}</p>
      <code className="text-emerald-400 text-xs font-mono block">{className}</code>
      {showSizes && size && (
        <p className="text-slate-400 text-xs">Tamanho: {size}</p>
      )}
      {showUsage && usage && (
        <p className="text-slate-400 text-xs italic">Uso: {usage}</p>
      )}
    </div>
  </div>
);

const ColorVariation = ({ baseClass, colorClass, label }) => (
  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
    <div className={`${baseClass} ${colorClass} mb-2`}>
      Exemplo de texto
    </div>
    <p className="text-slate-400 text-xs">{label}</p>
    <code className="text-emerald-400 text-xs font-mono">{colorClass}</code>
  </div>
);

export const Default = {
  args: {
    showSizes: false,
    showColors: false,
    showUsage: false,
  },
  render: ({ showSizes, showColors, showUsage }) => {
    const headingHierarchy = [
      {
        text: 'Título Principal da Seção',
        className: 'mb-4 bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-2xl font-semibold text-transparent',
        description: 'Título principal usado em seções importantes',
        usage: 'Headers de seções, títulos de páginas',
        size: '24px (text-2xl)',
      },
      {
        text: 'Título do Card',
        className: 'mb-3 text-lg font-semibold text-white',
        description: 'Título padrão para cards e componentes',
        usage: 'Títulos de cards, componentes principais',
        size: '18px (text-lg)',
      },
      {
        text: 'Subtítulo de Seção',
        className: 'text-base font-medium text-white',
        description: 'Subtítulos e headers secundários',
        usage: 'Subtítulos, categorias, grupos de dados',
        size: '16px (text-base)',
      },
    ];

    const dataTexts = [
      {
        text: 'Dado Principal',
        className: 'mb-2 text-lg font-light text-white',
        description: 'Valores principais em cards de dados',
        usage: 'Métricas principais, valores destacados',
        size: '18px (text-lg)',
      },
      {
        text: 'Rótulo de Dados',
        className: 'text-slate-300 text-sm',
        description: 'Labels e descrições de dados',
        usage: 'Labels de campos, descrições',
        size: '14px (text-sm)',
      },
      {
        text: 'Valor de Dados',
        className: 'text-emerald-300 font-medium',
        description: 'Valores específicos com destaque',
        usage: 'Valores numéricos, status importantes',
        size: '16px (text-base)',
      },
    ];

    const supportTexts = [
      {
        text: 'Subtítulo',
        className: 'text-xs text-emerald-300',
        description: 'Subtítulos e informações secundárias',
        usage: 'Status, categorias, badges',
        size: '12px (text-xs)',
      },
      {
        text: 'Metadado',
        className: 'text-xs text-slate-400',
        description: 'Informações de apoio e timestamps',
        usage: 'Timestamps, metadados, informações auxiliares',
        size: '12px (text-xs)',
      },
      {
        text: 'Texto de Apoio',
        className: 'text-xs text-slate-400',
        description: 'Informações adicionais e explicativas',
        usage: 'Descrições detalhadas, notas explicativas',
        size: '12px (text-xs)',
      },
    ];

    const colorVariations = [
      { baseClass: 'text-lg font-medium', colorClass: 'text-white', label: 'Texto Principal' },
      { baseClass: 'text-sm', colorClass: 'text-slate-300', label: 'Texto Secundário' },
      { baseClass: 'text-sm', colorClass: 'text-slate-400', label: 'Texto de Apoio' },
      { baseClass: 'text-sm font-medium', colorClass: 'text-emerald-300', label: 'Texto de Destaque' },
      { baseClass: 'text-sm font-medium', colorClass: 'text-green-300', label: 'Texto Verde' },
      { baseClass: 'text-sm font-medium', colorClass: 'text-blue-300', label: 'Texto Azul' },
      { baseClass: 'text-sm font-medium', colorClass: 'text-red-300', label: 'Texto Vermelho' },
      { baseClass: 'text-sm font-medium', colorClass: 'text-yellow-300', label: 'Texto Amarelo' },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-transparent mb-4">
              Sistema Tipográfico OrBee.Online
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Hierarquia tipográfica consistente para garantir legibilidade e organização visual
            </p>
          </div>

          {/* Hierarquia de Títulos */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Hierarquia de Títulos</h2>
            <div className="space-y-4">
              {headingHierarchy.map((item, index) => (
                <TypographyExample
                  key={index}
                  {...item}
                  showSizes={showSizes}
                  showColors={showColors}
                  showUsage={showUsage}
                />
              ))}
            </div>
          </div>

          {/* Textos de Dados */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Textos de Dados</h2>
            <div className="space-y-4">
              {dataTexts.map((item, index) => (
                <TypographyExample
                  key={index}
                  {...item}
                  showSizes={showSizes}
                  showColors={showColors}
                  showUsage={showUsage}
                />
              ))}
            </div>
          </div>

          {/* Textos de Apoio */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Textos de Apoio</h2>
            <div className="space-y-4">
              {supportTexts.map((item, index) => (
                <TypographyExample
                  key={index}
                  {...item}
                  showSizes={showSizes}
                  showColors={showColors}
                  showUsage={showUsage}
                />
              ))}
            </div>
          </div>

          {/* Variações de Cores */}
          {showColors && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6">Variações de Cores</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {colorVariations.map((variation, index) => (
                  <ColorVariation key={index} {...variation} />
                ))}
              </div>
            </div>
          )}

          {/* Exemplo Prático */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-6">Exemplo Prático</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card de Exemplo */}
              <div className="group relative overflow-hidden rounded-2xl border border-green-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl">
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl border border-green-400/30 bg-green-500/20 p-3 backdrop-blur-sm">
                      <div className="h-5 w-5 bg-green-400 rounded"></div>
                    </div>
                    <span className="rounded-full border border-green-400/30 bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300 backdrop-blur-sm">
                      Saudável
                    </span>
                  </div>
                  
                  {/* Título do Card */}
                  <h4 className="mb-3 text-lg font-semibold text-white">Mata Ciliar - Setor Norte</h4>
                  
                  {/* Dados Principais */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 text-sm">NDVI Atual</span>
                      <span className="text-green-300 font-medium">0.68</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 text-sm">Área Monitorada</span>
                      <span className="text-green-300 font-medium">2.4 ha</span>
                    </div>
                  </div>
                  
                  {/* Separador */}
                  <div className="mt-3 pt-3 border-t border-green-400/20">
                    <p className="text-xs text-slate-400">Última atualização: 2 horas atrás</p>
                  </div>
                </div>
              </div>

              {/* Demonstração de Hierarquia */}
              <div className="space-y-4">
                <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
                  <h3 className="mb-4 bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-2xl font-semibold text-transparent">
                    Título Principal
                  </h3>
                  <h4 className="mb-3 text-lg font-semibold text-white">
                    Título do Card
                  </h4>
                  <div className="mb-2 text-lg font-light text-white">
                    Dado Principal: 85%
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-300 text-sm block">Rótulo de dados</span>
                    <span className="text-emerald-300 font-medium block">Valor destacado</span>
                    <div className="text-xs text-emerald-300">Subtítulo</div>
                    <div className="text-xs text-slate-400">Metadado adicional</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guia de Boas Práticas */}
          <div className="mt-12 bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-6">Boas Práticas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-300 mb-3">✅ Faça</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Use a hierarquia definida consistentemente</li>
                  <li>• Mantenha contraste adequado para legibilidade</li>
                  <li>• Use font-weight para criar hierarquia visual</li>
                  <li>• Aplique cores semânticas apropriadas</li>
                  <li>• Teste em diferentes tamanhos de tela</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-300 mb-3">❌ Evite</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Misturar diferentes hierarquias no mesmo contexto</li>
                  <li>• Usar cores com baixo contraste</li>
                  <li>• Aplicar muitos pesos de fonte diferentes</li>
                  <li>• Ignorar a responsividade dos textos</li>
                  <li>• Usar tamanhos de fonte muito pequenos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const MobileView = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const ResponsiveDemo = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

export const InteractiveDemo = {
  args: {
    showSizes: true,
    showColors: true,
    showUsage: true,
  },
  render: Default.render,
};