# Template de Desenvolvimento de Software

## 1. Nome e Pitch

**Nome do Projeto:** OrBee.Online

**Pitch curto:**  
**Slogan:** “OrBee: inteligência coletiva para um futuro sustentável.”  
**Propósito expandido:** “Plataforma que conecta satélites, comunidades e governos para ações locais com impacto global.”

---

## 2. Objetivo do Projeto

**O que o projeto resolve?**

- Monitoramento hiperlocal da saúde da mata ciliar.

**Proatividade esperada do software:**

- Disponibilizar dados em tempo real.
- Sugerir ações específicas de preservação.
- Engajar a comunidade para validar e agir localmente.

---

## 3. Requisitos Funcionais - MVP

**Principais Funcionalidades:**

- Visualização de dados em mapa NDVI interativo.
- Evolução temporal em gráfico de linha (semanas/meses).
- Validação comunitária (relatos, fotos, observações locais).
- Recomendações automáticas de ações (curtas, específicas).
- Alertas proativos via e-mail/WhatsApp.

**Funcionalidades Futuras (visão):**

- Solicitação de análises específicas por comunidades.
- Gamificação e ranking de guardiões ambientais.
- Chatbot inteligente para responder dúvidas contextuais.

---

## 4. Requisitos Não Funcionais

- **Escalabilidade:** Backend modular, pronto para integrar novas fontes de dados.
- **Segurança:** Autenticação simples (e-mail/login social), proteção de dados de localização.

---

## 5. Público-Alvo

**Quem usa?**

- Comunidades locais (agricultores, ONGs, cidadãos engajados).
- Pesquisadores ambientais.
- Prefeituras ou órgãos de meio ambiente.

**Benefícios para o usuário:**

- Receber informações práticas e personalizadas.
- Reconhecimento e pontuação por validação.
- Sensação de adotar e proteger uma área de interesse.

---

## 6. Fluxo do Usuário - MVP

1. Usuário acessa a aplicação.
2. Digita cidade ou compartilha localização.
3. Visualiza mapa NDVI + evolução temporal.
4. Recebe insights (alto/baixo, tendência).
5. Lê recomendações adaptadas à região/clima.
6. Pode validar com relatos ou fotos.
7. Ganha pontos/reconhecimento.
8. Configura alertas para acompanhar sua área de interesse.

---

## 7. Arquitetura Técnica

- **Frontend:** React (Vite) + Tailwind + Mapbox; Código extremamente modular dividindo em componentes, páginas e hooks.
- **Backend:** FastAPI (Service–Repository Pattern).
- **Banco de Dados:** Supabase.
- **Fonte de Dados:** Copernicus/Sentinel Hub API (NDVI).
- **Infraestrutura:** Railway.

---

## 8. Métricas de Sucesso

- Nº de usuários ativos.
- Nº de observações validadas.
- Cobertura geográfica (municípios monitorados).
- Engajamento comunitário (relatos e fotos).
- Precisão entre NDVI e validação comunitária.

---

## 9. Estratégia de Lançamento

**MVP inicial:**

- Exibir mapa NDVI com dados reais.
- Gráfico de evolução temporal.
- Validação comunitária com relatos e fotos.

**Pitch final:**

- Mostrar impacto global via ações locais.
- Destacar simplicidade da plataforma.
- Evidenciar engajamento da comunidade.

---

## 10. Onde Podemos Chegar (Visão Longo Prazo)

- Hub global de inteligência comunitária.
- Integração com clima, uso do solo, queimadas.
- Monitoramento de diferentes biomas (florestas, manguezais, áreas urbanas verdes).
- Plataforma que conecta satélites, comunidades e governos para ações locais com impacto global.

---

## 11. Documentação

Dentro da pasta `/documentacao`, documentar três situações:

1. **Fluxo dos dados na experiência do usuário** com nome do campo e tipagem.
2. **Explicação dos fluxos possíveis** (experiência do usuário).
3. **Explicação do código de cada fluxo**, de forma didática, para manter clareza sobre as decisões técnicas.

> Esta documentação deve ser mantida **atualizada** a cada alteração de código e no formato **Markdown**.

---

## 12. Design System

Dentro da pasta `/src`, manter o arquivo `design-system.md` atualizado sempre que houverem modificações no código.
