# Hype CX 2027 — Landing page (proposta 2)

Landing page da próxima edição da Hype CX (Targeting).

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- [Bun](https://bun.sh) como gestor de pacotes e runtime dos scripts
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- [shadcn/ui](https://ui.shadcn.com) (componentes em `src/components/ui`)
- Sass — a folha de raiz é `src/index.scss`

## Comandos

```bash
bun install        # instalar dependências
bun run dev        # servidor de desenvolvimento
bun run build      # build de produção (dist/)
bun run preview    # pré-visualizar o build
bun run lint       # oxlint
bunx shadcn@latest add <componente>   # adicionar componentes shadcn
```

## Notas sobre Sass + Tailwind

O `@tailwindcss/vite` só processa ficheiros `.css`, por isso o Tailwind corre
via PostCSS (`postcss.config.js`), depois de o Sass compilar `src/index.scss`.

Imports de pacotes CSS dentro do `.scss` têm de ficar como imports CSS puros,
senão o Sass tenta compilá-los:

- `@import "pacote/ficheiro.css";` (termina em `.css`), ou
- `@import url("pacote");`

As fontes (fontsource) são importadas em `src/main.tsx`.
