import { client } from "@src/lib/client";
import { handleResponseErrorMessage } from "../utils";
import type { IApiResponse } from "@src/shared/@types/api";
import { faq } from "@src/data/site";
import type { IFaq } from "./types";

export const faqService = {
  list: async () => {
    try {
      // const { data } = await client.get<IApiResponse<IFaq[]>>("/faq");
      // return data;
      return { data: faq } as IApiResponse<IFaq[]>;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
