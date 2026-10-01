# Backoffice — /admin

Copia a pasta `src/` por cima da tua e junta `src/start.ts`. Só `src/routes/__root.tsx` é alterado; o resto são ficheiros novos.

## Arrancar

1. `.env.local` → `VITE_CLERK_PUBLISHABLE_KEY` e `CLERK_SECRET_KEY`.
2. Clerk → Users → o teu utilizador → **Public metadata**: `{ "role": "admin" }`.
3. Clerk → Sessions → **Customize session token**: `{ "metadata": "{{user.public_metadata}}" }`.
4. `pnpm dev` — o `routeTree.gen.ts` regenera sozinho. Abre `/admin`.

Sem sessão → `/admin/sign-in`. Com sessão mas sem `role: "admin"` → `/`.

## Rotas

| Ficheiro                                                                                                                           | URL                                           |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `admin/sign-in/$.tsx`                                                                                                              | `/admin/sign-in` (Clerk, fora do guard)       |
| `admin/_panel/route.tsx`                                                                                                           | layout pathless: guard + sidebar + Toaster    |
| `_panel/index.tsx`                                                                                                                 | `/admin` — dashboard                          |
| `_panel/artigos/index.tsx`                                                                                                         | `/admin/artigos`                              |
| `_panel/artigos/$slug.tsx`                                                                                                         | `/admin/artigos/:slug` — editor (`novo` cria) |
| `_panel/categorias.tsx`, `projectos.tsx`, `experiencia.tsx`, `skills.tsx`, `depoimentos.tsx`, `servicos-faq.tsx`, `newsletter.tsx` | tabelas genéricas (`CrudPage`)                |
| `_panel/creative.tsx`                                                                                                              | grelha com filtros                            |
| `_panel/mensagens.tsx`                                                                                                             | caixa de entrada (`?id=&tab=`)                |
| `_panel/perfil.tsx`                                                                                                                | perfil do site                                |

## Estrutura

- `services/utils/crud.ts` — `createCrudService(resource, seed)`: `list / create / update / remove`, mesmo contrato `IApiResponse` dos teus services. Hoje usa um store em memória; cada método tem o pedido `adminClient` comentado ao lado.
- `services/admin/index.ts` — uma instância por recurso + `profile`. `services/admin/keys.ts` — query keys.
- `lib/client/admin.ts` — axios com o token da sessão Clerk.
- `shared/@types/admin.d.ts` — tipos admin; os enums seguem o `schema.prisma` (`DRAFT/PUBLISHED…`, `NEW/READ…`).
- `components/admin/` — `atoms` (ui, status-pill, toggle, image-input), `molecules` (sidebar, page-header, data-table, entity-drawer, empty-state), `organisms/crud-page`, `crud/configs.tsx` (colunas, campos e validação zod por recurso).

Para um recurso novo: um config em `configs.tsx` + um ficheiro de rota com `<CrudPage config={…} />`.

## Notas

- O store em memória reinicia ao recarregar e é separado entre servidor e cliente. É para desenvolver a UI; liga a API antes de confiar nos dados.
- Uploads (`ImageInput`, resume) guardam data URLs/nome do ficheiro. Falta o envio para o storage — ver `MediaAsset` no schema.
- `IPost.category` guarda o **título** ("Arquitectura") mas o filtro do `/blog` compara com o **slug** ("arquitectura") — hoje só "Todos" mostra artigos. O editor mantém o título para não partir dados; recomendo passar a slug nos dois lados.
- A sidebar está escondida abaixo de `lg`. Falta um menu mobile se fores usar o backoffice no telemóvel.
