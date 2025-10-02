# 📊 Atualização dos Thresholds NDVI no HLS.ipynb

## 🎯 **Objetivo**

Atualizar os thresholds NDVI no notebook `HLS.ipynb` para usar valores baseados na literatura científica.

## 📚 **Nova Escala NDVI (Literatura Científica)**

```python
# Configurações NDVI baseadas na literatura científica
# NDVI (Normalized Difference Vegetation Index) varia entre -1 e +1
# Valores aceitos na literatura:
# < 0.0 → superfícies sem vegetação (água, nuvens, neve, rochas)
# 0.0 – 0.2 → áreas sem vegetação ou vegetação muito rala (solo exposto, áreas degradadas)
# 0.2 – 0.5 → vegetação esparsa, em regeneração ou estressada
# 0.5 – 0.8 → vegetação densa, saudável (floresta, agricultura vigorosa)
# > 0.8 → cobertura vegetal extremamente densa (floresta tropical úmida)

print("📚 Usando thresholds NDVI baseados na literatura científica:")
print("   < 0.0: Superfícies sem vegetação (água, rochas)")
print("   0.0-0.2: Vegetação muito rala ou degradada")
print("   0.2-0.5: Vegetação esparsa ou estressada")
print("   0.5-0.8: Vegetação densa e saudável")
print("   > 0.8: Vegetação extremamente densa")
print("")

NDVI_NO_VEGETATION = 0.0        # Limite para ausência de vegetação
NDVI_SPARSE_THRESHOLD = 0.2     # Limite para vegetação rala/degradada
NDVI_MODERATE_THRESHOLD = 0.5   # Limite para vegetação moderada/estressada
NDVI_DENSE_THRESHOLD = 0.8      # Limite para vegetação densa/saudável
MIN_VALID_PIXELS = 0.05         # Mínimo 5% de pixels válidos
```

## 🔧 **Substituições Necessárias**

### **1. Na ETAPA 3 - Configurações NDVI:**

**❌ SUBSTITUIR:**

```python
# Configurações NDVI
NDVI_CRITICAL_THRESHOLD = 0.2   # Limite para degradação crítica
NDVI_MODERATE_THRESHOLD = 0.4   # Limite para degradação moderada
MIN_VALID_PIXELS = 0.05         # Mínimo 5% de pixels válidos
```

**✅ POR:**

```python
# Configurações NDVI baseadas na literatura científica
# NDVI (Normalized Difference Vegetation Index) varia entre -1 e +1
# Valores aceitos na literatura:
# < 0.0 → superfícies sem vegetação (água, nuvens, neve, rochas)
# 0.0 – 0.2 → áreas sem vegetação ou vegetação muito rala (solo exposto, áreas degradadas)
# 0.2 – 0.5 → vegetação esparsa, em regeneração ou estressada
# 0.5 – 0.8 → vegetação densa, saudável (floresta, agricultura vigorosa)
# > 0.8 → cobertura vegetal extremamente densa (floresta tropical úmida)

print("📚 Usando thresholds NDVI baseados na literatura científica:")
print("   < 0.0: Superfícies sem vegetação (água, rochas)")
print("   0.0-0.2: Vegetação muito rala ou degradada")
print("   0.2-0.5: Vegetação esparsa ou estressada")
print("   0.5-0.8: Vegetação densa e saudável")
print("   > 0.8: Vegetação extremamente densa")
print("")

NDVI_NO_VEGETATION = 0.0        # Limite para ausência de vegetação
NDVI_SPARSE_THRESHOLD = 0.2     # Limite para vegetação rala/degradada
NDVI_MODERATE_THRESHOLD = 0.5   # Limite para vegetação moderada/estressada
NDVI_DENSE_THRESHOLD = 0.8      # Limite para vegetação densa/saudável
MIN_VALID_PIXELS = 0.05         # Mínimo 5% de pixels válidos
```

### **2. Na ETAPA 4 - Função classify_vegetation_degradation:**

**❌ SUBSTITUIR:**

