# SOS Enchentes
Aplicativo mobile desenvolvido como parte da **Global Solution da FIAP**, com foco em prevenção, monitoramento e resposta a situações de risco relacionadas a enchentes.
A proposta do aplicativo **SOS Enchentes** é aproximar informações sobre condições de risco para a população, permitindo acompanhar situações relacionadas a enchentes e receber informações que podem auxiliar na tomada de decisão em momentos críticos.

## Objetivo do projeto
Enchentes e alagamentos podem causar grandes impactos à população, especialmente quando as pessoas não tem acesso rápido a informações sobre as condições de risco da sua região.
O SOS Enchentes busca utilizar tecnologia para tornar essas informações mais acessíveis, oferecendo uma aplicação mobile capaz de centralizar dados e alertas relacionados a situações de emergência.

### Principais objetivos
- Facilitar o acesso a informações sobre condições de chuva e enchentes;
- Apoiar a população na identificação de situações de risco;
- Disponibilizar informações de forma contextualizada;
- Oferecer uma interface simples e acessível para dispositivos móveis;
- Permitir comunicação e atualização de informações em tempo real.

## Funcionalidades
A aplicação foi desenvolvida para dispositivos mobile utilizando React Native e Expo.
Os recursos previstos são:

- Monitoramento de informações relacionadas a enchentes;
- Visualização de informações de risco;
- Recebimento de atualizações em tempo real;
- Interface mobile para consulta das informações;
- Integração com serviços externos através de comunicação em tempo real;
- Navegação entre as diferentes funcionalidades da aplicação.

## Arquitetura
O projeto utiliza uma arquitetura baseada em **React Native + Expo**, com organização das telas utilizando **Expo Router**.

```text
┌─────────────────────────────┐
│        Aplicativo Mobile    │
│       React Native / Expo   │
└──────────────┬──────────────┘
               │
               │ Comunicação
               │ em tempo real
               ▼
┌─────────────────────────────┐
│          SignalR            │
│   @microsoft/signalr        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Serviços / API        │
│     Dados de enchentes      │
└─────────────────────────────┘
```

A comunicação em tempo real utiliza a biblioteca [`@microsoft/signalr`](https://www.npmjs.com/package/@microsoft/signalr), permitindo que o aplicativo receba atualizações sem depender exclusivamente de requisições periódicas.

## Estrutura do projeto

```text
fiap-gs-sos-enchentes/
│
├── assets/              # Imagens e recursos estáticos
│
├── src/
│   └── app/             # Telas e rotas da aplicação
│
├── .vscode/             # Configurações do VS Code
│
├── app.json             # Configurações do Expo
├── eslint.config.js     # Configuração do ESLint
├── package.json         # Dependências e scripts
├── package-lock.json    # Versões das dependências
├── tsconfig.json        # Configuração do TypeScript
├── LICENSE              # Licença do projeto
└── README.md            # Documentação
```

## Como executar

### Pré-requisitos
Antes de iniciar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- npm
- Expo CLI / ferramentas do Expo
- Android Studio, para utilizar um emulador Android, ou
- Expo Go em um dispositivo físico

### 1. Clone o repositório
```bash
git clone https://github.com/ViniciusVilasB/fiap-gs-sos-enchentes.git
```

Entre na pasta do projeto:
```bash
cd fiap-gs-sos-enchentes
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o projeto
```bash
npx expo start
```

Depois de iniciar, o Expo disponibilizará as opções para executar o projeto em diferentes ambientes.

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## Comunicação em tempo real

Um dos componentes importantes da aplicação é a utilização do **SignalR**.

A biblioteca permite estabelecer uma conexão persistente entre o aplicativo e o serviço responsável pelos dados, possibilitando o recebimento de atualizações em tempo real.

Fluxo simplificado:

```text
Evento / atualização
        │
        ▼
     Backend
        │
        │ SignalR
        ▼
Aplicativo Mobile
        │
        ▼
Atualização da interface
```

Essa abordagem é muito útil para cenários de emergência, nos quais informações sobre condições de risco podem mudar rapidamente.

## O impacto social

O projeto está alinhado à utilização de tecnologia para prevenção e redução dos impactos causados por desastres naturais.

A solução busca contribuir principalmente para:

- maior acesso à informação;
- conscientização sobre riscos;
- tomada de decisão mais rápida;
- comunicação de situações de emergência;
- utilização de tecnologia em benefício da população.

O projeto também se relaciona diretamente ao conceito de **cidades mais resilientes e sustentáveis**, especialmente no contexto de eventos climáticos extremos.

## ODS — Objetivos de Desenvolvimento Sustentável
Esse projeto contribui para alguns dos Objetivos de Desenvolvimento Sustentável da **ONU**, principalmente:

- **ODS 11 — Cidades e Comunidades Sustentáveis:** contribui para cidades mais seguras e resilientes ao facilitar o acesso a informações sobre enchentes e situações de risco.
- **ODS 13 — Ação Contra a Mudança Global do Clima:** apoia a prevenção e resposta aos impactos de eventos climáticos extremos.
- **ODS 9 — Indústria, Inovação e Infraestrutura:** utiliza tecnologias como aplicações mobile e comunicação em tempo real para desenvolver uma solução inovadora para um problema social.

## O impacto social
O projeto está alinhado à utilização de tecnologia para prevenção e redução dos impactos causados por desastres naturais.

A solução busca contribuir principalmente para:
- maior acesso à informação;
- conscientização sobre riscos;
- tomada de decisão mais rápida;
- comunicação de situações de emergência;
- utilização de tecnologia em benefício da população.

O projeto também se relaciona diretamente ao conceito de **cidades mais resilientes e sustentáveis**, especialmente no contexto de eventos climáticos extremos.

##Prints de tela
<img width="984" height="628" alt="image" src="https://github.com/user-attachments/assets/b2fcdce5-b86c-45a8-a7c8-d28107ce6349" />
<img width="954" height="622" alt="image" src="https://github.com/user-attachments/assets/0fa14413-4d45-461c-99d8-2f4ea8360075" />
<img width="943" height="636" alt="image" src="https://github.com/user-attachments/assets/71a3120f-8c0d-4798-a648-52a04e31d429" />
<img width="352" height="698" alt="image" src="https://github.com/user-attachments/assets/36a7891a-7951-409f-90fd-4b3587eaff6f" />

## Equipe

| Integrante | RM |
|---|---|
| Vinicius Vilas Boas | 557843 |
| Milena Costa | 555111 |
| Renan Gonçalves | 555584 |
| Gustavo Luni | 558096 |
