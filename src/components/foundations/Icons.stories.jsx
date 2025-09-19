import React, { useState } from 'react';

export default {
  title: 'Foundations/Icons',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sistema de ícones do OrBee.Online organizados por contexto e funcionalidade.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showContextColors: {
      control: { type: 'boolean' },
      description: 'Exibir cores por contexto',
    },
    showIconSizes: {
      control: { type: 'boolean' },
      description: 'Exibir variações de tamanho',
    },
    interactiveMode: {
      control: { type: 'boolean' },
      description: 'Modo interativo com hover',
    },
  },
};

// Componente de ícone base
const Icon = ({ name, size = 20, color = 'currentColor', className = '', ...props }) => {
  const iconPaths = {
    // Características da Região
    'map-pin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    'mountain': 'M8 21l4-7 4 7H8z M12 14l-4-7h8l-4 7z',
    'droplets': 'M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.19 3 12.25c0 2.22 1.8 4.05 4 4.05z M12.56 6.6A13.1 13.1 0 0 0 9 2.05c-.17-.38-.56-.67-1-.67s-.83.29-1 .67A13.1 13.1 0 0 0 3.44 6.6C2.55 7.4 2 8.5 2 9.8c0 3.28 2.22 5.92 5 5.92s5-2.64 5-5.92c0-1.3-.55-2.4-1.44-3.2z',
    'thermometer': 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z',
    'cloud-rain': 'M16 13v8l-4-3-4 3v-8 M20 16v-2a4 4 0 0 0-4-4V8a4 4 0 0 0-8 0v2a4 4 0 0 0-4 4v2',
    'sun': 'M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 6.34L4.93 4.93 M19.07 19.07l-1.41-1.41 M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
    
    // Saúde da Mata Ciliar
    'leaf': 'M11 20A7 7 0 0 1 9.8 6.1C15.1 5 20 9.5 20 15a7 7 0 0 1-9 5z M2 21c0-3 1.85-5.36 5.08-6.47',
    'tree-pine': 'M17 21v-3 M7 21v-3 M12 2l-4 6h8l-4-6z M12 8l-3 4h6l-3-4z M12 12l-2 3h4l-2-3z',
    'sprout': 'M7 20h10 M10 20c5.5-2.5.8-6.4 3-10 M12 2c1.5 3.5 3.5 8.5 0 18 M12 2c-1.5 3.5-3.5 8.5 0 18',
    'flower': 'M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7.5 M12 16.5v1.77c.6.34 1 .99 1 1.73a2 2 0 1 1-2-2c0-.74.4-1.39 1-1.73z M22 12a2 2 0 0 1-2 2c-.74 0-1.39-.4-1.73-1H16.5 M7.5 12H5.73C5.39 11.4 4.74 11 4 11a2 2 0 1 1 2 2c.74 0 1.39-.4 1.73-1z',
    'seedling': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
    'trees': 'M10 10v.01 M14 14v.01 M18 6v.01 M6 18v.01',
    
    // Ações Necessárias
    'shield-check': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
    'hammer': 'M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0-.83-.83-.83-2.17 0-3L12 9 M9 7L7 9l-1.5-1.5a2.12 2.12 0 0 1 0-3L7 3l2 2h3l-3 2z',
    'wrench': 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    'recycle': 'M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5 M11 19h8.203a1.83 1.83 0 0 0 1.556-.83 1.784 1.784 0 0 0 0-1.831L14.54 4.5 M14 16l-3-3 3-3 M17 8l3 3-3 3',
    'plant': 'M7 20h10 M10 20c5.5-2.5.8-6.4 3-10 M12 2c1.5 3.5 3.5 8.5 0 18',
    'water': 'M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.19 3 12.25c0 2.22 1.8 4.05 4 4.05z',
    'shovel': 'M2 22v-5l5-5 2-2 3-3 6 6-3 3-2 2-5 5-5-1z M4.5 17.5L10 12',
    
    // Interface e Navegação
    'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
    'search': 'M11 11m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0 M21 21l-4.35-4.35',
    'filter': 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
    'settings': 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'menu': 'M3 12h18 M3 6h18 M3 18h18',
    'x': 'M18 6L6 18 M6 6l12 12',
    'chevron-right': 'M9 18l6-6-6-6',
    'chevron-left': 'M15 18l-6-6 6-6',
    'chevron-up': 'M18 15l-6-6-6 6',
    'chevron-down': 'M6 9l6 6 6-6',
    
    // Status e Feedback
    'check': 'M20 6L9 17l-5-5',
    'alert-triangle': 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
    'info': 'M12 16v-4 M12 8h.01 M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z',
    'bell': 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
    'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    
    // Dados e Analytics
    'bar-chart': 'M12 20V10 M18 20V4 M6 20v-6',
    'trending-up': 'M22 7l-8.5 8.5-4-4L2 19 M16 7h6v6',
    'trending-down': 'M22 17l-8.5-8.5-4 4L2 5 M16 17h6v-6',
    'activity': 'M22 12h-4l-3 9L9 3l-3 9H2',
    'pie-chart': 'M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z',
    'calendar': 'M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z M8 2v4 M16 2v4 M3 10h18',
    'clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {iconPaths[name]?.split(' M ').map((path, index) => (
        <path key={index} d={index === 0 ? path : `M ${path}`} />
      ))}
    </svg>
  );
};

