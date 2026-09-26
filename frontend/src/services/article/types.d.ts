export interface IPost {
  slug: string;
  category: string;
  title: string;
  summary: string;
  postedAt: string;
  readTime: string;
}

export interface IPostCategory {
  slug: string;
  title: string;
}
