# Hype CX 2027 · Proposta 2 «Em Directo»

Landing page da 3ª edição do Hype CX (Targeting), na visão da Expressers: o evento como uma
emissão de rádio em directo da voz do cliente. Cada secção é uma estação no dial FM, a mudança
de estação passa por estática, o nome HYPE CX respira com o sinal e os oradores sintonizam a
partir do ruído.

## Stack

Vite, React 19, TypeScript, Bun, Tailwind v4 (via PostCSS) e Sass. Fontes self-hosted
(Fontsource): Anybody (eixo de largura animado), Geist e Geist Mono.

```bash
bun install
bun run dev      # desenvolvimento
bun run build    # produção em dist/
```

## Estrutura

- `src/content.ts`: todo o conteúdo (edição de 2026 como referência; 2027 sem data, local nem preços).
- `src/lib/signal.ts`: relógio único do sinal (osciloscópio, título, som opcional por WebAudio).
- `src/sections/`: Hero, Porquê, Vozes, Alinhamento, Arquivo, Patrocínio, Ingressos, Fim da emissão.
- `src/styles/`: tokens e estilos Sass.
- `public/media/`: fotografias, retratos e logótipos reais da edição de 2026.
- `PRODUCT.md`, `DESIGN.md`: contexto do produto e sistema visual.

## Por confirmar com a Targeting

Data, local e preços da 3ª edição, e os oradores de 2027. As acções "Avisem-me",
"Pedir proposta" e "Seja patrocinador" abrem um email para hypecx@targeting.ao.
