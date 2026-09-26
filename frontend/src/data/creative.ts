import type { IArtwork, IArtworkCategory } from "@src/services/creative/types";

export const pecas: Array<IArtwork> = [
  {
    id: "cr-01",
    legend: "Marginal ao amanhecer",
    location: "Luanda, Angola",
    category: "fotografia",
    height: 420,
  },
  {
    id: "cr-02",
    legend: "Estúdio, segunda-feira",
    location: "Espaços",
    category: "espacos",
    height: 300,
  },
  {
    id: "cr-03",
    legend: "Estudo de grelha em movimento",
    location: "Experimento",
    category: "design",
    height: 360,
    isVideo: true,
  },
  {
    id: "cr-04",
    legend: "Três dias em Cabo Verde",
    location: "Mindelo",
    category: "viagens",
    height: 480,
  },
  {
    id: "cr-05",
    legend: "Cadernos de 2025",
    location: "Sketches",
    category: "sketches",
    height: 320,
  },
  {
    id: "cr-06",
    legend: "Recepção em betão",
    location: "Interiores",
    category: "espacos",
    height: 400,
  },
  {
    id: "cr-07",
    legend: "Tipografia a preto sobre preto",
    location: "Experimento",
    category: "design",
    height: 280,
  },
  {
    id: "cr-08",
    legend: "Feira da Sé",
    location: "Luanda, Angola",
    category: "fotografia",
    height: 440,
  },
  {
    id: "cr-09",
    legend: "Loop de transições",
    location: "Motion",
    category: "video",
    height: 300,
    isVideo: true,
  },
  {
    id: "cr-10",
    legend: "Janelas da Ilha",
    location: "Luanda, Angola",
    category: "viagens",
    height: 380,
  },
  {
    id: "cr-11",
    legend: "Retratos de rua",
    location: "sketches",
    category: "sketches",
    height: 340,
  },
];

export const categoriasCreative: IArtworkCategory[] = [
  { slug: "all", title: "Tudo" },
  { slug: "fotografia", title: "Fotografia" },
  { slug: "espacos", title: "Espaços" },
  { slug: "viagens", title: "Viagens" },
  { slug: "design", title: "Design" },
  { slug: "sketches", title: "Sketches" },
  { slug: "video", title: "Vídeo" },
];
