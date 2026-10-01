import { Icon } from "@iconify/react";
import { z } from "zod";
import { adminServices } from "@src/services/admin";
import { adminKeys } from "@src/services/admin/keys";
import type {
  IAdminCategory,
  IAdminExperience,
  IAdminFaq,
  IAdminProject,
  IAdminService,
  IAdminSkill,
  IAdminTestimonial,
  ISubscriber,
  SkillGroup,
} from "@src/shared/@types/admin";
import type { ICrudConfig } from "../organisms/crud-page";

const slugRule = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug: só minúsculas, números e hífens");
const required = (msg: string) => z.string().trim().min(1, msg);

export const categoriesConfig: ICrudConfig<IAdminCategory> = {
  queryKey: adminKeys.categories,
  service: adminServices.categories,
  crumb: "Conteúdo",
  title: "Categorias",
  description:
    "Taxonomias do blog e do Creative. A ordem define a sequência dos filtros no site.",
  singular: "categoria",
  newLabel: "Nova categoria",
  createdLabel: "Categoria criada",
  defaults: { title: "", slug: "", type: "blog", order: 0 },
  schema: z.object({ title: required("O nome é obrigatório"), slug: slugRule }),
  columns: [
    { key: "title", label: "Nome", kind: "strong", width: "minmax(0,2fr)" },
    { key: "slug", label: "Slug", kind: "mono", width: "minmax(0,1.5fr)" },
    {
      key: "type",
      label: "Tipo",
      kind: "pill",
      width: "110px",
      pill: (r) => ({
        label: r.type === "blog" ? "Blog" : "Creative",
        tone: "outline",
      }),
    },
    { key: "order", label: "Ordem", kind: "mono", width: "70px" },
  ],
  fields: [
    { key: "title", label: "Nome", type: "text" },
    {
      key: "slug",
      label: "Slug",
      type: "mono",
      hint: "Minúsculas e hífens. Usado nos filtros e no URL.",
    },
    {
      key: "type",
      label: "Tipo",
      type: "select",
      options: [
        { value: "blog", label: "Blog" },
        { value: "creative", label: "Creative" },
      ],
    },
    { key: "order", label: "Ordem", type: "number" },
  ],
};

export const projectsConfig: ICrudConfig<IAdminProject> = {
  queryKey: adminKeys.projects,
  service: adminServices.projects,
  crumb: "Portfolio",
  title: "Projectos",
  description:
    "Secção My Projects da home. A ordem define a alternância esquerda/direita.",
  singular: "projecto",
  newLabel: "Novo projecto",
  createdLabel: "Projecto criado",
  defaults: {
    title: "",
    description: "",
    url: "",
    stacks: [],
    isOnline: false,
    cover: "",
  },
  schema: z.object({
    title: required("O título é obrigatório"),
    url: z
      .string()
      .refine((v) => v === "" || z.url().safeParse(v).success, "URL inválida"),
  }),
  columns: [
    { key: "title", label: "Título", kind: "strong", width: "minmax(0,2fr)" },
    { key: "stacks", label: "Stack", kind: "text", width: "minmax(0,1.6fr)" },
    {
      key: "isOnline",
      label: "Estado",
      kind: "pill",
      width: "100px",
      pill: (r) =>
        r.isOnline
          ? { label: "Online", tone: "success" }
          : { label: "Offline", tone: "muted" },
    },
  ],
  fields: [
    { key: "cover", label: "Screenshot", type: "image" },
    { key: "title", label: "Título", type: "text" },
    { key: "description", label: "Descrição", type: "textarea" },
    { key: "url", label: "URL", type: "mono", placeholder: "https://" },
    {
      key: "stacks",
      label: "Stack",
      type: "tags",
      placeholder: "Next.js, WebSockets",
      hint: "Separadas por vírgula.",
    },
    {
      key: "isOnline",
      label: "Online",
      type: "toggle",
      on: "Link activo no site",
      off: "Sem link",
    },
  ],
};

