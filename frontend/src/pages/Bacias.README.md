# Página /bacias — smoke manual (F3-5)

Sem harness JS no repo para páginas com mapa; este roteiro é a verificação.

Pré-requisito: backend rodando com artefatos F1
(`backend/jobs/build_basin.py --basin pardo --synthetic 8 --out backend/data/basins/pardo/v1`
gera fixture válida) e `VITE_API_V2_URL=http://localhost:8000/api/v2`.

1. Abra `/bacias` **deslogado** → mapa carrega, trechos coloridos por banda,
   sem tela branca; com API fora → banner de erro legível.
2. Troque bacia/versão e filtre "Alta ou maior" → só trechos Alta/Urgente.
3. Clique num trecho → painel com score, barras dos 5 componentes, série
   pré/pós/regen, técnica sugerida e versão da metodologia.
4. Com build SR: toggle "SR 2,5 m" habilita após selecionar trecho com SR;
   opacidade ajusta o overlay; sem SR → toggle desabilitado com tooltip.
5. "Baixar GeoJSON do trecho" → arquivo `<reach_id>.geojson` válido.
6. "Adotar este trecho" deslogado → abre login; após login, registra
   observation e mostra aviso verde.
7. "Metodologia" → modal com texto e pesos somando 100%.
8. `npm run build` verde (chunk >500 kB é aviso pré-existente do bundle).
