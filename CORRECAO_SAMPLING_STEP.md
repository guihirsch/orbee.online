# Correção Rápida: Erro SAMPLING_STEP no HLS.ipynb

## 🚨 Problema Identificado

O erro `name 'SAMPLING_STEP' is not defined` ocorre porque a nova versão corrigida da ETAPA 5 não define esta variável, mas ela ainda é referenciada na função de exportação.

## ✅ Correção Simples

### Opção 1: Adicionar a Variável na ETAPA 5

No início da célula da ETAPA 5 corrigida, adicione esta linha junto com as outras configurações:

```python
# Configurações para pontos críticos
MIN_DISTANCE_POINTS = 100  # Distância mínima entre pontos (metros)
MAX_POINTS_PER_SEVERITY = 50  # Reduzido para melhor performance
BUFFER_DISTANCE_RIVER = 200  # Buffer do rio em metros
SAMPLING_STEP = 3  # ← ADICIONAR ESTA LINHA
```

### Opção 2: Corrigir a Função de Exportação

Altere a linha problemática na função `export_geojson_results()` de:

```python
"sampling_step": generation_params.get('sampling_step', SAMPLING_STEP),
```

Para:

```python
"sampling_step": generation_params.get('sampling_step', 3),
```

### Opção 3: Correção Completa (Recomendada)

Substitua toda a seção `processing_params` na função de exportação por:

```python
"processing_params": {
    "min_distance_points": generation_params.get('min_distance', 100),
    "sampling_step": 3,  # Valor fixo
    "start_date": START_DATE,
    "end_date": END_DATE,
    "cloud_coverage_max": CLOUD_COVERAGE_MAX,
    "buffer_distance_m": generation_params.get('buffer_distance_m', 200),
    "buffer_constrained": generation_params.get('buffer_constrained', True),
    "coordinates_corrected": True,
    "generation_date": generation_params.get('generation_date', '2025-10-02')
}
```

## 🎯 Solução Mais Simples

Para resolver rapidamente, execute esta célula no Colab antes da exportação:

```python
# Correção rápida para variável faltante
SAMPLING_STEP = 3
print("✅ Variável SAMPLING_STEP definida")
```

## 🔧 Explicação

A variável `SAMPLING_STEP` era usada na versão original para definir o passo de amostragem ao percorrer os pixels do NDVI. Na nova versão corrigida, geramos pontos diretamente dentro do buffer usando coordenadas geográficas, então não precisamos mais desta variável. Mas a função de exportação ainda faz referência a ela nos metadados.

## ✅ Depois da Correção

Após aplicar qualquer uma das correções acima, o notebook deve exportar o GeoJSON corretamente com os pontos restritos ao buffer do rio.
