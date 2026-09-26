import type { IApiResponse } from "@src/shared/@types/api";
import { client } from "@src/lib/client";
import { handleResponseErrorMessage } from "../utils";
import type { ISchemaSubscribeNewsLetter } from "@src/shared/schemas/subsribe-news-letter";

export const newsLetterService = {
  subscribe: async (payload: ISchemaSubscribeNewsLetter) => {
    try {
      const { data } = await client.post<IApiResponse<null>>(
        "/news-letter/subscribe",
        payload,
      );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
