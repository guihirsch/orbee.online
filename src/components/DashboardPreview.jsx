import React, { useState, useEffect } from 'react';

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState('ndvi');
  const [animatedValues, setAnimatedValues] = useState({
    ndvi: 0,
    alerts: 0,
    communities: 0
  });

  // Animação dos números
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        ndvi: 0.72,
        alerts: 3,
        communities: 127
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const ndviData = [
    { month: 'Jan', value: 0.65 },
    { month: 'Fev', value: 0.68 },
    { month: 'Mar', value: 0.71 },
    { month: 'Abr', value: 0.69 },
    { month: 'Mai', value: 0.72 },
    { month: 'Jun', value: 0.74 }
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Redução de 5% na cobertura vegetal - Setor Norte', time: '2h atrás' },
    { id: 2, type: 'info', message: 'Nova validação comunitária recebida', time: '4h atrás' },
    { id: 3, type: 'success', message: 'Melhoria detectada na mata ciliar - Rio Verde', time: '1d atrás' }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">OrBee Dashboard</h2>
              <p className="text-green-100 text-sm">Monitoramento em Tempo Real</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-8">
          {[
            { id: 'ndvi', label: 'Mapa NDVI', icon: '🗺️' },
            { id: 'analytics', label: 'Análises', icon: '📊' },
            { id: 'alerts', label: 'Alertas', icon: '🔔' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'ndvi' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">NDVI Médio</p>
                    <p className="text-3xl font-bold text-green-700 transition-all duration-1000">
                      {animatedValues.ndvi.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-green-600 text-xs mt-2">+2.8% vs mês anterior</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Alertas Ativos</p>
                    <p className="text-3xl font-bold text-blue-700 transition-all duration-1000">
                      {animatedValues.alerts}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 17H7l5 5v-5z" />
                    </svg>
                  </div>
                </div>
                <p className="text-blue-600 text-xs mt-2">Requer atenção</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Comunidades</p>
                    <p className="text-3xl font-bold text-purple-700 transition-all duration-1000">
                      {animatedValues.communities}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-purple-600 text-xs mt-2">Participando ativamente</p>
              </div>
            </div>

            {/* Mapa NDVI Simulado */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Mapa NDVI - Região Selecionada</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Baixo (0.0-0.3)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Médio (0.3-0.6)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Alto (0.6-1.0)</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-8 gap-1 h-48">
                {Array.from({ length: 64 }, (_, i) => {
                  const value = Math.random();
                  let bgColor = 'bg-red-300';
                  if (value > 0.3) bgColor = 'bg-yellow-300';
                  if (value > 0.6) bgColor = 'bg-green-300';
                  if (value > 0.8) bgColor = 'bg-green-500';
                  
                  return (
                    <div
                      key={i}
                      className={`${bgColor} rounded-sm hover:scale-110 transition-transform cursor-pointer`}
                      title={`NDVI: ${value.toFixed(2)}`}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Evolução Temporal NDVI</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-end space-x-4 h-48">
                {ndviData.map((item, index) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-1000 hover:from-green-600 hover:to-green-500 cursor-pointer"
                      style={{ height: `${item.value * 200}px` }}
                      title={`${item.month}: ${item.value}`}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Alertas Recentes</h3>
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPreview;