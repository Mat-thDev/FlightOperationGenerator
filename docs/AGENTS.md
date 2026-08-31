# AGENTS.md

## Contexto

Este repositório contém o **Flight Operation Generator**, uma aplicação desktop construída com Tauri, React e TypeScript para gerar operações de voo destinadas ao Microsoft Flight Simulator e posteriormente ao SimBrief.

Antes de modificar o código, consulte `PROJECT.md`.

`PROJECT.md` define a visão, conceitos e arquitetura do projeto.

Este arquivo define **como agentes de IA devem trabalhar no repositório**.

---

# Regra Fundamental

> **Preserve o comportamento existente antes de melhorar sua implementação.**

Não altere comportamento, regras ou contratos existentes sem necessidade explícita.

Uma refatoração deve melhorar:

* legibilidade;
* organização;
* modularidade;
* manutenção;
* reutilização.

Não deve introduzir mudanças funcionais silenciosas.

---

# Antes de Alterar

Antes de escrever código:

1. Entenda a estrutura existente.
2. Procure implementações relacionadas.
3. Procure módulos reutilizáveis.
4. Entenda os tipos existentes.
5. Verifique como a funcionalidade atual é utilizada.
6. Identifique dependências e efeitos colaterais.
7. Só então escolha onde implementar a mudança.

Não crie um módulo novo antes de verificar se um módulo existente já possui responsabilidade semelhante.

---

# Reutilização

## Regra

> **Reutilize antes de criar.**

Antes de criar:

* componente;
* utilitário;
* tipo;
* hook;
* service;
* repository;
* função;
* regra;

procure primeiro por implementações existentes.

Se duas funcionalidades possuem a mesma responsabilidade, prefira compartilhar a implementação.

Não duplicar lógica apenas porque duas partes da aplicação estão em arquivos diferentes.

---

# Modularidade

Cada módulo deve possuir uma responsabilidade clara.

Evitar módulos que:

* fazem muitas coisas;
* conhecem detalhes desnecessários de outras partes;
* misturam UI com domínio;
* misturam persistência com regras de negócio;
* possuem dependências circulares.

Preferir:

```text
Uma responsabilidade
        ↓
Uma implementação clara
        ↓
Dependências explícitas
```

---

# Complexidade

## Regra principal

> **Não resolver um problema maior do que o existente.**

Não introduza:

* abstrações prematuras;
* padrões de design sem necessidade;
* factories desnecessárias;
* múltiplas camadas para uma operação simples;
* generics excessivamente complexos;
* sistemas de eventos onde uma chamada direta resolve;
* dependency injection pesada sem necessidade;
* arquitetura distribuída;
* mecanismos configuráveis que ninguém precisa configurar.

Código simples é preferível quando atende corretamente ao problema.

---

# TypeScript

Priorizar:

* tipos explícitos nos limites importantes;
* `interface` ou `type` conforme o caso;
* funções pequenas;
* composição;
* imutabilidade quando fizer sentido;
* validação nas fronteiras do sistema.

Evitar:

* `any`;
* casts desnecessários;
* `as` utilizado apenas para silenciar o TypeScript;
* tipos gigantes;
* funções com múltiplas responsabilidades;
* objetos sem contrato quando existe um domínio claro.

`any` somente deve existir quando houver uma razão técnica clara e localizada.

---

# React

Componentes devem permanecer focados em apresentação e interação.

Evitar colocar diretamente dentro de componentes:

* regras complexas de geração;
* acesso direto ao SQLite;
* regras de negócio;
* lógica histórica;
* cálculos complexos.

Quando uma lógica possuir significado de domínio, ela deve existir fora do componente.

Evitar abstrair componentes pequenos apenas para reduzir algumas linhas.

---

# Domínio

Regras de negócio pertencem ao domínio.

Exemplo:

```text
"Um perfil ETOPS exige aeronave compatível"
```

Isso é regra de domínio.

Não deve depender de:

```text
React
Tauri
SQLite
```

O domínio deve poder ser testado independentemente da interface.

---

# Dados

Companhias, aeroportos, aeronaves, rotas e outros dados devem ser tratados como dados sempre que possível.

Evitar:

```ts
if (airline === "VRG") {
    ...
}
```

quando a mesma informação puder ser representada por dados estruturados.

Não transformar dados em lógica apenas para facilitar uma implementação rápida.

---

# Comentários

Comentários devem ser:

* curtos;
* objetivos;
* coesos;
* fáceis de entender.

O comentário deve explicar **por quê**, quando o motivo não for evidente.

Evitar comentários que simplesmente repetem o código.

Ruim:

```ts
// Incrementa o contador
counter++
```

Bom:

```ts
// Mantém a sequência compatível com a numeração histórica.
counter++
```

Não escrever comentários extensos para explicar código que poderia simplesmente ser melhor escrito.

---

# Nomenclatura

Nomes devem explicar a intenção.

Preferir:

```ts
generateFlight()
findCandidateRoutes()
operationProfile
```

a:

```ts
process()
handle()
data()
manager()
```

Evitar abreviações desnecessárias.

Nomes devem seguir o padrão já utilizado pelo projeto.

---

# Funções

Uma função deve possuir uma responsabilidade clara.

Evitar funções que:

```text
buscam dados
validam dados
modificam estado
geram resultado
salvam no banco
```

tudo ao mesmo tempo.

Quando uma função crescer por necessidade real, divida-a por responsabilidade.

Não dividir uma função apenas porque ela possui mais de X linhas.

---

# Alterações

Toda alteração deve ser a menor mudança necessária para resolver o problema.

Não aproveitar uma tarefa para fazer uma refatoração geral não solicitada.

Evitar alterações cosméticas em arquivos não relacionados.

Não modificar APIs internas ou públicas sem necessidade.

---

# Changelog

**Toda modificação no projeto deve gerar um arquivo Markdown dentro de `/changelog`.**

Formato:

```text
/changelog/
    2026-08-31-flight-generator.md
```

O arquivo deve registrar:

* o que foi alterado;
* por que foi alterado;
* impacto relevante;
* funcionalidades adicionadas ou removidas;
* decisões arquiteturais importantes.

Exemplo:

```md
# Flight Generator

## Alterações

- Adicionado o primeiro gerador de operações.
- Criado `FlightGenerator` no domínio.
- Adicionado suporte ao perfil `Domestic Short Haul`.

## Motivo

Centralizar a geração de operações em um único ponto do domínio.

## Impacto

Nenhuma funcionalidade existente foi alterada.
```

Não registrar alterações triviais de formatação isoladamente, a menos que façam parte de uma alteração maior.

---

# Dependências

Não adicionar uma dependência apenas para resolver algumas linhas de código.

Antes de instalar uma biblioteca:

1. Verifique se a funcionalidade já existe no projeto.
2. Verifique se pode ser implementada de forma simples.
3. Avalie tamanho e manutenção da dependência.
4. Considere o impacto no desktop bundle.

Uma dependência deve resolver um problema real.

---

# Tauri

Utilizar Tauri para recursos que realmente dependam da camada nativa.

Não mover lógica para Rust apenas por preferência arquitetural.

A lógica de domínio deve permanecer em TypeScript enquanto não existir uma razão concreta para movê-la.

Rust pode ser utilizado para:

* filesystem;
* SQLite;
* APIs nativas;
* processos do sistema;
* operações que realmente se beneficiem da camada nativa.

---

# SQLite

O domínio não deve depender diretamente do SQLite.

Preferir uma separação semelhante a:

```text
Domain
   ↓
Repository contract
   ↓
SQLite implementation
```

Isso mantém persistência como infraestrutura.

---

# Tratamento de erros

Erros devem possuir contexto suficiente para serem úteis.

Evitar:

```ts
catch {
    console.log("error")
}
```

Preferir mensagens que indiquem:

* operação;
* contexto;
* causa conhecida.

Não esconder erros apenas para impedir que apareçam na UI.

---

# Testes

Testar principalmente:

