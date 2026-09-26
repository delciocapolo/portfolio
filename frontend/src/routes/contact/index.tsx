import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@src/components/molecules/contact-form";
import { Eyebrow } from "@src/components/atoms/eyebrow";
import { Socials } from "@src/components/atoms/socials";
import { SectionTitle } from "@src/components/atoms/section";
import { Faq } from "@src/components/molecules/faq";
import { useQuery } from "@tanstack/react-query";
import { resumeService } from "@src/services/resume/index.service";
import { getResponseData } from "@src/components/utils";
import Container from "@src/components/atoms/container";
import { cn } from "@src/lib/utils";
import { Icon } from "@iconify/react";

export const Route = createFileRoute("/contact/")({
  head: () => ({ meta: [{ title: "Contact Me — Délcio Capolo" }] }),
  component: Contact,
});

function Contact() {
  const { data: resume } = useQuery({
    queryKey: ["all-categories"],
    queryFn: async () => {
      const data = await Promise.all([
        resumeService.me(),
        resumeService.listServices(),
      ]);

      return {
        me: getResponseData(data[0]),
        services: getResponseData(data[1]),
      };
    },
  });

  return (
    <>
      <Container className="pt-20 pb-14">
        <div className="border-ink mb-7 inline-flex items-center gap-2.5 rounded-full border-2 px-4.5 py-2 text-body-12 font-semibold">
          <span
            className={cn(
              "block size-2.5 rounded-full",
              resume?.me?.isAvailable ? "bg-emerald-500" : "bg-neutral-400",
            )}
          />
          {resume?.me?.isAvailable
            ? "Disponível para novos projectos"
            : "Agenda fechada até nova data"}
        </div>
        <h1 className="m-0 mb-6 text-display-80 leading-none font-medium tracking-[-0.035em]">
          Vamos <span className="font-extrabold">conversar</span>
          <br />O que tens em mente?
        </h1>
        <p className="m-0 max-w-[560px] text-body-18 leading-[1.75] text-neutral-600">
          Conta-me o que estás a construir. Respondo a todas as mensagens,
          normalmente em menos de 24 horas.
        </p>
      </Container>

      <Container className="flex flex-wrap items-start gap-16 pt-0">
        <div className="min-w-[300px] flex-1 basis-[380px]">
          <ContactForm />
        </div>

        <div className="flex min-w-[300px] flex-1 basis-[380px] flex-col gap-10">
          <div>
            <Eyebrow>Email direto</Eyebrow>
            <a
              href={`mailto:${resume?.me?.email}`}
              className="border-ink border-b-2 pb-0.5 text-headline-32 font-bold tracking-[-0.02em]"
            >
              {resume?.me?.email}
            </a>
          </div>
          <div>
            <Eyebrow>Onde estou</Eyebrow>
            <div className="text-body-18 font-semibold">
              {resume?.me?.location}
            </div>
            <div className="mt-1 text-body-16 text-neutral-600">
              {resume?.me?.fuso}
            </div>
          </div>
          <div>
            <Eyebrow>Redes</Eyebrow>
            <Socials />
          </div>
          <div className="border-ink rounded-[3px] border-2 p-7">
            <div className="mb-2 text-headline-24 font-bold tracking-[-0.01em]">
              Preferes falar ao vivo?
            </div>
            <p className="m-0 mb-5 text-body-16 leading-relaxed text-neutral-600">
              30 minutos, sem compromisso, para perceber se faz sentido
              trabalharmos juntos.
            </p>
            <a
              href="#"
              className="bg-ink inline-flex items-center gap-2.5 rounded px-6.5 py-3.5 text-body-16 font-semibold text-white no-underline hover:opacity-85"
            >
              Agendar chamada
              <Icon icon={"lucide:square-arrow-out-up-right"} />
            </a>
          </div>
        </div>
      </Container>

      <Container className="py-22 max-w-none bg-ink text-white">
        <Container className="py-0 px-0">
          <SectionTitle
            title="ajudar"
            description="Como posso"
            className="mb-12"
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-6">
            {resume?.services?.map((service, index) => (
              <div key={service.name} className="bg-panel rounded-lg p-8">
                <div className="mb-4.5 text-headline-40 font-extrabold">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="mb-2.5 text-headline-20 font-bold">
                  {service.name}
                </div>
                <p className="m-0 text-body-16 leading-[1.7] text-neutral-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Container>

      <Container className="max-w-[880px] py-22">
        <SectionTitle
          title="frequentes"
          description="Perguntas"
          className="mb-10"
        />
        <Faq />
      </Container>
    </>
  );
}
