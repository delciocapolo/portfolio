import { client } from "@src/lib/client";
import { handleResponseErrorMessage } from "../utils";
import type { IApiResponse } from "@src/shared/@types/api";
import { categoriasBlog, posts } from "@src/data/posts";
import type { IPost, IPostCategory } from "./types";

export const articleService = {
  listPosts: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IPost[]>>("/articles/posts");
      // return data;
      return { data: posts } as IApiResponse<IPost[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  listBlogCategories: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IPost[]>>("/articles/posts");
      // return data;
      return { data: categoriasBlog } as IApiResponse<IPostCategory[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