export const experiencesConfig: ICrudConfig<IAdminExperience> = {
  queryKey: adminKeys.experiences,
  service: adminServices.experiences,
  crumb: "Portfolio",
  title: "Experiência",
  description:
    "Alimenta My Experience na home e o percurso na página About Me.",
  singular: "experiência",
  newLabel: "Nova experiência",
  createdLabel: "Experiência criada",
  defaults: {
    role: "",
    company: "",
    logo: "",
    period: "",
    location: "",
    description: "",
  },
  schema: z.object({
    role: required("O cargo é obrigatório"),
    period: required("O período é obrigatório"),
  }),
  columns: [
    { key: "role", label: "Cargo", kind: "strong", width: "minmax(0,2fr)" },
    {
      key: "company",
      label: "Empresa",
      kind: "text",
      width: "minmax(0,1.2fr)",
    },
    { key: "period", label: "Período", kind: "text", width: "140px" },
    { key: "location", label: "Local", kind: "text", width: "minmax(0,1fr)" },
  ],
  fields: [
    { key: "role", label: "Cargo", type: "text" },
    { key: "company", label: "Empresa", type: "text" },
    {
      key: "logo",
      label: "Sigla do logo",
      type: "text",
      hint: "Duas letras no círculo branco.",
    },
    {
      key: "period",
      label: "Período",
      type: "text",
      placeholder: "2024 — Presente",
    },
    { key: "location", label: "Local", type: "text" },
    { key: "description", label: "Descrição", type: "textarea" },
  ],
};

const GROUP_LABEL: Record<SkillGroup, string> = {
  frontend: "Frontend",
  backend: "Backend",
  tools: "Ferramentas",
  learning: "A aprender",
};

export const skillsConfig: ICrudConfig<IAdminSkill> = {
  queryKey: adminKeys.skills,
  service: adminServices.skills,
  crumb: "Portfolio",
  title: "Skills e stack",
  description: "Grelha My Skills da home. O ícone usa nomes do Iconify.",
  singular: "skill",
  newLabel: "Nova skill",
  createdLabel: "Skill criada",
  defaults: { name: "", icon: "", group: "backend" },
  schema: z.object({
    name: required("O nome é obrigatório"),
    icon: required("Indica o ícone Iconify"),
  }),
  columns: [
    { key: "name", label: "Nome", kind: "strong", width: "minmax(0,1.6fr)" },
    {
      key: "icon",
      label: "Ícone",
      width: "minmax(0,1.6fr)",
      render: (r) => (
        <span className="flex min-w-0 items-center gap-2.5">
          <Icon icon={r.icon} className="shrink-0 text-lg" />
          <code className="truncate font-code text-[12px] text-neutral-600">
            {r.icon}
          </code>
        </span>
      ),
    },
    {
      key: "group",
      label: "Grupo",
      kind: "pill",
      width: "130px",
      pill: (r) => ({ label: GROUP_LABEL[r.group], tone: "outline" }),
    },
  ],
  fields: [
    { key: "name", label: "Nome", type: "text" },
    {
      key: "icon",
      label: "Ícone Iconify",
      type: "mono",
      placeholder: "bi:typescript",
      hint: "Pesquisa em icon-sets.iconify.design",
    },
    {
      key: "group",
      label: "Grupo",
      type: "select",
      options: Object.entries(GROUP_LABEL).map(([value, label]) => ({
        value,
        label,
      })),
    },
  ],
};

