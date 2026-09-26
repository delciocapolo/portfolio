import { Link, createFileRoute } from "@tanstack/react-router";
import { Socials } from "@src/components/atoms/socials";
import { Placeholder } from "@src/components/atoms/placeholder";
import { SectionTitle } from "@src/components/atoms/section";
import { ContactForm } from "@src/components/molecules/contact-form";
import { useQuery } from "@tanstack/react-query";
import { resumeService } from "@src/services/resume/index.service";
import { getResponseData } from "@src/components/utils";
import { cn } from "@src/lib/utils";
import { articleService } from "@src/services/article/index.service";
import { creativeService } from "@src/services/creative/index.service";
import { Icon } from "@iconify/react";
import Container from "@src/components/atoms/container";
import type {
  IExperience,
  IProject,
  IResumeMe,
  ISkill,
  ITestimonial,
} from "@src/services/resume/types";

interface ILoaderData {
  me: IResumeMe;
  skills: ISkill[];
  experiences: IExperience[];
  projects: IProject[];
  testimonials: ITestimonial[];
}

export const Route = createFileRoute("/")({
  loader: async () => {
    const data = await Promise.all([
      resumeService.me(),
      resumeService.listSkills(),
      resumeService.listExperiences(),
      resumeService.listProjects(),
      resumeService.listTestimonials(),
    ]);

    return {
      me: getResponseData(data[0]),
      skills: getResponseData(data[1]),
      experiences: getResponseData(data[2]),
      projects: getResponseData(data[3]),
      testimonials: getResponseData(data[4]),
    };
  },
  component: Home,
});

