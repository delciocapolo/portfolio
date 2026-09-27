export interface IResumeMe {
  fuso: string;
  email: string;
  location: string;
  isAvailable: boolean;
}

export interface ISkill {
  name: string;
  icon: string;
}

export interface IExperience {
  logo: string;
  role: string;
  period: string;
  location: string;
  company: string;
  description: string;
}

export interface IProject {
  url: string;
  title: string;
  stacks: string[];
  isOnline: boolean;
  description: string;
}

export interface ITestimonial {
  name: string;
  role: string;
  company?: string;
  description: string;
}

export interface IService {
  name: string;
  description: string;
}

export interface IStack {
  category: string;
  items: string[];
}

export interface IProcess {
  title: string;
  description: string;
}

export interface IExperienceResume {
  value: string;
  label: string;
}