export const testimonialsConfig: ICrudConfig<IAdminTestimonial> = {
  queryKey: adminKeys.testimonials,
  service: adminServices.testimonials,
  crumb: "Portfolio",
  title: "Depoimentos",
  description:
    "Secção My Testimonial da home. O do meio aparece em fundo preto.",
  singular: "depoimento",
  newLabel: "Novo depoimento",
  createdLabel: "Depoimento criado",
  defaults: { name: "", role: "", company: "", description: "" },
  schema: z.object({
    name: required("O nome é obrigatório"),
    description: required("Escreve o depoimento"),
  }),
  columns: [
    { key: "name", label: "Nome", kind: "strong", width: "minmax(0,1.2fr)" },
    { key: "role", label: "Papel", kind: "text", width: "minmax(0,1fr)" },
    {
      key: "description",
      label: "Texto",
      kind: "text",
      width: "minmax(0,2.6fr)",
    },
  ],
  fields: [
    { key: "name", label: "Nome", type: "text" },
    { key: "role", label: "Papel", type: "text" },
    { key: "company", label: "Empresa", type: "text" },
    { key: "description", label: "Depoimento", type: "textarea" },
  ],
};

export const servicesConfig: ICrudConfig<IAdminService> = {
  queryKey: adminKeys.services,
  service: adminServices.services,
  crumb: "Portfolio",
  title: "Serviços",
  description: 'Cards pretos "Como posso ajudar" na página Contact Me.',
  singular: "serviço",
  newLabel: "Novo serviço",
  createdLabel: "Serviço criado",
  defaults: { name: "", description: "" },
  schema: z.object({ name: required("O nome é obrigatório") }),
  columns: [
    { key: "name", label: "Serviço", kind: "strong", width: "minmax(0,1.4fr)" },
    {
      key: "description",
      label: "Descrição",
      kind: "text",
      width: "minmax(0,3fr)",
    },
  ],
  fields: [
    { key: "name", label: "Serviço", type: "text" },
    { key: "description", label: "Descrição", type: "textarea" },
  ],
};

export const faqConfig: ICrudConfig<IAdminFaq> = {
  queryKey: adminKeys.faq,
  service: adminServices.faq,
  crumb: "Portfolio",
  title: "FAQ",
  description: "Perguntas frequentes no fim da página Contact Me.",
  singular: "pergunta",
  newLabel: "Nova pergunta",
  createdLabel: "Pergunta criada",
  defaults: { question: "", answer: "" },
  schema: z.object({
    question: required("Escreve a pergunta"),
    answer: required("Escreve a resposta"),
  }),
  columns: [
    {
      key: "question",
      label: "Pergunta",
      kind: "strong",
      width: "minmax(0,1.6fr)",
    },
    {
      key: "answer",
      label: "Resposta",
      kind: "text",
      width: "minmax(0,2.4fr)",
    },
  ],
  fields: [
    { key: "question", label: "Pergunta", type: "text" },
    { key: "answer", label: "Resposta", type: "textarea" },
  ],
};

export const subscribersConfig: ICrudConfig<ISubscriber> = {
  queryKey: adminKeys.subscribers,
  service: adminServices.subscribers,
  crumb: "Site",
  title: "Newsletter",
  description: 'Subscrições feitas no bloco "Um email por mês" do blog.',
  singular: "subscritor",
  newLabel: "Novo subscritor",
  createdLabel: "Subscritor adicionado",
  defaults: { email: "", confirmed: false, createdAt: "" },
  schema: z.object({ email: z.email("Email inválido") }),
  columns: [
    { key: "email", label: "Email", kind: "strong", width: "minmax(0,2fr)" },
    {
      key: "confirmed",
      label: "Estado",
      kind: "pill",
      width: "130px",
      pill: (r) =>
        r.confirmed
          ? { label: "Confirmado", tone: "success" }
          : { label: "Pendente", tone: "warning" },
    },
    { key: "createdAt", label: "Subscreveu", kind: "text", width: "130px" },
  ],
  fields: [
    { key: "email", label: "Email", type: "text" },
    {
      key: "confirmed",
      label: "Confirmado",
      type: "toggle",
      on: "Email confirmado",
      off: "À espera de confirmação",
    },
  ],
};
