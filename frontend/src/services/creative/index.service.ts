import { client } from "@src/lib/client";
import { handleResponseErrorMessage } from "../utils";
import type { IApiResponse } from "@src/shared/@types/api";
import { pecas, categoriasCreative } from "@src/data/creative";
import type { IArtwork, IArtworkCategory } from "./types";

export const creativeService = {
  listArtworks: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IPost[]>>("/articles/posts");
      // return data;
      return { data: pecas } as IApiResponse<IArtwork[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
  listArtworkCategories: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IPost[]>>("/articles/posts");
      // return data;
      return { data: categoriasCreative } as IApiResponse<IArtworkCategory[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
