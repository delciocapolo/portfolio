# Portfolio — Délcio Capolo

TanStack Start + React 19 + Tailwind v4. Contém a homepage e as páginas que faltavam: About Me, Blog (índice e página de artigo), Creative e Contact Me.

## Arrancar

```bash
pnpm install    # ou npm install
pnpm dev        # http://localhost:3000
```

O `routeTree.gen.ts` é gerado pelo plugin do TanStack no primeiro `dev`/`build` (ou com `pnpm generate-routes`), por isso não vem no zip.

## Rotas

| Ficheiro                    | URL                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/routes/index.tsx`      | `/` — hero, skills, experience, about, projects, teaser do blog e do creative, testimonial, contacto |
| `src/routes/about.tsx`      | `/about` — bio, números, percurso, stack, princípios                                                 |
| `src/routes/blog.index.tsx` | `/blog` — grelha com filtros por categoria + newsletter                                              |
| `src/routes/blog.$slug.tsx` | `/blog/:slug` — página de leitura (`loader` + `notFound()`)                                          |
| `src/routes/creative.tsx`   | `/creative` — masonry com filtros e lightbox                                                         |
| `src/routes/contact.tsx`    | `/contact` — formulário, disponibilidade, serviços, FAQ                                              |

## Onde editar

- **Conteúdo**: `src/data/posts.ts`, `src/data/creative.ts`, `src/data/site.ts` (perfil, experiência, projectos, percurso, FAQ, serviços). As páginas leem tudo daqui.
- **Imagens**: todas as áreas visuais usam `<Placeholder label="..." />` (`src/components/Placeholder.tsx`). Substitui por `<img src="..." className="h-full w-full object-cover" />`.
- **Corpo do artigo**: por agora é JSX dentro de `blog.$slug.tsx`. Para vários artigos, passa para MDX ou um campo `conteudo` nos dados.
- **Design tokens**: `src/styles.css` (`--color-ink`, `--color-panel`, `--font-sans`, utilitários `.text-outline` e `.card-lift`).
- **Formulários**: `ContactForm` e a newsletter só fazem `preventDefault`. Liga a um server function do Start ou ao teu endpoint de email.
- **Resume**: o botão da nav aponta para `/resume.pdf` — põe o ficheiro em `public/`.

## Clerk

Está nas dependências mas não está ligado, para o projecto arrancar sem chaves. Quando precisares, copia o `.env.example` para `.env` e envolve o conteúdo do `__root.tsx` com `<ClerkProvider>`.