```python
    elif ndvi_value < NDVI_CRITICAL_THRESHOLD:  # < 0.2
        return {
            'level': 'critical',
            'color': '#DC143C',
            'label': 'Crítico',
            'severity': 'critical'
        }
    elif ndvi_value < NDVI_MODERATE_THRESHOLD:  # 0.2 - 0.4
        return {
            'level': 'moderate',
            'color': '#FF8C00',
            'label': 'Moderado',
            'severity': 'moderate'
        }
```

**✅ POR:**

```python
    elif ndvi_value < NDVI_SPARSE_THRESHOLD:  # < 0.2
        return {
            'level': 'degraded',
            'color': '#DC143C',
            'label': 'Degradado',
            'severity': 'critical'
        }
    elif ndvi_value < NDVI_MODERATE_THRESHOLD:  # 0.2 - 0.5
        return {
            'level': 'sparse',
            'color': '#FF8C00',
            'label': 'Esparso/Estressado',
            'severity': 'moderate'
        }
    elif ndvi_value < NDVI_DENSE_THRESHOLD:  # 0.5 - 0.8
        return {
            'level': 'healthy',
            'color': '#32CD32',
            'label': 'Saudável',
            'severity': 'fair'
        }
```

### **3. Na ETAPA 4 - Análise de degradação:**

**❌ SUBSTITUIR:**

```python
        critical_pixels = np.sum(valid_ndvi < NDVI_CRITICAL_THRESHOLD)
        moderate_pixels = np.sum((valid_ndvi >= NDVI_CRITICAL_THRESHOLD) &
                                (valid_ndvi < NDVI_MODERATE_THRESHOLD))
        healthy_pixels = np.sum(valid_ndvi >= NDVI_MODERATE_THRESHOLD)
```

**✅ POR:**

```python
        degraded_pixels = np.sum(valid_ndvi < NDVI_SPARSE_THRESHOLD)
        sparse_pixels = np.sum((valid_ndvi >= NDVI_SPARSE_THRESHOLD) &
                               (valid_ndvi < NDVI_MODERATE_THRESHOLD))
        healthy_pixels = np.sum((valid_ndvi >= NDVI_MODERATE_THRESHOLD) &
                               (valid_ndvi < NDVI_DENSE_THRESHOLD))
        dense_pixels = np.sum(valid_ndvi >= NDVI_DENSE_THRESHOLD)
```

### **4. Outras referências aos thresholds antigos:**

**Substituir todas as ocorrências de:**

- `NDVI_CRITICAL_THRESHOLD` → `NDVI_SPARSE_THRESHOLD`
- `NDVI_MODERATE_THRESHOLD` → `NDVI_MODERATE_THRESHOLD` (mantém, mas agora é 0.5)

## 📊 **Impacto das Mudanças**

### **Antes (Valores Arbitrários):**

- Crítico: < 0.2
- Moderado: 0.2 - 0.4
- Saudável: > 0.4

### **Depois (Literatura Científica):**

- Degradado: < 0.2 (solo exposto, áreas degradadas)
- Esparso/Estressado: 0.2 - 0.5 (vegetação em recuperação)
- Saudável: 0.5 - 0.8 (vegetação densa)
- Muito Denso: > 0.8 (floresta tropical)

## 🎯 **Benefícios**

1. **✅ Precisão Científica:** Baseado em literatura peer-reviewed
2. **✅ Comparabilidade:** Padrão internacional para NDVI
3. **✅ Interpretação Correta:** Classificação mais precisa
4. **✅ Credibilidade:** Resultados cientificamente válidos
5. **✅ Flexibilidade:** Escala completa -1 a +1

## 📝 **Instruções de Aplicação**

1. Abrir `HLS.ipynb` no Google Colab ou Jupyter
2. Localizar ETAPA 3 (Processamento NDVI)
3. Substituir as configurações conforme indicado
4. Atualizar todas as referências aos thresholds antigos
5. Executar o notebook para gerar novos dados
6. Verificar se os resultados fazem sentido cientificamente

## ⚠️ **Atenção**

Após aplicar essas mudanças, será necessário:

1. **Reprocessar** os dados HLS
2. **Gerar novo** `critical_points_mata_ciliar.geojson`
3. **Atualizar** a aplicação web para refletir as novas classificações
4. **Validar** se os resultados estão coerentes com a realidade de campo
