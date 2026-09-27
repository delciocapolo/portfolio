import { Link, createFileRoute } from "@tanstack/react-router";
import { Eyebrow } from "@src/components/atoms/eyebrow";
import { SectionTitle } from "@src/components/atoms/section";
import { Placeholder } from "@src/components/atoms/placeholder";
import { useQuery } from "@tanstack/react-query";
import { resumeService } from "@src/services/resume/index.service";
import { getResponseData } from "@src/components/utils";
import Container from "@src/components/atoms/container";
import { cn } from "@src/lib/utils";

export const Route = createFileRoute("/about/")({
  head: () => ({ meta: [{ title: "Sobre Mim — Délcio Capolo" }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: resume } = useQuery({
    queryKey: ["all-categories"],
    queryFn: async () => {
      const data = await Promise.all([
        resumeService.me(),
        resumeService.listSkills(),
        resumeService.listExperiences(),
        resumeService.listProjects(),
        resumeService.listExperienceResume(),
        resumeService.listStacks(),
        resumeService.listProcess(),
      ]);

      return {
        me: getResponseData(data[0]),
        skills: getResponseData(data[1]),
        experiences: getResponseData(data[2]),
        projects: getResponseData(data[3]),
        experienceResume: getResponseData(data[4]),
        stacks: getResponseData(data[5]),
        process: getResponseData(data[6]),
      };
    },
  });

  return (
    <>
      <Container className="flex flex-wrap items-start gap-16 pt-20 pb-16">
        <div className="min-w-[300px] flex-1 basis-[440px]">
          <Eyebrow>Sobre Mim</Eyebrow>
          <h1 className="m-0 mb-7 text-display-72 leading-[1.03] font-medium tracking-[-0.035em]">
            Programo desde os
            <br />
            <span className="font-extrabold">dezesseis</span>. Ainda
            <br />
            não me passou.
          </h1>
          <p className="m-0 mb-5.5 max-w-[560px] text-body-16 leading-[1.8] text-neutral-700">
            Sou desenvolvedor fullstack em Luanda. Trabalho sobretudo com
            TypeScript nas duas pontas: Angular e React no cliente, Nest.js e
            Prisma no servidor. Gosto de produtos onde a decisão técnica e a
            decisão de interface são a mesma conversa.
          </p>
          <p className="m-0 mb-5.5 max-w-[560px] text-body-16 leading-[1.8] text-neutral-700">
            Comecei a construir coisas porque queria ver o que acontecia.
            Continuo pela mesma razão, só que agora com clientes, prazos e
            testes. A maior parte do que sei aprendi a resolver problemas reais
            em projectos pequenos, onde não há ninguém para quem delegar.
          </p>
          <p className="m-0 max-w-[560px] text-body-16 leading-[1.8] text-neutral-700">
            Fora do editor tiro fotografias, ando por espaços que me interessam
            e desenho ideias que raramente saem do caderno.
          </p>
        </div>
        <div className="min-w-[280px] flex-1 basis-[420px]">
          <div className="border-ink h-[clamp(360px,44vw,520px)] rounded-xl border-2">
            <Placeholder label="Retrato" />
          </div>
        </div>
      </Container>

      <Container className="py-0">
        <div
          className={cn(
            "border-ink border-t-2 border-b-2",
            "grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] place-items-center text-center",
          )}
        >
          {resume?.experienceResume?.map((experienceResume) => (
            <div
              key={experienceResume.label}
              className="px-7 py-8 lg:first:pl-0 lg:last:pr-0"
            >
              <div className="text-headline-56 leading-none font-extrabold tracking-[-0.03em] text-center">
                {experienceResume.value}
              </div>
              <div className="mt-2 text-body-16 font-medium text-neutral-500">
                {experienceResume.label}
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <SectionTitle description="O meu" title="percurso" className="mb-12" />
        <div className="flex flex-col">
          {resume?.experiences?.map((experience) => (
            <div
              key={experience.period}
              className="flex flex-wrap gap-10 border-t border-neutral-300 py-8"
            >
              <div className="basis-[120px] text-body-16 font-bold tracking-wide">
                {experience.period}
              </div>
              <div className="min-w-[260px] flex-1 basis-[320px]">
                <div className="mb-1.5 text-headline-24 font-bold tracking-[-0.01em]">
                  {experience.role}
                </div>
                <div className="mb-3 text-body-16 font-semibold text-neutral-500">
                  {experience.location}
                </div>
                <p className="m-0 max-w-[620px] text-body-18 leading-[1.75] text-neutral-700">
                  {experience.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container className="max-w-none bg-ink px-6 py-22 text-white">
        <Container className="px-0 py-0">
          <SectionTitle description="A minha" title="stack" className="mb-12" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {resume?.stacks?.map((stack) => (
              <div key={stack.category} className="bg-panel rounded-lg p-8">
                <div className="mb-4.5 text-body-12 font-bold tracking-[0.16em] text-neutral-500 uppercase">
                  {stack.category}
                </div>
                <ul className="m-0 list-none p-0 text-body-16 leading-loose font-medium">
                  {stack.items?.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Container>

      <Container className="py-22">
        <SectionTitle description="Como" title="trabalho" className="mb-12" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
          {resume?.process?.map((process) => (
            <div
              key={process.title}
              className="border-ink rounded-xl border-2 p-8"
            >
              <div className="mb-3 text-headline-20">{process.title}</div>
              <p className="m-0 text-body-16 leading-[1.75] text-neutral-700">
                {process.description}
              </p>
            </div>
          ))}
        </div>
      </Container>

      <Container className="pt-0">
        <div className="border-ink flex flex-wrap items-center justify-between gap-8 rounded-xl border-2 p-12">
          <div>
            <div className="mb-2.5 text-headline-40 font-medium tracking-[-0.02em]">
              Tens um projecto <span className="font-extrabold">em mãos?</span>
            </div>
            <div className="text-body-18 text-neutral-600">
              Conta-me o que estás a construir. Respondo em menos de 24 horas.
            </div>
          </div>
          <Link
            to="/contact"
            className="bg-ink rounded px-8 py-4 text-body-18 font-semibold whitespace-nowrap text-white no-underline hover:opacity-85"
          >
            Entrar em Contacto
          </Link>
        </div>
      </Container>
    </>
  );
}
