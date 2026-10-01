import type { IPost } from "@src/services/article/types";
import type { IArtwork } from "@src/services/creative/types";
import type { IFaq } from "@src/services/faq/types";
import type {
  IExperience,
  IProject,
  IResumeMe,
  IService,
  ISkill,
  ITestimonial,
} from "@src/services/resume/types";

// Os enums seguem o schema.prisma (PostStatus, MessageStatus)
export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export type MessageStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED" | "SPAM";
export type CategoryType = "blog" | "creative";
export type SkillGroup = "frontend" | "backend" | "tools" | "learning";

export type WithId<T> = T & { id: string };

export interface IAdminPost extends IPost {
  id: string;
  status: PostStatus;
  views: number;
  featured: boolean;
  tags: string[];
  content: string;
  cover?: string;
}

export interface IAdminCategory {
  id: string;
  slug: string;
  title: string;
  type: CategoryType;
  order: number;
}

export interface IAdminArtwork extends IArtwork {
  cover?: string;
}

export type IAdminProject = WithId<IProject> & { cover?: string };
export type IAdminExperience = WithId<IExperience>;
export type IAdminSkill = WithId<ISkill> & { group: SkillGroup };
export type IAdminTestimonial = WithId<ITestimonial>;
export type IAdminService = WithId<IService>;
export type IAdminFaq = WithId<IFaq>;

export interface ISubscriber {
  id: string;
  email: string;
  confirmed: boolean;
  createdAt: string;
}

export interface IContactMessage {
  id: string;
  name: string;
  email: string;
  website: string;
  subject: string;
  message: string;
  status: MessageStatus;
  origin: "contact" | "home";
  createdAt: string;
}

export interface ISocialLink {
  network: string;
  url: string;
}

export interface IAdminProfile extends IResumeMe {
  name: string;
  headline: string;
  phone: string;
  resumeUrl: string;
  socials: ISocialLink[];
}
