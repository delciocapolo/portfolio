import type { IApiResponse } from "@src/shared/@types/api";
import { client } from "@src/lib/client";
import { handleResponseErrorMessage } from "../utils";
import type { IContactForm } from "@src/shared/schemas/contact-form";

export const contactFormService = {
  createForm: async (payload: IContactForm) => {
    try {
      const { data } = await client.post<IApiResponse<null>>(
        "/contact-form/create",
        payload,
      );
      return data;
    } catch (error: any) {
      throw new Error(handleResponseErrorMessage(error));
    }
  },
};
