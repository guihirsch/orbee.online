# OrBee.Online

**Slogan:** "OrBee: inteligência coletiva para um futuro sustentável."

**Propósito:** Plataforma que conecta satélites, comunidades e governos para ações locais com impacto global.

## 🌱 Sobre o Projeto

OrBee.Online é uma plataforma de monitoramento ambiental que combina dados satelitais NDVI (Índice de Vegetação por Diferença Normalizada) com validação comunitária para criar uma visão completa da saúde da mata ciliar e outros ecossistemas.

### Principais Funcionalidades

- **Visualização NDVI Interativa**: Mapas em tempo real da saúde da vegetação
- **Evolução Temporal**: Gráficos de tendências ambientais ao longo do tempo
- **Validação Comunitária**: Sistema para relatos, fotos e observações locais
- **Recomendações Automáticas**: Sugestões de ações baseadas nos dados
- **Gamificação**: Sistema de pontos e conquistas para engajar a comunidade

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com Vite
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Mapbox GL** para mapas interativos
- **Recharts** para gráficos
- **Lucide React** para ícones

### Backend (Planejado)
- **FastAPI** com padrão Service-Repository
- **Supabase** como banco de dados
- **Copernicus/Sentinel Hub API** para dados NDVI

### Infraestrutura
- **Railway** para deploy

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos para Execução

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/orbee.online.git
cd orbee.online
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto em modo de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
```
http://localhost:3000
```

### Scripts Disponíveis

- `npm run dev` - Executa em modo de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linting do código

## 🎯 Público-Alvo

- **Comunidades locais**: Agricultores, ONGs, cidadãos engajados
- **Pesquisadores ambientais**: Cientistas e acadêmicos
- **Órgãos públicos**: Prefeituras e secretarias de meio ambiente

## 🗺️ Fluxo do Usuário

1. Usuário acessa a aplicação
2. Digita cidade ou compartilha localização
3. Visualiza mapa NDVI + evolução temporal
4. Recebe insights sobre a saúde da vegetação
5. Lê recomendações adaptadas à região
6. Pode validar com relatos ou fotos
7. Ganha pontos e reconhecimento
8. Configura alertas para monitoramento contínuo

## 📊 Métricas de Sucesso

- Número de usuários ativos
- Número de observações validadas
- Cobertura geográfica (municípios monitorados)
- Engajamento comunitário (relatos e fotos)
- Precisão entre dados NDVI e validação comunitária

## 🚧 Status do Desenvolvimento

### ✅ Concluído
- [x] Estrutura inicial do frontend React
- [x] Layout responsivo com Tailwind CSS
- [x] Páginas principais (Home, Dashboard, Community, Profile)
- [x] Sistema de navegação e roteamento
- [x] Interface para validação comunitária
- [x] Sistema básico de gamificação

### 🔄 Em Desenvolvimento
- [ ] Integração com Mapbox para visualização de mapas
- [ ] Conexão com API Copernicus/Sentinel Hub
- [ ] Backend FastAPI
- [ ] Autenticação de usuários
- [ ] Sistema de upload de imagens

### 📋 Próximos Passos
- [ ] Implementação de gráficos temporais
- [ ] Sistema de alertas e notificações
- [ ] Deploy na Railway
- [ ] Testes automatizados

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através dos issues do GitHub.

---

**OrBee.Online** - Conectando tecnologia satelital com conhecimento local para um futuro mais sustentável. 🌍🛰️🌱