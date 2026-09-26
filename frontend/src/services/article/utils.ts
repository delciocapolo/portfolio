import type { IPost } from "./types";

export function getPost(posts: IPost[], slug: string) {
  return posts.find((p) => p.slug === slug);
}