// Componente de categoria de ícones
const IconCategory = ({ title, description, icons, contextColor, showColors, showSizes, interactive }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  
  const colorClasses = {
    emerald: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10',
    blue: 'text-blue-400 border-blue-400/30 bg-blue-500/10',
    purple: 'text-purple-400 border-purple-400/30 bg-purple-500/10',
    orange: 'text-orange-400 border-orange-400/30 bg-orange-500/10',
    yellow: 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10',
    cyan: 'text-cyan-400 border-cyan-400/30 bg-cyan-500/10',
    slate: 'text-slate-400 border-slate-400/30 bg-slate-500/10',
  };
  
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-300 text-sm">{description}</p>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {icons.map((icon, index) => (
          <div
            key={index}
            className={`
              relative flex flex-col items-center p-4 rounded-lg border transition-all duration-200
              ${showColors ? colorClasses[contextColor] : 'text-slate-400 border-slate-600/50 bg-slate-700/30'}
              ${interactive ? 'hover:scale-110 hover:shadow-lg cursor-pointer' : ''}
              ${hoveredIcon === icon.name ? 'ring-2 ring-current/50' : ''}
            `}
            onMouseEnter={() => interactive && setHoveredIcon(icon.name)}
            onMouseLeave={() => interactive && setHoveredIcon(null)}
          >
            <Icon 
              name={icon.name} 
              size={showSizes ? (hoveredIcon === icon.name ? 28 : 24) : 24}
              className="mb-2 transition-all duration-200"
            />
            <span className="text-xs text-center font-medium">{icon.label}</span>
            {icon.usage && (
              <span className="text-xs text-center opacity-70 mt-1">{icon.usage}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de demonstração de tamanhos
const IconSizeDemo = ({ iconName, label }) => {
  const sizes = [
    { size: 16, label: 'SM' },
    { size: 20, label: 'MD' },
    { size: 24, label: 'LG' },
    { size: 32, label: 'XL' },
    { size: 40, label: '2XL' },
  ];
  
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">{label}</h3>
      <div className="flex items-center justify-between">
        {sizes.map((sizeConfig, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-lg border border-slate-600/50">
              <Icon name={iconName} size={sizeConfig.size} className="text-emerald-400" />
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-white">{sizeConfig.label}</div>
              <div className="text-xs text-slate-400">{sizeConfig.size}px</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Default = {
  args: {
    showContextColors: true,
    showIconSizes: false,
    interactiveMode: true,
  },
  render: ({ showContextColors, showIconSizes, interactiveMode }) => {
    const iconCategories = [
      {
        title: 'Características da Região',
        description: 'Ícones para representar aspectos geográficos e climáticos',
        contextColor: 'emerald',
        icons: [
          { name: 'map-pin', label: 'Localização', usage: 'Pontos no mapa' },
          { name: 'mountain', label: 'Relevo', usage: 'Topografia' },
          { name: 'droplets', label: 'Umidade', usage: 'Níveis de água' },
          { name: 'thermometer', label: 'Temperatura', usage: 'Clima' },
          { name: 'cloud-rain', label: 'Precipitação', usage: 'Chuva' },
          { name: 'sun', label: 'Radiação Solar', usage: 'Insolação' },
        ],
      },
      {
        title: 'Saúde da Mata Ciliar',
        description: 'Ícones para indicar estado e condições da vegetação',
        contextColor: 'blue',
        icons: [
          { name: 'leaf', label: 'Folhagem', usage: 'Densidade foliar' },
          { name: 'tree-pine', label: 'Árvores', usage: 'Cobertura arbórea' },
          { name: 'sprout', label: 'Crescimento', usage: 'Regeneração' },
          { name: 'flower', label: 'Floração', usage: 'Biodiversidade' },
          { name: 'seedling', label: 'Mudas', usage: 'Plantio' },
          { name: 'trees', label: 'Floresta', usage: 'Área florestal' },
        ],
      },
      {
        title: 'Ações Necessárias',
        description: 'Ícones para representar intervenções e cuidados',
        contextColor: 'purple',
        icons: [
          { name: 'shield-check', label: 'Proteção', usage: 'Conservação' },
          { name: 'hammer', label: 'Construção', usage: 'Infraestrutura' },
          { name: 'wrench', label: 'Manutenção', usage: 'Reparos' },
          { name: 'recycle', label: 'Sustentabilidade', usage: 'Reciclagem' },
          { name: 'plant', label: 'Plantio', usage: 'Reflorestamento' },
          { name: 'water', label: 'Irrigação', usage: 'Manejo hídrico' },
          { name: 'shovel', label: 'Trabalho Manual', usage: 'Intervenção' },
        ],
      },
      {
        title: 'Interface e Navegação',
        description: 'Ícones para elementos de interface do usuário',
        contextColor: 'orange',
        icons: [
          { name: 'home', label: 'Início', usage: 'Página principal' },
          { name: 'search', label: 'Buscar', usage: 'Pesquisa' },
          { name: 'filter', label: 'Filtrar', usage: 'Filtros' },
          { name: 'settings', label: 'Configurações', usage: 'Ajustes' },
          { name: 'menu', label: 'Menu', usage: 'Navegação' },
          { name: 'x', label: 'Fechar', usage: 'Cancelar' },
          { name: 'chevron-right', label: 'Próximo', usage: 'Avançar' },
          { name: 'chevron-left', label: 'Anterior', usage: 'Voltar' },
        ],
      },
      {
        title: 'Status e Feedback',
        description: 'Ícones para comunicar estados e notificações',
        contextColor: 'yellow',
        icons: [
          { name: 'check', label: 'Sucesso', usage: 'Confirmação' },
          { name: 'alert-triangle', label: 'Atenção', usage: 'Aviso' },
          { name: 'info', label: 'Informação', usage: 'Detalhes' },
          { name: 'bell', label: 'Notificação', usage: 'Alertas' },
          { name: 'heart', label: 'Favorito', usage: 'Curtir' },
          { name: 'star', label: 'Destaque', usage: 'Avaliação' },
        ],
      },
      {
        title: 'Dados e Analytics',
        description: 'Ícones para visualização de dados e métricas',
        contextColor: 'cyan',
        icons: [
          { name: 'bar-chart', label: 'Gráfico', usage: 'Estatísticas' },
          { name: 'trending-up', label: 'Crescimento', usage: 'Tendência positiva' },
          { name: 'trending-down', label: 'Declínio', usage: 'Tendência negativa' },
          { name: 'activity', label: 'Atividade', usage: 'Monitoramento' },
          { name: 'pie-chart', label: 'Distribuição', usage: 'Proporções' },
          { name: 'calendar', label: 'Cronograma', usage: 'Datas' },
          { name: 'clock', label: 'Tempo', usage: 'Histórico' },
        ],
      },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-transparent mb-4">
              Sistema de Ícones OrBee.Online
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Biblioteca de ícones organizados por contexto e funcionalidade
            </p>
          </div>

          {/* Demonstração de Tamanhos */}
          {showIconSizes && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6">Variações de Tamanho</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <IconSizeDemo iconName="leaf" label="Ícone de Folhagem" />
                <IconSizeDemo iconName="shield-check" label="Ícone de Proteção" />
              </div>
            </div>
          )}

          {/* Categorias de Ícones */}
          <div className="space-y-8">
            {iconCategories.map((category, index) => (
              <IconCategory
                key={index}
                {...category}
                showColors={showContextColors}
                showSizes={showIconSizes}
                interactive={interactiveMode}
              />
            ))}
          </div>

          {/* Guia de Uso */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold text-white mb-6">Como Usar</h2>
              <div className="space-y-4 text-sm">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h3 className="text-emerald-300 font-medium mb-2">Importação</h3>
                  <code className="text-slate-300">
                    <span className="text-blue-400">import</span> {`{ Icon }`} <span className="text-blue-400">from</span> <span className="text-green-400">'./Icon'</span>
                  </code>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h3 className="text-emerald-300 font-medium mb-2">Uso Básico</h3>
                  <code className="text-slate-300">
                    {`<Icon name="leaf" size={24} className="text-emerald-400" />`}
                  </code>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h3 className="text-emerald-300 font-medium mb-2">Com Cores de Contexto</h3>
                  <code className="text-slate-300">
                    {`<Icon name="shield-check" className="text-purple-400" />`}
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold text-white mb-6">Boas Práticas</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Icon name="check" size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Use cores consistentes por contexto</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Mantenha tamanhos proporcionais ao conteúdo</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Escolha ícones semanticamente corretos</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Teste legibilidade em diferentes fundos</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="check" size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Considere acessibilidade e contraste</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mapeamento de Cores por Contexto */}
          <div className="mt-12 bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-6">Mapeamento de Cores por Contexto</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-emerald-400 rounded"></div>
                  <span className="text-slate-300 text-sm">Características da Região</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span className="text-slate-300 text-sm">Saúde da Mata Ciliar</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-400 rounded"></div>
                  <span className="text-slate-300 text-sm">Ações Necessárias</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  <span className="text-slate-300 text-sm">Interface e Navegação</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-slate-300 text-sm">Status e Feedback</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-cyan-400 rounded"></div>
                  <span className="text-slate-300 text-sm">Dados e Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const ByContext = {
  args: {
    showContextColors: true,
    showIconSizes: false,
    interactiveMode: false,
  },
  render: Default.render,
};

export const SizeVariations = {
  args: {
    showContextColors: false,
    showIconSizes: true,
    interactiveMode: false,
  },
  render: Default.render,
};

export const InteractiveMode = {
  args: {
    showContextColors: true,
    showIconSizes: true,
    interactiveMode: true,
  },
  render: Default.render,
};

export const MinimalView = {
  args: {
    showContextColors: false,
    showIconSizes: false,
    interactiveMode: false,
  },
  render: Default.render,
};