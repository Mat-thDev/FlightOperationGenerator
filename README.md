# Flight Operation Generator

Gerador de operações de voo plausíveis para MSFS — defina critérios e planeje no SimBrief.

## Visão

Responde **"O que vou voar?"**. A partir de critérios escolhidos pelo usuário (companhia, aeronave, origem/destino, tipo de operação, duração, distância, região, período histórico), gera uma operação coerente para ser usada como entrada no SimBrief e, posteriormente, no Microsoft Flight Simulator.

Não é um substituto do SimBrief e não realiza planejamento operacional completo.

## Como funciona

```
Critérios → Candidatos → Filtros → Regras → Seleção → Operação
```

A geração é baseada em regras e dados estruturados, não em decisões arbitrárias espalhadas no código.

## Conceitos

- **Airline** — companhia aérea (nome, ICAO/IATA, callsign, frota, rotas, período)
- **Aircraft** — aeronave/variante com restrições e características
- **Airport** — aeroporto com dados suficientes para regras de geração
- **Route** — ligação possível entre aeroportos (específica, genérica, histórica ou do usuário)
- **Operation Profile** — estilo da operação (ex: Domestic Short Haul, Regional, Long Haul, ETOPS, Cargo, Historical, Custom)
- **Flight** — resultado final: `VRG 2210 — SBGR → SBGL — B737-300 — Domestic Short Haul`

## Perfis de operação

Domestic Short Haul, Domestic Routine, Regional, Long Haul, ETOPS, Cargo, Historical e Custom. Cada perfil define restrições de distância, duração, região e aeronaves.

## Arquitetura

```
UI → Application → Domain → Infrastructure
```

- **UI:** React + TypeScript + Tailwind + DaisyUI
- **Application:** orquestra casos de uso (`GenerateFlight`, `CreateAirline`, etc.)
- **Domain:** conceitos e regras centrais, independente de React/Tauri/SQLite
- **Infrastructure:** SQLite, Filesystem, Tauri APIs, Import/Export, SimBrief

Mais detalhes em `docs/PROJECT.md` e regras de contribuição em `docs/AGENTS.md`.

## Stack

Tauri (desktop), React + TypeScript (frontend), Tailwind + DaisyUI (estilo), SQLite (persistência), Rust apenas para integração nativa.

## MVP

Inclui: companhias pré-configuradas e personalizadas, aeroportos, aeronaves, rotas, perfis de operação, geração de voos, histórico de operações e cópia das informações do voo.

Fora do escopo inicial: planejamento IFR próprio, cálculo de combustível/performance, SID/STAR, carreira completa, integração complexa com SimBrief.

## Data Packs

Dados evoluem como pacotes: `Default` (base), `Historical` (ex: VARIG 1990s), `User` (conteúdo criado pelo usuário). Permite adicionar conteúdo sem alterar o core.

## Precisão dos dados

Toda operação gerada proceduralmente é classificada como `Generated`, mesmo quando plausível. Classificações previstas: `Confirmed` / `Plausible` / `Generated` / `Unknown`. Nenhum dado inventado é apresentado como fato histórico.

## Como executar

```bash
npm install
npm run dev        # frontend (Vite)
npm run tauri dev  # app desktop
npm run build      # build de produção
```

Pré-requisitos: Node.js e Rust (para Tauri).

## Changelog

Alterações são registradas em `changelog/` conforme `docs/AGENTS.md`.