function Home() {
  const resume: ILoaderData = Route.useLoaderData();
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await articleService.listPosts();
      return data;
    },
  });
  const { data: artworks } = useQuery({
    queryKey: ["artworks"],
    queryFn: async () => {
      const { data } = await creativeService.listArtworks();
      return data;
    },
  });

  return (
    <>
      {/* Hero */}
      <Container className="flex flex-wrap items-center gap-12 px-6 pt-18 pb-0">
        <div className="min-w-[300px] flex-1 basis-[420px]">
          <h1 className="m-0 mb-6.5 text-headline-56 leading-[1.18] font-medium tracking-[-0.03em]">
            Hello, <span className="font-extrabold">World.</span>
            <br />
            <span className="font-extrabold">Fullstack</span>{" "}
            <span className="font-extrabold text-stroke">Developer</span>
            <br />
            Sediado em <span className="font-extrabold">Angola.</span>
          </h1>
          <p className="m-0 mb-9 max-w-[440px] text-body-14 text-neutral-600">
            Construo produtos de ponta a ponta, do schema da base de dados à
            última animação da interface. Type-safed nas duas pontas, entregas
            pequenas e código que se lê.
          </p>
          <Socials firstFull />
        </div>

        <div className="min-w-[300px] flex-1 basis-[420px]">
          <div className="h-[clamp(300px,34vw,420px)]">
            <Placeholder label="Ilustração do herói" />
          </div>
          <div className="bg-ink mt-3.5 h-[3px]" />
        </div>
      </Container>

      {/* Skills */}
      <Container>
        <SectionTitle
          center
          title="Skills"
          description="My"
          className="mb-12"
        />
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-5">
          {resume?.skills?.map((skill, i) => (
            <li
              key={i}
              className={cn(
                "border-ink flex aspect-square flex-col items-center justify-center gap-4.5 rounded-xl border-2 transition-transform hover:-translate-y-1 bg-white",
                "hover:bg-ink hover:text-white",
              )}
            >
              <Icon icon={skill.icon} className="text-3xl" />
              <div className="text-[13px] font-semibold">{skill.name}</div>
            </li>
          ))}
        </ul>
      </Container>

      {/* Experience */}
      <Container className="bg-ink px-6 py-22 text-white max-w-none">
        <div className="mx-auto max-w-[1000px]">
          <SectionTitle
            center
            description="My"
            title="Experience"
            className="mb-12"
          />
          <ul className="flex flex-col gap-5">
            {resume?.experiences?.map((experience, i) => (
              <li
                key={i}
                className={cn(
                  "rounded-md border border-neutral-800 px-7.5 py-7 bg-panel",
                  "hover:bg-black transition-transform hover:-translate-y-1",
                )}
              >
                <div className="mb-3.5 flex flex-wrap items-center justify-between gap-5">
                  <div className="flex items-center gap-3.5">
                    <span className="text-ink flex size-7.5 items-center justify-center rounded-full bg-white text-xs font-extrabold">
                      {experience.logo}
                    </span>
                    <span className="text-headline-20 tracking-[-0.01em]">
                      {experience.role}
                    </span>
                  </div>
                  <span className="text-body-14 font-medium text-neutral-400">
                    {experience.period}
                  </span>
                </div>
                <p className="m-0 max-w-[760px] text-body-16 leading-relaxed text-neutral-400">
                  {experience.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* About Me */}
      <Container className="flex flex-wrap items-center gap-16">
        <div className="min-w-[280px] flex-1 basis-[360px]">
          <div className="border-ink h-[clamp(300px,34vw,400px)] rounded-[3px] border-2">
            <Placeholder label="Retrato ou ilustração" />
          </div>
        </div>
        <div className="min-w-[300px] flex-1 basis-[420px]">
          <SectionTitle description="About" title="Me" className="mb-6.5" />
          <p className="m-0 mb-4.5 text-sm leading-[1.85] text-neutral-700">
            Sou desenvolvedor fullstack em Luanda, com sete anos a escrever
            código. Trabalho sobretudo com React, Next.js, Nest.js e Prisma, e
            gosto de produtos onde a decisão técnica e a decisão de interface
            são a mesma conversa.
          </p>
          <p className="m-0 mb-4.5 text-sm leading-[1.85] text-neutral-700">
            A maior parte do que sei aprendi a resolver problemas reais em
            equipas pequenas, onde não há ninguém para quem delegar. Isso
            deixou-me confortável em qualquer ponta da stack.
          </p>
          <p className="m-0 mb-7 text-sm leading-[1.85] text-neutral-700">
            Fora do editor tiro fotografias, ando por espaços que me interessam
            e escrevo sobre o que aprendo.
          </p>
          <Link
            to="/about"
            className="border-ink inline-flex items-center gap-2 border-b-2 pb-0.5 text-sm font-bold"
          >
            Ler a história completa
            <Icon icon={"lucide:square-arrow-out-up-right"} />
          </Link>
        </div>
      </Container>

      {/* Projects */}
      <Container className="max-w-none bg-ink px-6 py-22 text-white">
        <Container className="py-0 px-0">
          <SectionTitle
            center
            description="My"
            title="Projects"
            className="mb-14"
          />
          <ul className="flex flex-col gap-10">
            {resume?.projects?.map((p, i) => (
              <li
                key={i}
                className={cn(
                  "flex flex-wrap items-center gap-10",
                  i % 2 === 1 ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div className="min-w-[280px] flex-1 basis-[380px]">
                  <div className="h-[clamp(240px,28vw,320px)] overflow-hidden rounded-md">
                    <Placeholder label="Screenshot do projecto" dark />
                  </div>
                </div>
                <div className="min-w-[280px] flex-1 basis-[380px]">
                  <div className="mb-4 text-[34px] font-extrabold tracking-[-0.02em]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="m-0 mb-3.5 text-headline-24 font-bold tracking-[-0.01em]">
                    {p.title}
                  </h3>
                  <p className="m-0 mb-5 max-w-[520px] text-body-16 leading-[1.8] text-neutral-400">
                    {p.description}
                  </p>
                  <div className="mb-5.5 text-body-14 font-semibold tracking-[0.1em] text-neutral-500 uppercase">
                    {p.stacks}
                  </div>
                  <Link
                    to="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl text-white no-underline hover:opacity-70 flex items-start py-3"
                  >
                    <Icon icon={"lucide:square-arrow-out-up-right"} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Container>

      {/* Do Blog */}
      <Container className="mx-auto max-w-[1216px] px-6 py-24 pb-0">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionTitle description="Do" title="Blog" />
          <Link
            to="/blog"
            className="border-ink border-b-2 pb-0.5 text-sm font-bold flex-center gap-2"
          >
            Ver todos os artigos
            <Icon icon={"lucide:square-arrow-out-up-right"} />
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {posts?.slice(0, 3)?.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="card-lift border-ink flex flex-col gap-3 rounded-[3px] border-2 p-6.5 no-underline"
            >
              <span className="text-body-12 font-bold tracking-[0.16em] uppercase">
                {p.category}
              </span>
              <span className="flex-1 text-headline-20 leading-snug tracking-[-0.01em]">
                {p.title}
              </span>
              <span className="text-body-14 font-medium text-neutral-500">
                {p.postedAt} · {p.readTime}
              </span>
            </Link>
          ))}
        </div>
      </Container>

      {/* Do Creative */}
      <Container className="pb-0">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
          <SectionTitle description="Do" title="Creative" />
          <Link
            to="/creative"
            className={cn(
              "flex-center gap-2",
              "border-ink border-b-2 pb-0.5 text-body-16 font-bold",
            )}
          >
            Ver a galeria
            <Icon icon={"lucide:square-arrow-out-up-right"} />
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          {artworks?.slice(0, 4)?.map((t) => (
            <Link
              key={t.id}
              to="/creative"
              className="border-ink rounded-xl border-2 no-underline"
            >
              <div className="border-ink h-55 border-b-2">
                <Placeholder label={t.legend} />
              </div>
              <div className="px-4 py-3.5 text-body-14 font-semibold">
                {t.legend}
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* Testimonial */}
      <Container className="pb-0">
        <SectionTitle
          center
          description="My"
          className="mb-12"
          title="Testimonial"
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] items-center gap-6">
          {resume?.testimonials?.map((d) => {
            return (
              <div
                key={d.name}
                className={cn(
                  "rounded border px-7 py-10 text-center duration-150",
                  "hover:bg-ink hover:border-ink hover:text-white",
                  "border-neutral-200 bg-neutral-50",
                )}
              >
                <div
                  className={cn(
                    "mx-auto mb-6 size-16 rounded-full border border-black duration-150",
                    "hover:border-white",
                  )}
                />
                <p className="m-0 mb-6 text-body-16 leading-[1.8]">
                  {d.description}
                </p>
                <div
                  className={cn(
                    "mx-auto mb-4 h-px w-10 duration-150",
                    "hover:bg-white bg-black",
                  )}
                />
                <div className="text-body-16 font-bold">{d.name}</div>
                <div className="mt-1 text-body-14 opacity-60">{d.role}</div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Let's talk */}
      <Container className="flex flex-wrap items-start gap-16">
        <div className="min-w-[300px] flex-1 basis-[380px]">
          <ContactForm />
        </div>
        <div className="min-w-[300px] flex-1 basis-[380px]">
          <h2 className="m-0 mb-5 text-[clamp(28px,3.6vw,42px)] leading-tight font-extrabold tracking-[-0.025em]">
            Vamos <span className="text-stroke">conversar</span>
            <br />O que tens em mente?
          </h2>
          <p className="m-0 mb-7 max-w-[460px] text-body-16 leading-[1.85] text-neutral-600">
            Conta-me o que estás a construir. Respondo a todas as mensagens,
            normalmente em menos de 24 horas.
          </p>
          <a
            href={`mailto:${resume?.me?.email}`}
            className="border-ink border-b-2 pb-0.5 text-headline-24 font-bold tracking-[-0.02em]"
          >
            {resume?.me?.email}
          </a>
        </div>
      </Container>
    </>
  );
}
