import React from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './Tooltip';

// Componente específico para métricas NDVI
export const NDVITooltip = ({ children, ndviValue, className = '' }) => {
  const getNDVIExplanation = (value) => {
    const numValue = parseFloat(value);
    if (numValue >= 0.6) {
      return {
        status: 'Excelente',
        description: 'Vegetação densa e saudável. Área com boa cobertura vegetal.',
        color: 'text-green-400'
      };
    } else if (numValue >= 0.4) {
      return {
        status: 'Boa',
        description: 'Vegetação moderada. Área com cobertura vegetal adequada.',
        color: 'text-yellow-400'
      };
    } else if (numValue >= 0.2) {
      return {
        status: 'Baixa',
        description: 'Vegetação esparsa. Área com pouca cobertura vegetal.',
        color: 'text-orange-400'
      };
    } else {
      return {
        status: 'Crítica',
        description: 'Vegetação muito escassa ou ausente. Área degradada.',
        color: 'text-red-400'
      };
    }
  };

  const explanation = getNDVIExplanation(ndviValue);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center cursor-help ${className}`}>
            {children}
            <Info className="w-3 h-3 ml-1 text-slate-400 hover:text-slate-300 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm bg-slate-700 border-slate-600">
          <div className="space-y-2">
            <div className="font-semibold text-slate-200">
              NDVI (Índice de Vegetação por Diferença Normalizada)
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Valor:</span>
                <span className={`font-medium ${explanation.color}`}>{ndviValue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Status:</span>
                <span className={`font-medium ${explanation.color}`}>{explanation.status}</span>
              </div>
            </div>
            <div className="text-slate-300 text-xs leading-relaxed">
              {explanation.description}
            </div>
            <div className="text-slate-400 text-xs border-t border-slate-600 pt-2">
              Escala: -1 (água/nuvens) a +1 (vegetação densa)
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Componente específico para degradação
export const DegradationTooltip = ({ children, degradationLevel, className = '' }) => {
  const getDegradationExplanation = (level) => {
    switch (level.toLowerCase()) {
      case 'severa':
        return {
          description: 'Área com alta degradação ambiental. Requer ação imediata para recuperação.',
          actions: ['Replantio urgente', 'Controle de erosão', 'Monitoramento intensivo'],
          color: 'text-red-400'
        };
      case 'moderada':
        return {
          description: 'Área com degradação moderada. Necessita intervenção preventiva.',
          actions: ['Plantio de espécies nativas', 'Manejo sustentável', 'Monitoramento regular'],
          color: 'text-yellow-400'
        };
      case 'leve':
        return {
          description: 'Área com sinais iniciais de degradação. Prevenção é fundamental.',
          actions: ['Manutenção preventiva', 'Educação ambiental', 'Monitoramento periódico'],
          color: 'text-orange-400'
        };
      default:
        return {
          description: 'Área em bom estado de conservação.',
          actions: ['Manutenção regular', 'Monitoramento'],
          color: 'text-green-400'
        };
    }
  };

  const explanation = getDegradationExplanation(degradationLevel);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center cursor-help ${className}`}>
            {children}
            <HelpCircle className="w-3 h-3 ml-1 text-slate-400 hover:text-slate-300 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm bg-slate-700 border-slate-600">
          <div className="space-y-2">
            <div className="font-semibold text-slate-200">
              Nível de Degradação
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Status:</span>
              <span className={`font-medium ${explanation.color}`}>{degradationLevel}</span>
            </div>
            <div className="text-slate-300 text-xs leading-relaxed">
              {explanation.description}
            </div>
            <div className="space-y-1">
              <div className="text-slate-400 text-xs font-medium">Ações Recomendadas:</div>
              <ul className="text-slate-300 text-xs space-y-0.5">
                {explanation.actions.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-emerald-400 mr-1">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Componente para área
export const AreaTooltip = ({ children, areaValue, className = '' }) => {
  const formatArea = (area) => {
    const numArea = parseFloat(area);
    if (numArea >= 1) {
      return `${numArea.toFixed(1)} hectares`;
    } else {
      return `${(numArea * 10000).toFixed(0)} m²`;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center cursor-help ${className}`}>
            {children}
            <Info className="w-3 h-3 ml-1 text-slate-400 hover:text-slate-300 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-slate-700 border-slate-600">
          <div className="space-y-2">
            <div className="font-semibold text-slate-200">
              Área da Zona
            </div>
            <div className="text-slate-300 text-sm">
              {formatArea(areaValue)}
            </div>
            <div className="text-slate-400 text-xs leading-relaxed">
              Extensão total da área monitorada nesta zona prioritária.
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default { NDVITooltip, DegradationTooltip, AreaTooltip };