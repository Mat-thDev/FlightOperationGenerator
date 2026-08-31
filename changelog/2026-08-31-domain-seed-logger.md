# Domain + Seed + Logger

## Alterações

- Criado `src/domain/entities/` com `Airline`, `Aircraft`, `Airport`, `Route`, `Flight`, `OperationProfile`, `Precision` (`Generated/Plausible/Confirmed/Unknown`).
- Criado `src/domain/rules/profileRules.ts` com `isRouteCompatibleWithProfile` e `isAircraftCompatibleWithProfile`.
- Criado `src/domain/FlightGenerator.ts` implementando pipeline `Critérios → Candidatos → Filtros → Regras → Seleção → Operação` com seleção por perfil/distância, origem/destino, frota e aeronave. Logs só de eventos importantes via `Logger`.
- Criado contratos `src/domain/repositories/*` e `src/domain/logging/Logger.ts` (Domain não depende de infra).
- Criado `src/infrastructure/logging/ConsoleLogger.ts` — console-only (`console.log/warn/error` com prefixo `[FOG][category][level]`), buffer de 50 entradas só em memória, sem UI conforme solicitado.
- Criado `src/infrastructure/seed/defaultSeed.ts` com `VARIG/LATAM/Azul`, `B737-300/800 + A320`, `SBGO/SBBR/SBGL/SBGR/SBSP` e 10 rotas plausíveis, 2 perfis (`Domestic Short Haul` 100-600NM e `Domestic Routine` 400-900NM).
- Criados repos in-memory `src/infrastructure/memory/*InMemoryRepository.ts`.
- Criado caso de uso `src/application/GenerateFlight.ts` (`generateFlightUseCase`) que orquestra repos, chama `generateFlight`, persiste em `FlightHistory` in-memory e loga `generate_flight_started`, `seed_loaded`, `flight_generated`, `flight_saved_to_history`, `warn` se sem candidatos e `error` se falha.

## Motivo

Iniciar MVP pelo Domain conforme `docs/PROJECT.md:248` e `docs/AGENTS.md:79` (domínio independente, testável). Seed cobre Centros solicitados (SBGO/SBBR/SBGL/SBGR/SBSP) e permite validar geração. `in-memory` primeiro evita acoplar SQLite prematuramente (`docs/AGENTS.md:372`). Logs console-only atendem pedido de debug com poucos eventos relevantes.

## Impacto

Nenhuma UI ainda consome o caso de uso. Estrutura pronta para próxima fase (UI + histórico + copiar). Sem quebra de contratos existentes. Typecheck OK. Smoke test validado: `generateFlightUseCase({}, deps)` e com critérios `SBGR + domestic-short-haul` geram `Flight` com `precision: Generated` e histórico incrementado.

## Decisões

- `ConsoleLogger` category fixa `application` por simplicidade; evolui para categorias por módulo se necessário.
- `generateFlight` usa `crypto.randomUUID()` para `Flight.id` e sorteio simples `Math.random()` — sem overengineering de RNG seedável nesta fase.
- Rotas com `airlineId` opcional restringem frota automaticamente; sem vínculo, sorteia companhia compatível com aeronave.
