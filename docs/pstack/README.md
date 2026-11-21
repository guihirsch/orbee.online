# Gate advisory do pstack

Consumer advisory do pstack para o OrBee.Online. O gate roda em PRs para
`main`, valida a política de `pstack-advisory.json` contra o diff e publica o
resultado no step summary. **Não é required check**: falha não bloqueia o
merge.

O checker é vendorizado em `tools/check-consumer.py` a partir de
`guihirsch/operacao-agentes` (`pstack-core/scripts/check-consumer.py`, commit
`95e81be96288fd278652b15e4c6ec0594e436257`). Os testes do contrato ficam em
`tests/test_check_consumer.py`.

## Política

| chave | valor | efeito |
| --- | --- | --- |
| `base` | `origin/main` | base padrão fora do CI; no workflow vale `origin/${{ github.base_ref }}` |
| `artifacts_root` | `docs/pstack` | artefatos por PR em `docs/pstack/<slug>/` |
| `review_artifacts_paths` | `docs/pstack/` | commits de artefato podem vir depois do head revisado |
| `require` | `proof`, `review` | todo PR que dispara o gate precisa dos dois |
| `stateful_require` | `statechart` | exigido só se um `stateful_paths` mudar |
| `risk_require` | `blast_radius`, `decisions` | exigido se um `risk_paths` mudar |
| `min_reviewers` | `1` | revisor único, coerente com o tamanho do repo |
| `run_test_cmd` | `false` | o workflow roda `tests/test_check_consumer.py` separadamente |

### Por que `stateful_paths` está vazio

O que está publicado hoje é o portal estático (`deploy-pages.yml`) e a API v2
de leitura, que só serve JSON/tiles versionados e não tem estado mutável (ver
docstring de `backend/app/api/v2/api.py`). Os caminhos v1 que escrevem no
Supabase (observações, validações, auth) existem no código, mas o repo não tem
workflow de deploy/CI de backend e o README registra que o boot completo ainda
não está fechado. Exigir `statechart` ali seria especular sobre um fluxo que
não roda em produção. Quando o backend v1 for publicado, o candidato natural é
o fluxo estreito de criação de validação (observação existe, autor não valida a
própria observação, uma validação por usuário, atualização de contadores).

Por isso `stateful_paths` fica vazio com `allow_empty_paths: false`: a política
não aceita um config sem nenhum caminho por acidente, e reativar o eixo
stateful exige editar o config de propósito.

### Por que estes `risk_paths`

- `.github/workflows/deploy-pages.yml` — publica o portal em produção.
- `backend/app/api/v2/api.py` — API pública de leitura e resolução de tiles;
  contrato, 404/422 e proteção contra path traversal.
- `backend/jobs/build_basin.py` — gera score, banda e metodologia que o portal
  exibe.
- `frontend/src/lib/apiV2.js` — contrato entre modo estático e vivo e base URL;
  uma regressão aqui quebra o portal inteiro.
- `frontend/src/pages/Bacias.jsx` — página principal (dados, mapa, adoção de
  trecho).

Ficaram de fora dados gerados (`frontend/public/data`, `backend/data`),
componentes puramente visuais e scripts HLS one-off: o gate é advisory e cobre
o que muda o que é publicado, não todo o repositório.

## O que um PR precisa

O diff de um PR que dispara o gate precisa conter um diretório
`docs/pstack/<slug>/` que satisfaça os requisitos do diff:

```text
docs/pstack/<slug>/
├── 05-blast-radius.md   # só se risk_paths foi tocado
├── 05-review.md         # revisão legível
├── 06-prova.md          # saída real de comando/exit code/caminho
├── decisions.tsv        # só se risk_paths foi tocado
└── review.json          # schema 1, verdict APPROVED, head do commit revisado
```

Regras que costumam reprovar:

- `review.json.head` precisa ser ancestral do HEAD, ter 7–40 hex e apontar
  para o commit de **código** revisado, não para o commit dos artefatos.
- Depois do head revisado, só podem mudar arquivos em
  `review_artifacts_paths` (`docs/pstack/`). Qualquer código novo depois do
  review deixa o review stale.
- `decisions.tsv` exige exatamente as colunas `timestamp`, `decision`,
  `evidence`, `owner` e pelo menos uma linha de dados.
- Placeholders (`PREENCHER`, `<slug>`, `<comando>`) reprovam.

Fluxo prático: feche o código, rode a revisão e registre `review.json` com o
SHA desse commit; em seguida adicione os artefatos em um commit separado. Como
`review_artifacts_paths` cobre `docs/pstack/`, esse commit posterior não invalida
o review.

## Rodando localmente

```bash
python3 tests/test_check_consumer.py
python3 tools/check-consumer.py --root . --config pstack-advisory.json --base origin/main
```

O segundo comando, fora de um PR, termina com status 2: o checker carrega a
política da base (`git show origin/main:pstack-advisory.json`), para que um PR
não enfraqueça o próprio gate, e essa config ainda não existe em `main` antes
do merge desta instalação. Depois do merge, sem diff, ele imprime
`pstack-gate: sem mudanças contra a base` e sai 0.

Para testar a política e os artefatos antes de commitar, use o modo local (não
use no CI):

```bash
python3 tools/check-consumer.py --root . --config pstack-advisory.json \
  --base origin/main --local
```

## Bootstrap

Este PR de instalação é o único que roda o gate sem a config na base. O
workflow registra o motivo no summary e a falha é advisory. Depois do merge,
todo PR que toque os `paths` do workflow é avaliado com a política de `main`.
