import { createCrudService } from "../utils/crud";
import { handleResponseErrorMessage } from "../utils";
import type { IApiResponse } from "@src/shared/@types/api";
import { pecas } from "@src/data/creative";
import {
  depoimentos,
  experiencia,
  faq,
  perfil,
  projectos,
  servicos,
} from "@src/data/site";
import {
  seedCategories,
  seedMessages,
  seedPosts,
  seedSkills,
  seedSubscribers,
} from "@src/data/admin-seed";
import type {
  IAdminArtwork,
  IAdminCategory,
  IAdminExperience,
  IAdminFaq,
  IAdminPost,
  IAdminProfile,
  IAdminProject,
  IAdminService,
  IAdminSkill,
  IAdminTestimonial,
  IContactMessage,
  ISubscriber,
} from "@src/shared/@types/admin";
// import { adminClient } from "@src/lib/client/admin";

const withIds = <T extends object>(arr: T[], prefix: string) =>
  arr.map((item, i) => ({ ...item, id: `${prefix}-${i}` }));

let profileStore: IAdminProfile = {
  ...perfil,
  name: "Délcio Capolo",
  headline: "Back-end Developer",
  phone: "+244 935 785 831",
  resumeUrl: "/resume.pdf",
  socials: [
    { network: "LinkedIn", url: "https://www.linkedin.com/in/delciocapolo/" },
    { network: "GitHub", url: "https://github.com/delciocapolo" },
  ],
};

export const adminServices = {
  posts: createCrudService<IAdminPost>("posts", seedPosts),
  categories: createCrudService<IAdminCategory>("categories", seedCategories),
  artworks: createCrudService<IAdminArtwork>("artworks", pecas),
  projects: createCrudService<IAdminProject>(
    "projects",
    withIds(projectos, "project"),
  ),
  experiences: createCrudService<IAdminExperience>(
    "experiences",
    withIds(experiencia, "exp"),
  ),
  skills: createCrudService<IAdminSkill>("skills", seedSkills),
  testimonials: createCrudService<IAdminTestimonial>(
    "testimonials",
    withIds(depoimentos, "tst"),
  ),
  services: createCrudService<IAdminService>(
    "services",
    withIds(servicos, "svc"),
  ),
  faq: createCrudService<IAdminFaq>("faq", withIds(faq, "faq")),
  subscribers: createCrudService<ISubscriber>("subscribers", seedSubscribers),
  messages: createCrudService<IContactMessage>("messages", seedMessages),

  profile: {
    get: async () => {
      try {
        // const { data } = await adminClient.get<IApiResponse<IAdminProfile>>("/admin/profile");
        // return data;
        return { data: profileStore } as IApiResponse<IAdminProfile>;
      } catch (error: any) {
        throw new Error(handleResponseErrorMessage(error));
      }
    },
    update: async (payload: Partial<IAdminProfile>) => {
      try {
        // const { data } = await adminClient.patch<IApiResponse<IAdminProfile>>("/admin/profile", payload);
        // return data;
        profileStore = { ...profileStore, ...payload };
        return { data: profileStore } as IApiResponse<IAdminProfile>;
      } catch (error: any) {
        throw new Error(handleResponseErrorMessage(error));
      }
    },
  },
};
