// Dados estáticos para Santa Cruz do Sul - RS
// Coordenadas: -29.7175, -52.4264

export const santaCruzDoSulData = {
  city: {
    name: 'Santa Cruz do Sul',
    state: 'Rio Grande do Sul',
    coordinates: {
      latitude: -29.7175,
      longitude: -52.4264
    },
    zoom: 13
  },

  // Dados NDVI por região da cidade
  ndviRegions: [
    {
      id: 'centro',
      name: 'Centro',
      coordinates: {
        latitude: -29.7175,
        longitude: -52.4264
      },
      ndvi: 0.35,
      status: 'moderate',
      description: 'Área urbana central com vegetação esparsa',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-52.4314, -29.7125],
          [-52.4214, -29.7125],
          [-52.4214, -29.7225],
          [-52.4314, -29.7225],
          [-52.4314, -29.7125]
        ]]
      }
    },
    {
      id: 'parque_da_cruz',
      name: 'Parque da Cruz',
      coordinates: {
        latitude: -29.7095,
        longitude: -52.4185
      },
      ndvi: 0.78,
      status: 'excellent',
      description: 'Área de preservação com densa cobertura vegetal',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-52.4235, -29.7045],
          [-52.4135, -29.7045],
          [-52.4135, -29.7145],
          [-52.4235, -29.7145],
          [-52.4235, -29.7045]
        ]]
      }
    },
    {
      id: 'zona_rural_norte',
      name: 'Zona Rural Norte',
      coordinates: {
        latitude: -29.6985,
        longitude: -52.4164
      },
      ndvi: 0.65,
      status: 'good',
      description: 'Área agrícola com cultivos de tabaco e milho',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-52.4314, -29.6935],
          [-52.4014, -29.6935],
          [-52.4014, -29.7035],
          [-52.4314, -29.7035],
          [-52.4314, -29.6935]
        ]]
      }
    },
    {
      id: 'bairro_industrial',
      name: 'Distrito Industrial',
      coordinates: {
        latitude: -29.7285,
        longitude: -52.4384
      },
      ndvi: 0.28,
      status: 'poor',
      description: 'Zona industrial com baixa cobertura vegetal',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-52.4434, -29.7235],
          [-52.4334, -29.7235],
          [-52.4334, -29.7335],
          [-52.4434, -29.7335],
          [-52.4434, -29.7235]
        ]]
      }
    },
    {
      id: 'mata_ciliar_pardinho',
      name: 'Mata Ciliar Rio Pardinho',
      coordinates: {
        latitude: -29.7355,
        longitude: -52.4124
      },
      ndvi: 0.82,
      status: 'excellent',
      description: 'Mata ciliar preservada ao longo do Rio Pardinho',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-52.4174, -29.7305],
          [-52.4074, -29.7305],
          [-52.4074, -29.7405],
          [-52.4174, -29.7405],
          [-52.4174, -29.7305]
        ]]
      }
    },
    {
      id: 'zona_rural_sul',
      name: 'Zona Rural Sul',
      coordinates: {
        latitude: -29.7465,
        longitude: -52.4264
      },
      ndvi: 0.58,
      status: 'good',
      description: 'Área mista com pastagens e cultivos',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-52.4314, -29.7415],
          [-52.4214, -29.7415],
          [-52.4214, -29.7515],
          [-52.4314, -29.7515],
          [-52.4314, -29.7415]
        ]]
      }
    }
  ],

  // Série temporal dos últimos 12 meses para Santa Cruz do Sul
  timeSeriesData: [
    { date: '2024-01-15', ndvi: 0.72, precipitation: 85.2, temperature: 28.5, cloudCoverage: 15 },
    { date: '2024-01-22', ndvi: 0.68, precipitation: 42.1, temperature: 30.2, cloudCoverage: 8 },
    { date: '2024-01-29', ndvi: 0.65, precipitation: 12.5, temperature: 32.1, cloudCoverage: 5 },
    { date: '2024-02-05', ndvi: 0.61, precipitation: 8.3, temperature: 31.8, cloudCoverage: 12 },
    { date: '2024-02-12', ndvi: 0.58, precipitation: 15.7, temperature: 29.4, cloudCoverage: 18 },
    { date: '2024-02-19', ndvi: 0.55, precipitation: 22.1, temperature: 27.6, cloudCoverage: 25 },
    { date: '2024-02-26', ndvi: 0.52, precipitation: 35.4, temperature: 25.8, cloudCoverage: 20 },
    { date: '2024-03-05', ndvi: 0.49, precipitation: 48.2, temperature: 23.2, cloudCoverage: 30 },
    { date: '2024-03-12', ndvi: 0.46, precipitation: 62.8, temperature: 21.5, cloudCoverage: 35 },
    { date: '2024-03-19', ndvi: 0.44, precipitation: 71.3, temperature: 19.8, cloudCoverage: 28 },
    { date: '2024-03-26', ndvi: 0.42, precipitation: 55.6, temperature: 18.2, cloudCoverage: 22 },
    { date: '2024-04-02', ndvi: 0.41, precipitation: 38.9, temperature: 16.7, cloudCoverage: 15 },
    { date: '2024-04-09', ndvi: 0.40, precipitation: 25.4, temperature: 15.3, cloudCoverage: 10 },
    { date: '2024-04-16', ndvi: 0.39, precipitation: 18.7, temperature: 14.1, cloudCoverage: 8 },
    { date: '2024-04-23', ndvi: 0.38, precipitation: 12.2, temperature: 13.5, cloudCoverage: 5 },
    { date: '2024-04-30', ndvi: 0.37, precipitation: 8.1, temperature: 12.8, cloudCoverage: 3 },
    { date: '2024-05-07', ndvi: 0.36, precipitation: 5.3, temperature: 12.2, cloudCoverage: 2 },
    { date: '2024-05-14', ndvi: 0.35, precipitation: 3.8, temperature: 11.9, cloudCoverage: 1 },
    { date: '2024-05-21', ndvi: 0.34, precipitation: 2.1, temperature: 11.5, cloudCoverage: 0 },
    { date: '2024-05-28', ndvi: 0.33, precipitation: 1.2, temperature: 11.2, cloudCoverage: 0 },
    { date: '2024-06-04', ndvi: 0.32, precipitation: 0.8, temperature: 10.8, cloudCoverage: 0 },
    { date: '2024-06-11', ndvi: 0.31, precipitation: 0.5, temperature: 10.5, cloudCoverage: 2 },
    { date: '2024-06-18', ndvi: 0.30, precipitation: 1.2, temperature: 10.2, cloudCoverage: 5 },
    { date: '2024-06-25', ndvi: 0.31, precipitation: 3.8, temperature: 10.8, cloudCoverage: 8 },
    { date: '2024-07-02', ndvi: 0.33, precipitation: 8.5, temperature: 12.1, cloudCoverage: 12 },
    { date: '2024-07-09', ndvi: 0.36, precipitation: 15.2, temperature: 14.3, cloudCoverage: 15 },
    { date: '2024-07-16', ndvi: 0.40, precipitation: 25.7, temperature: 16.8, cloudCoverage: 18 },
    { date: '2024-07-23', ndvi: 0.45, precipitation: 38.4, temperature: 19.2, cloudCoverage: 22 },
    { date: '2024-07-30', ndvi: 0.51, precipitation: 52.1, temperature: 21.5, cloudCoverage: 25 },
    { date: '2024-08-06', ndvi: 0.58, precipitation: 68.3, temperature: 23.8, cloudCoverage: 28 },
    { date: '2024-08-13', ndvi: 0.65, precipitation: 75.6, temperature: 25.9, cloudCoverage: 30 },
    { date: '2024-08-20', ndvi: 0.71, precipitation: 82.4, temperature: 27.8, cloudCoverage: 25 },
    { date: '2024-08-27', ndvi: 0.76, precipitation: 88.7, temperature: 29.4, cloudCoverage: 20 },
    { date: '2024-09-03', ndvi: 0.80, precipitation: 92.1, temperature: 30.8, cloudCoverage: 15 },
    { date: '2024-09-10', ndvi: 0.83, precipitation: 95.3, temperature: 31.9, cloudCoverage: 12 },
    { date: '2024-09-17', ndvi: 0.85, precipitation: 97.8, temperature: 32.7, cloudCoverage: 8 },
    { date: '2024-09-24', ndvi: 0.86, precipitation: 98.9, temperature: 33.2, cloudCoverage: 5 },
    { date: '2024-10-01', ndvi: 0.87, precipitation: 99.5, temperature: 33.5, cloudCoverage: 3 },
    { date: '2024-10-08', ndvi: 0.88, precipitation: 98.8, temperature: 33.1, cloudCoverage: 2 },
    { date: '2024-10-15', ndvi: 0.87, precipitation: 96.2, temperature: 32.4, cloudCoverage: 5 },
    { date: '2024-10-22', ndvi: 0.85, precipitation: 91.7, temperature: 31.2, cloudCoverage: 8 },
    { date: '2024-10-29', ndvi: 0.82, precipitation: 85.4, temperature: 29.8, cloudCoverage: 12 },
    { date: '2024-11-05', ndvi: 0.78, precipitation: 77.9, temperature: 28.1, cloudCoverage: 15 },
    { date: '2024-11-12', ndvi: 0.74, precipitation: 68.5, temperature: 26.3, cloudCoverage: 18 },
    { date: '2024-11-19', ndvi: 0.69, precipitation: 57.2, temperature: 24.4, cloudCoverage: 22 },
    { date: '2024-11-26', ndvi: 0.64, precipitation: 44.8, temperature: 22.6, cloudCoverage: 25 },
    { date: '2024-12-03', ndvi: 0.59, precipitation: 31.5, temperature: 20.9, cloudCoverage: 20 },
    { date: '2024-12-10', ndvi: 0.54, precipitation: 18.7, temperature: 19.4, cloudCoverage: 15 },
    { date: '2024-12-17', ndvi: 0.50, precipitation: 8.2, temperature: 18.2, cloudCoverage: 10 },
    { date: '2024-12-24', ndvi: 0.47, precipitation: 2.1, temperature: 17.5, cloudCoverage: 8 },
    { date: '2024-12-31', ndvi: 0.45, precipitation: 0.5, temperature: 17.1, cloudCoverage: 5 }
  ],

  // Recomendações específicas para Santa Cruz do Sul
  recommendations: {
    excellent: [
      'Mantenha o monitoramento regular da mata ciliar',
      'Continue as práticas de conservação atuais',
      'Considere expandir áreas de preservação'
    ],
    good: [
      'Implemente práticas de agricultura sustentável',
      'Considere corredores ecológicos entre fragmentos',
      'Monitore o uso de agrotóxicos'
    ],
    moderate: [
      'Aumente a cobertura vegetal urbana',
      'Implemente telhados e paredes verdes',
      'Crie mais áreas verdes públicas'
    ],
    poor: [
      'Urgente: implemente medidas de revegetação',
      'Reduza impermeabilização do solo',
      'Considere remediação ambiental'
    ]
  },

  // Alertas específicos para a região
  alerts: [
    {
      id: 'drought_risk',
      type: 'warning',
      title: 'Risco de Estiagem',
      description: 'Baixa precipitação prevista para os próximos 30 dias',
      severity: 'medium',
      date: '2024-01-15'
    },
    {
      id: 'vegetation_stress',
      type: 'info',
      title: 'Estresse Hídrico da Vegetação',
      description: 'NDVI em declínio na zona rural norte',
      severity: 'low',
      date: '2024-01-10'
    }
  ]
};

export default santaCruzDoSulData;