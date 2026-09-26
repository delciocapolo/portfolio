import { client } from "@src/lib/client";
import { handleResponseErrorMessage } from "../utils";
import type { IApiResponse } from "@src/shared/@types/api";
import {
  depoimentos,
  experiencia,
  perfil,
  projectos,
  servicos,
  skills,
} from "@src/data/site";
import type {
  IExperience,
  IExperienceResume,
  IProcess,
  IProject,
  IResumeMe,
  IService,
  ISkill,
  IStack,
  ITestimonial,
} from "./types";

export const resumeService = {
  me: async () => {
    try {
      // const { data } = await client.get<IApiResponse<ISkill[]>>("/faq");
      // return data;
      return { data: perfil } as IApiResponse<IResumeMe>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  listSkills: async () => {
    try {
      // const { data } = await client.get<IApiResponse<ISkill[]>>("/faq");
      // return data;
      return { data: skills } as IApiResponse<ISkill[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  listExperiences: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IExperience[]>>("/experiences");
      // return data;
      return { data: experiencia } as IApiResponse<IExperience[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  listProjects: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IProject[]>>("/experiences");
      // return data;
      return { data: projectos } as IApiResponse<IProject[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  listTestimonials: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IProject[]>>("/experiences");
      // return data;
      return { data: depoimentos } as IApiResponse<ITestimonial[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  listServices: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IProject[]>>("/experiences");
      // return data;
      return { data: servicos } as IApiResponse<IService[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  listStacks: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IProject[]>>("/experiences");
      // return data;
      const data = [
        {
          category: "Frontend",
          items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        },
        {
          category: "Backend",
          items: ["Nest.js", "Node.js", "Prisma", "PostgreSQL"],
        },
        {
          category: "Ferramentas",
          items: ["Git e GitHub Actions", "Docker", "Figma", "Vitest"],
        },
        {
          category: "A aprender",
          items: ["Go", "Kubernetes", "Arquitectura orientada a eventos"],
        },
      ];

      return { data } as IApiResponse<IStack[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  listProcess: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IProject[]>>("/experiences");
      // return data;
      const data = [
        {
          title: "Primeiro o problema",
          description:
            "Antes de escolher a ferramenta quero entender o que falha hoje e para quem. A stack é a última decisão, não a primeira.",
        },
        {
          title: "Entregas pequenas",
          description:
            "Prefiro mostrar algo a funcionar todas as semanas do que desaparecer um mês e reaparecer com uma surpresa.",
        },
        {
          title: "Código que se lê",
          description:
            "Escrevo a pensar em quem vem depois, mesmo quando esse alguém sou eu daqui a seis meses.",
        },
      ];

      return { data } as IApiResponse<IProcess[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  listExperienceResume: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IProject[]>>("/experiences");
      // return data;
      const data = [
        { value: "7", label: "anos a escrever código" },
        { value: "30+", label: "projectos entregues" },
        { value: "12", label: "clientes recorrentes" },
        { value: "2", label: "produtos próprios em uso" },
      ];

      return { data } as IApiResponse<IExperienceResume[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
