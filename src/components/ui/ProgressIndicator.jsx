import React from 'react';
import { CheckCircle, AlertCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const ProgressIndicator = ({ 
  progress = 0, 
  status = 'pending', 
  trend = 'stable',
  size = 'md',
  showPercentage = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-2 w-16',
    md: 'h-3 w-20',
    lg: 'h-4 w-24'
  };

  const statusConfig = {
    completed: {
      color: 'bg-green-500',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      icon: CheckCircle
    },
    in_progress: {
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      icon: Clock
    },
    critical: {
      color: 'bg-red-500',
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-400',
      icon: AlertCircle
    },
    pending: {
      color: 'bg-slate-500',
      bgColor: 'bg-slate-500/20',
      textColor: 'text-slate-400',
      icon: Clock
    }
  };

  const trendConfig = {
    improving: {
      icon: TrendingUp,
      color: 'text-green-400'
    },
    declining: {
      icon: TrendingDown,
      color: 'text-red-400'
    },
    stable: {
      icon: null,
      color: 'text-slate-400'
    }
  };

  const config = statusConfig[status];
  const trendInfo = trendConfig[trend];
  const StatusIcon = config.icon;
  const TrendIcon = trendInfo.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Icon */}
      <div className={`flex items-center justify-center w-5 h-5 rounded-full ${config.bgColor}`}>
        <StatusIcon className={`w-3 h-3 ${config.textColor}`} />
      </div>

      {/* Progress Bar */}
      <div className={`relative ${sizeClasses[size]} ${config.bgColor} rounded-full overflow-hidden`}>
        <div 
          className={`absolute top-0 left-0 h-full ${config.color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Percentage */}
      {showPercentage && (
        <span className={`text-xs font-medium ${config.textColor} min-w-[2rem]`}>
          {progress}%
        </span>
      )}

      {/* Trend Indicator */}
      {TrendIcon && (
        <div className="flex items-center">
          <TrendIcon className={`w-3 h-3 ${trendInfo.color}`} />
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;