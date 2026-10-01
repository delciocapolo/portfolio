import { posts, categoriasBlog } from "@src/data/posts";
import { categoriasCreative } from "@src/data/creative";
import type {
  IAdminCategory,
  IAdminPost,
  IAdminSkill,
  IContactMessage,
  ISubscriber,
  SkillGroup,
} from "@src/shared/@types/admin";
import { skills } from "@src/data/site";

const SAMPLE_CONTENT = `Durante três projectos seguidos escrevi a mesma camada de tipos duas vezes: uma no servidor, outra no cliente. Na quarta vez decidi parar e perguntar porquê.

## O que o REST me estava a custar

Não era performance. Era o tempo entre mudar o backend e descobrir que o frontend estava errado.

> Um tipo partilhado não é uma optimização técnica. É um alarme que dispara antes do utilizador.

## A primeira meia hora

\`\`\`ts
export const appRouter = router({
  projectos: publicProcedure.query(() => db.projecto.findMany()),
})
\`\`\`

A partir daqui o editor sabe o que o endpoint devolve.`;

export const seedPosts: IAdminPost[] = [
  ...posts.map((p, i) => ({
    ...p,
    id: `post-${p.slug}`,
    status: i < 3 ? ("PUBLISHED" as const) : ("DRAFT" as const),
    views: [1284, 962, 2140, 0, 0, 0][i] ?? 0,
    featured: i < 2,
    tags: [],
    content: i === 0 ? SAMPLE_CONTENT : "",
    postedAt: i < 3 ? p.postedAt : "",
  })),
  {
    id: "post-html-dialog-nativo",
    slug: "html-dialog-nativo",
    category: "Frontend",
    title: "O modal que já vem no HTML: a API <dialog>",
    summary:
      "showModal() dá-te camada de topo, foco preso e Esc sem JavaScript.",
    postedAt: "25 Set 2026",
    readTime: "6 min",
    status: "SCHEDULED",
    views: 0,
    featured: false,
    tags: ["HTML", "Acessibilidade"],
    content: "",
  },
];

const order = (
  arr: { slug: string; title: string }[],
  type: IAdminCategory["type"],
) =>
  arr
    .filter((c) => c.slug !== "all")
    .map((c, i) => ({
      id: `${type}-${c.slug}`,
      slug: c.slug,
      title: c.title,
      type,
      order: i + 1,
    }));

export const seedCategories: IAdminCategory[] = [
  ...order(categoriasBlog, "blog"),
  ...order(categoriasCreative, "creative"),
];

const GROUPS: Record<string, SkillGroup> = {
  TypeScript: "frontend",
  React: "frontend",
  "Next.js": "frontend",
  "Sass/Scss": "frontend",
  Docker: "tools",
  Git: "tools",
};

export const seedSkills: IAdminSkill[] = skills.map((s, i) => ({
  ...s,
  id: `skill-${i}`,
  group: GROUPS[s.name] ?? "backend",
}));

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3_600_000).toISOString();

export const seedMessages: IContactMessage[] = [
  {
    id: "msg-1",
    name: "Ana Ferreira",
    email: "ana.ferreira@mobilis.ao",
    website: "mobilis.ao",
    subject: "Plataforma de agendamentos para clínica",
    message:
      "Olá Délcio,\n\nSomos uma clínica com três unidades em Luanda e precisamos de um sistema de agendamentos com notificações em tempo real para a recepção. Vi o teu trabalho na Medicare e gostava de perceber se tens disponibilidade para Novembro.\n\nObrigada,\nAna",
    status: "NEW",
    origin: "contact",
    createdAt: hoursAgo(2),
  },
  {
    id: "msg-2",
    name: "João Kiala",
    email: "joao@kiala.co.ao",
    website: "kiala.co.ao",
    subject: "Revisão de arquitectura Node + RabbitMQ",
    message:
      "Temos filas a acumular em horas de pico e mensagens duplicadas. Procuramos uma revisão pontual de duas a três sessões.",
    status: "NEW",
    origin: "home",
    createdAt: hoursAgo(5),
  },
  {
    id: "msg-3",
    name: "Sofia Mendes",
    email: "sofia@studio.pt",
    website: "studio.pt",
    subject: "Site institucional para estúdio",
    message:
      "Gostávamos de um site simples, com portfolio e formulário de contacto. Prazo flexível.",
    status: "READ",
    origin: "contact",
    createdAt: hoursAgo(26),
  },
  {
    id: "msg-4",
    name: "Mark Ellis",
    email: "mark@homeiqo.co.uk",
    website: "homeiqo.co.uk",
    subject: "Nova fase do website",
    message:
      "Hi Délcio, we'd like to add online payments to the booking flow. Can we talk next week?",
    status: "REPLIED",
    origin: "contact",
    createdAt: hoursAgo(72),
  },
  {
    id: "msg-5",
    name: "SEO Growth",
    email: "offers@seo-growth.biz",
    website: "",
    subject: "Backlinks de alta autoridade",
    message: "Oferta limitada.",
    status: "SPAM",
    origin: "home",
    createdAt: hoursAgo(96),
  },
];

export const seedSubscribers: ISubscriber[] = [
  ["ana.ferreira@mobilis.ao", true, "24 Set 2026"],
  ["joao@kiala.co.ao", true, "22 Set 2026"],
  ["sofia@studio.pt", false, "21 Set 2026"],
  ["marta.n@gmail.com", true, "18 Set 2026"],
  ["p.lopes@outlook.com", true, "11 Set 2026"],
  ["dev.tomas@proton.me", false, "09 Set 2026"],
  ["e.santos@bfa.ao", true, "02 Set 2026"],
].map(([email, confirmed, createdAt], i) => ({
  id: `sub-${i}`,
  email: email as string,
  confirmed: confirmed as boolean,
  createdAt: createdAt as string,
}));