* regras de domínio;
* geração de operações;
* filtros;
* seleção;
* validações;
* transformações de dados.

Não escrever testes apenas para aumentar cobertura.

Um teste deve proteger um comportamento relevante.

---

# Verificação

Após alterações:

1. Execute o typecheck.
2. Execute o lint, se configurado.
3. Execute os testes existentes.
4. Execute o build quando a alteração puder afetá-lo.
5. Verifique alterações inesperadas no diff.

Não declarar que algo foi testado se o teste não foi realmente executado.

Se uma verificação não puder ser executada, declarar isso explicitamente.

---

# Compatibilidade

Não remover funcionalidades existentes sem motivo.

Antes de modificar um contrato:

* procure todos os usos;
* verifique dependências;
* avalie impacto;
* faça a alteração de maneira consistente.

Preferir mudanças incrementais.

---

# Precisão dos Dados

O projeto trabalha com informações de aviação.

Não apresentar dados históricos ou operacionais como fatos quando forem apenas estimativas.

Diferenciar:

```text
Confirmed
Plausible
Generated
Unknown
```

Quando houver incerteza relevante, ela deve ser representada nos dados ou explicitada na interface.

---

# Histórico e Dados Reais

Dados históricos de companhias, números de voo, rotas e frotas devem ser tratados como conteúdo factual.

Não inventar dados e classificá-los como históricos.

Quando uma operação for proceduralmente gerada, ela deve ser considerada uma operação gerada, mesmo que seja plausível.

---

# Desenvolvimento Incremental

O projeto deve evoluir em pequenos incrementos.

Ao implementar uma funcionalidade:

1. Faça a implementação mínima funcional.
2. Valide o comportamento.
3. Identifique duplicações ou problemas reais.
4. Refatore somente quando necessário.
5. Registre a alteração no changelog.

Não antecipar funcionalidades futuras na implementação atual.

---

# Decisões Arquiteturais

Quando uma decisão tiver impacto significativo na arquitetura, documente:

* problema;
* alternativas consideradas;
* decisão;
* motivo;
* consequências.

Decisões pequenas não precisam de documentação formal.

---

# Regra Contra Overengineering

Se duas soluções funcionam:

```text
A = simples
B = abstrata, genérica e extensível
```

a solução A deve ser escolhida **até que exista uma necessidade concreta que justifique B**.

O projeto deve ser preparado para crescer, mas não construído como se já tivesse dez anos de complexidade acumulada.

---

# Regra Contra Underengineering

Simplicidade também não significa colocar toda a lógica em um arquivo.

Se um módulo possui responsabilidades claramente diferentes ou está criando acoplamento real, divida-o.

O objetivo é:

> **mínima complexidade necessária para máxima clareza.**

---

# Prioridade de Decisão

Quando houver conflito entre alternativas, priorizar:

1. Correção;
2. Clareza;
3. Compatibilidade;
4. Modularidade;
5. Reutilização;
6. Manutenibilidade;
7. Performance;
8. Abstração.

Performance pode subir na prioridade quando houver evidência de um problema real.

---

# Comunicação com o Desenvolvedor

Ao explicar alterações, seja direto.

Informar:

* o que foi alterado;
* onde;
* por quê;
* possíveis impactos;
* verificações realizadas.

Não afirmar que uma abordagem é "melhor" sem explicar o critério.

Quando houver múltiplas soluções razoáveis, apresentar as alternativas e indicar uma recomendação.

Quando houver incerteza factual ou arquitetural, declarar explicitamente a incerteza.

Não assumir requisitos que não foram definidos.

---

# Regra Final

Antes de adicionar código, pergunte:

> **"Isso realmente precisa existir?"**

Antes de criar um módulo:

> **"Já existe algo que resolve isso?"**

Antes de criar uma abstração:

> **"Existe complexidade real que justifica essa abstração?"**

Antes de modificar comportamento:

> **"Isso é necessário para a tarefa?"**

Antes de finalizar:

> **"O código ficou mais claro sem ficar desnecessariamente mais complexo?"**
