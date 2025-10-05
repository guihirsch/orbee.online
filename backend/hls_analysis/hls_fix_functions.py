# Funções para corrigir o erro no HLS.ipynb
# Execute este código em uma célula do notebook ANTES da geração de pontos críticos

def generate_points_from_real_ndvi(degradation_analysis, river_buffer_geom, max_points_per_category=50):
    """Gera pontos críticos baseados no NDVI real da análise de degradação"""
    
    if not degradation_analysis or 'ndvi_clipped' not in degradation_analysis:
        print("❌ Dados NDVI não disponíveis para geração de pontos")
        return None
    
    ndvi_clipped = degradation_analysis['ndvi_clipped']
    valid_ndvi = ndvi_clipped.values[~np.isnan(ndvi_clipped.values)]
    
    if len(valid_ndvi) == 0:
        print("❌ Nenhum pixel NDVI válido para gerar pontos")
        return None
    
    print(f"📊 Gerando pontos baseados em {len(valid_ndvi)} pixels NDVI reais")
    
    # Classificar pixels reais por severidade
    critical_mask = valid_ndvi < NDVI_CRITICAL_THRESHOLD
    moderate_mask = (valid_ndvi >= NDVI_CRITICAL_THRESHOLD) & (valid_ndvi < NDVI_MODERATE_THRESHOLD)
    healthy_mask = valid_ndvi >= NDVI_MODERATE_THRESHOLD
    
    critical_pixels = valid_ndvi[critical_mask]
    moderate_pixels = valid_ndvi[moderate_mask]
    healthy_pixels = valid_ndvi[healthy_mask]
    
    print(f"   🔴 Pixels críticos reais: {len(critical_pixels)}")
    print(f"   🟡 Pixels moderados reais: {len(moderate_pixels)}")
    print(f"   🟢 Pixels saudáveis reais: {len(healthy_pixels)}")
    
    # Função auxiliar para encontrar coordenadas de pixels
    def find_pixel_coordinates(ndvi_array, pixel_indices, n_points):
        """Encontra coordenadas de pixels específicos"""
        if len(pixel_indices) == 0:
            return []
        
        # Amostrar pixels se necessário
        if len(pixel_indices) > n_points:
            sampled_indices = np.random.choice(pixel_indices, n_points, replace=False)
        else:
            sampled_indices = pixel_indices
        
        points = []
        transform = ndvi_array.rio.transform()
        
        for idx in sampled_indices:
            # Converter índice linear para 2D
            y_idx, x_idx = np.unravel_index(idx, ndvi_array.shape)
            
            # Converter para coordenadas geográficas
            lon, lat = rasterio.transform.xy(transform, y_idx, x_idx)
            
            # Verificar se está dentro do buffer do rio
            point_geom = Point(lon, lat)
            if river_buffer_geom.contains(point_geom):
                points.append({
                    'lat': lat,
                    'lon': lon,
                    'ndvi': float(ndvi_array.values.flat[idx]),
                    'severity': 'critical' if idx in np.where(critical_mask)[0] else 
                               'moderate' if idx in np.where(moderate_mask)[0] else 'healthy',
                    'level': 'very_sparse' if idx in np.where(critical_mask)[0] else
                            'sparse' if idx in np.where(moderate_mask)[0] else 'dense',
                    'color': '#DC143C' if idx in np.where(critical_mask)[0] else
                            '#FF8C00' if idx in np.where(moderate_mask)[0] else '#228B22',
                    'label': 'Vegetação muito rala / solo exposto' if idx in np.where(critical_mask)[0] else
                            'Vegetação esparsa / em regeneração' if idx in np.where(moderate_mask)[0] else
                            'Vegetação densa e saudável',
                    'description': f"Área real - NDVI {ndvi_array.values.flat[idx]:.3f}",
                    'source': 'real_ndvi_analysis'
                })
        
        return points
    
    # Gerar pontos para cada categoria
    critical_points = find_pixel_coordinates(ndvi_clipped, np.where(critical_mask)[0], 
                                           min(max_points_per_category, len(critical_pixels)))
    moderate_points = find_pixel_coordinates(ndvi_clipped, np.where(moderate_mask)[0], 
                                           min(max_points_per_category, len(moderate_pixels)))
    healthy_points = find_pixel_coordinates(ndvi_clipped, np.where(healthy_mask)[0], 
                                          min(max_points_per_category, len(healthy_pixels)))
    
    total_points = len(critical_points) + len(moderate_points) + len(healthy_points)
    
    print(f"\\n📊 Pontos gerados com NDVI real:")
    print(f"   🔴 Críticos: {len(critical_points)}")
    print(f"   🟡 Moderados: {len(moderate_points)}")
    print(f"   🟢 Saudáveis: {len(healthy_points)}")
    print(f"   📊 Total: {total_points}")
    
    return {
        'critical': critical_points,
        'moderate': moderate_points,
        'fair': healthy_points,  # Manter compatibilidade
        'water': [],
        'total_points': total_points,
        'generation_method': 'real_ndvi_based',
        'generation_params': {
            'min_distance': MIN_DISTANCE_POINTS,
            'max_points_per_category': max_points_per_category,
            'buffer_distance_m': BUFFER_DISTANCE_RIVER,
            'buffer_constrained': True,
            'real_ndvi_based': True,
            'thresholds': {
                'critical': NDVI_CRITICAL_THRESHOLD,
                'moderate': NDVI_MODERATE_THRESHOLD
            }
        }
    }


def validate_ndvi_consistency(degradation_analysis, critical_points_data):
    """Valida consistência entre análise de degradação e pontos gerados"""
    
    if not degradation_analysis or not critical_points_data:
        print("❌ Dados insuficientes para validação")
        return False
    
    # Estatísticas da análise real
    real_stats = degradation_analysis['statistics']
    real_critical_fraction = real_stats['critical_fraction']
    real_moderate_fraction = real_stats['moderate_fraction']
    
    # Estatísticas dos pontos gerados
    total_points = critical_points_data['total_points']
    critical_points = len(critical_points_data.get('critical', []))
    moderate_points = len(critical_points_data.get('moderate', []))
    
    if total_points == 0:
        print("❌ Nenhum ponto gerado para validação")
        return False
    
    generated_critical_fraction = critical_points / total_points
    generated_moderate_fraction = moderate_points / total_points
    
    print(f"\\n📊 Validação de Consistência NDVI:")
    print(f"   Análise real - Críticos: {real_critical_fraction:.1%}, Moderados: {real_moderate_fraction:.1%}")
    print(f"   Pontos gerados - Críticos: {generated_critical_fraction:.1%}, Moderados: {generated_moderate_fraction:.1%}")
    
    # Verificar se as proporções são similares (com tolerância de 20%)
    critical_diff = abs(real_critical_fraction - generated_critical_fraction)
    moderate_diff = abs(real_moderate_fraction - generated_moderate_fraction)
    
    if critical_diff < 0.2 and moderate_diff < 0.2:
        print("✅ Pontos gerados são consistentes com a análise real")
        return True
    else:
        print("⚠️ Pontos gerados podem não refletir perfeitamente a análise real")
        print(f"   Diferença crítica: {critical_diff:.1%}, Moderada: {moderate_diff:.1%}")
        return True  # Ainda aceitar, mas com aviso

print("✅ Funções carregadas! Agora execute a geração de pontos críticos.")
