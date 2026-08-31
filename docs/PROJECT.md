# Flight Operation Generator

## Visão do Projeto

O Flight Operation Generator é uma aplicação desktop para Microsoft Flight Simulator (MSFS) focada em gerar operações de voo plausíveis e personalizáveis para serem posteriormente planejadas no SimBrief.

O programa **não é um substituto do SimBrief** e não tem como objetivo realizar o planejamento operacional completo de um voo.

Sua função principal é responder:

> **"O que vou voar?"**

O aplicativo determina uma operação coerente com os critérios escolhidos pelo usuário, como:

* companhia aérea;
* aeronave;
* origem e destino;
* tipo de operação;
* duração;
* distância;
* região;
* período histórico;
* características operacionais.

O resultado pode então ser utilizado como entrada para o SimBrief e, posteriormente, para o MSFS.

---

# Princípios do Projeto

## 1. Modularidade em primeiro lugar

Cada responsabilidade deve possuir uma separação clara.

O sistema deve permitir adicionar novas funcionalidades sem exigir alterações extensas em funcionalidades existentes.

Entretanto:

> Modularidade não significa abstração excessiva.

Não criar interfaces, sistemas de plugins, factories ou camadas adicionais apenas porque "podem ser úteis no futuro".

Uma abstração deve existir quando houver uma necessidade concreta ou quando ela eliminar duplicação e acoplamento real.

---

## 2. O domínio não deve depender da interface

O core do aplicativo deve representar conceitos de aviação e geração de operações, independentemente de React, Tauri ou qualquer outra tecnologia de apresentação.

A interface deve consumir o domínio.

O domínio não deve conhecer componentes React.

---

## 3. Dados são dados

Companhias aéreas, aeronaves, aeroportos e rotas não devem ser tratados como lógica hardcoded quando puderem ser representados como dados.

Por exemplo, VARIG deve ser uma definição de companhia aérea, não uma coleção de `if` espalhados pelo código.

Evitar:

```ts
if (airline === "VARIG") {
    // ...
}
```

Preferir regras e dados estruturados.

---

## 4. O gerador deve trabalhar com regras

A geração de uma operação deve ser baseada em critérios e regras, e não em decisões arbitrárias espalhadas pelo código.

Conceitualmente:

```text
Critérios
    ↓
Candidatos
    ↓
Filtros
    ↓
Regras
    ↓
Seleção
    ↓
Operação
```

Isso permite posteriormente adicionar comportamentos como:

* operações domésticas;
* curta duração;
* longa distância;
* operações rotineiras;
* ETOPS;
* operações históricas;
* operações cargueiras;
* operações personalizadas.

---

# Conceitos Principais

## Airline

Representa uma companhia aérea.

Exemplos:

* VARIG;
* LATAM;
* Azul;
* Emirates;
* companhia criada pelo usuário.

Uma companhia deve conter informações como:

* nome;
* ICAO;
* IATA;
* callsign;
* frota;
* rotas;
* período de operação, quando aplicável.

---

## Aircraft

Representa uma aeronave ou variante de aeronave.

Exemplos:

* Boeing 737-300;
* Boeing 737-800;
* Airbus A320-200;
* Boeing 777-300ER.

A aeronave pode possuir restrições e características utilizadas durante a geração.

---

## Airport

Representa um aeroporto.

O aeroporto deve possuir informações suficientes para permitir sua utilização nas regras de geração, como:

* ICAO;
* IATA;
* nome;
* país;
* região;
* coordenadas;
* características relevantes para operação.

---

## Route

Representa uma possível ligação entre dois aeroportos.

Uma rota pode ser:

* específica de uma companhia;
* genérica;
* histórica;
* criada pelo usuário.

Uma rota não deve necessariamente representar uma rota ATC completa.

Ela representa principalmente:

> "Esta operação pode acontecer entre estes aeroportos."

O planejamento detalhado da rota permanece como responsabilidade do SimBrief.

---

## Operation Profile

Representa o estilo de operação desejado.

Exemplos:

```text
Domestic Short Haul
Domestic Routine
Regional
Long Haul
ETOPS
Cargo
Historical
Custom
```

O perfil define restrições e preferências utilizadas pelo gerador.

Exemplo conceitual:

```text
Domestic Short Haul

distância:
    mínima: 100 NM
    máxima: 600 NM

duração:
    curta

região:
    doméstica

aeronaves:
    narrowbody / regional
```

---

## Flight

Representa o resultado final da geração.

Exemplo:

```text
VRG 2210
VARIG 2210

SBGR → SBGL

B737-300

Domestic Short Haul
```

O objeto `Flight` deve ser simples e representar uma operação, não todo o planejamento operacional.

---

# Arquitetura

A aplicação deve seguir uma separação aproximada entre:

```text
UI
 ↓
Application
 ↓
Domain
 ↓
Infrastructure
```

### UI

Responsável pela apresentação e interação do usuário.

Tecnologia inicial:

* React;
* TypeScript;
* Tailwind;
* DaisyUI, quando apropriado.

---

### Application

Orquestra os casos de uso.

Exemplos:

```text
GenerateFlight
CreateAirline
CreateOperationProfile
ImportDataPack
ExportFlight
```

A Application Layer coordena o domínio, mas não deve conter regras de negócio que pertençam ao domínio.

---

### Domain

Contém os conceitos e regras centrais do aplicativo.

Deve ser a camada mais independente possível.

Exemplos:

```text
Airline
Aircraft
Airport
Route
Flight
OperationProfile
FlightGenerator
Rules
```

---

### Infrastructure

Implementa recursos externos ao domínio.

Exemplos:

```text
SQLite
Filesystem
Tauri APIs
Import / Export
SimBrief integration
```

---

# Stack

## Desktop

Tauri

## Frontend

React + TypeScript

## Styling

Tailwind CSS + DaisyUI

## Persistência

SQLite

## Backend nativo

Rust, apenas quando houver necessidade de integração ou processamento nativo.

A lógica de domínio não deve ser movida para Rust sem uma razão concreta.

---

# MVP

A primeira versão deve ser deliberadamente pequena.

O MVP deve possuir:

* companhias pré-configuradas;
* companhias personalizadas;
* aeroportos;
* aeronaves;
* rotas;
* perfis de operação;
* geração de voos;
* histórico de operações geradas;
* copiar informações do voo.

Não implementar inicialmente:

* planejamento IFR próprio;
* cálculo de combustível;
* cálculo de performance;
* geração própria de SID/STAR;
* sistema completo de carreira;
* banco histórico gigantesco;
* integração complexa com SimBrief;
* sistemas de plugin sofisticados.

Essas funcionalidades podem existir futuramente, mas não devem influenciar negativamente a arquitetura inicial.

---

# Data Packs

Dados devem poder evoluir para um sistema de Data Packs.

Conceito:

```text
Default
├── Airlines
├── Aircraft
├── Airports
└── Routes

Historical
├── VARIG 1990s
├── VARIG 2000s
└── ...

User
├── My Airline
└── My Routes
```

Isso permitirá adicionar conteúdo sem alterar o core da aplicação.

---

# SimBrief

O SimBrief deve permanecer responsável pelo planejamento operacional detalhado.

O Flight Operation Generator deve fornecer informações como:

```text
Airline
Flight Number
Origin
Destination
Aircraft
Operation Type
```

O SimBrief transforma essas informações em:

```text
Route
SID
STAR
Fuel
Weights
Performance
OFP
```

A integração deve ser adicionada posteriormente.

---

# Histórico

Operações históricas devem ser tratadas como uma camada adicional de dados e regras.

O sistema poderá futuramente permitir:

```text
Companhia: VARIG
Período: 1998
```

e restringir automaticamente:

* frota disponível;
* aeroportos utilizados;
* rotas;
* números de voo;
* operações.

A precisão histórica deve ser explicitamente diferenciada entre:

```text
Historicamente confirmado
Historicamente plausível
Gerado proceduralmente
```

O sistema nunca deve apresentar uma informação inventada como fato histórico.

---

# Qualidade

Prioridades:

1. Correção;
2. Previsibilidade;
3. Manutenibilidade;
4. Modularidade;
5. Performance;
6. Complexidade mínima.

Performance não deve ser otimizada prematuramente.

A aplicação trabalha principalmente com dados relativamente pequenos. Uma solução simples e correta é preferível a uma solução altamente otimizada e difícil de manter.

---

# Evolução

O projeto deve crescer de forma incremental.

Cada nova funcionalidade deve responder:

1. Existe uma necessidade real?
2. Existe um módulo existente que pode ser reutilizado?
3. A alteração pode ser isolada?
4. Ela adiciona complexidade desnecessária?
5. Ela mantém compatibilidade com o comportamento existente?

O objetivo não é construir a arquitetura definitiva antes do software existir.

O objetivo é construir uma base suficientemente boa para que a arquitetura possa evoluir sem se tornar um obstáculo.
