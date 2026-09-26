import type { IPost } from "@src/services/article/types";

export const posts: Array<IPost> = [
  {
    slug: "rest-para-trpc",
    category: "Arquitectura",
    title: "Porque troquei REST por tRPC em três projectos seguidos",
    summary:
      "Escrever a mesma camada de tipos duas vezes tem um custo. Ao quarto projecto decidi medi-lo.",
    postedAt: "12 Mar 2026",
    readTime: "8 min",
  },
  {
    slug: "nest-prisma-estrutura",
    category: "Arquitectura",
    title: "Nest.js e Prisma: a estrutura que repito em todos os projectos",
    summary:
      "Módulos, casos de uso e migrações. A pasta que copio sempre que começo algo novo.",
    postedAt: "28 Fev 2026",
    readTime: "11 min",
  },
  {
    slug: "produto-internet-instavel",
    category: "Ensaio",
    title: "Construir produto em Angola com internet instável",
    summary:
      "Offline-first deixou de ser uma opção de arquitectura e passou a ser um requisito de contexto.",
    postedAt: "09 Fev 2026",
    readTime: "6 min",
  },
  {
    slug: "design-system-a-solo",
    category: "Frontend",
    title: "Design systems para quem programa sozinho",
    summary:
      "Não precisas de uma equipa de dez pessoas para ter tokens, escalas e componentes previsíveis.",
    postedAt: "21 Jan 2026",
    readTime: "9 min",
  },
  {
    slug: "tipos-que-pouparam-semanas",
    category: "TypeScript",
    title: "Os tipos que me pouparam semanas de debugging",
    summary:
      "Discriminated unions, template literals e o hábito de deixar o compilador fazer a pergunta difícil.",
    postedAt: "05 Jan 2026",
    readTime: "7 min",
  },
  {
    slug: "deploy-continuo-vps",
    category: "DevOps",
    title: "Deploy contínuo numa VPS de cinco dólares",
    summary:
      "Docker, um runner e vinte linhas de YAML. O suficiente para deixar de fazer deploys à mão.",
    postedAt: "14 Dez 2025",
    readTime: "10 min",
  },
];

export const categoriasBlog = [
  { slug: "all", title: "Todos" },
  { slug: "arquitectura", title: "Arquitectura" },
  { slug: "frontend", title: "Frontend" },
  { slug: "typescript", title: "TypeScript" },
  { slug: "devops", title: "DevOps" },
  { slug: "ensaio", title: "Ensaio" },
];

export function getPost(posts: IPost[], slug: string) {
  return posts.find((p) => p.slug === slug);
}
