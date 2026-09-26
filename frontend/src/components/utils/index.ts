import type { IApiResponse } from "@src/shared/@types/api";

export function getResponseData<T>(response: IApiResponse<T>): T {
  return response.data;
}
