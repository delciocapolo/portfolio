import type { IApiResponse } from "@src/shared/@types/api";
import { handleResponseErrorMessage } from "./index";
// import { adminClient } from "@src/lib/client/admin";

export interface ICrudService<T extends { id: string }> {
  endpoint: string;
  list: () => Promise<IApiResponse<T[]>>;
  create: (payload: Omit<T, "id">) => Promise<IApiResponse<T>>;
  update: (id: string, payload: Partial<T>) => Promise<IApiResponse<T>>;
  remove: (id: string) => Promise<IApiResponse<null>>;
}

const ok = <R>(data: R) =>
  ({ data, meta: { errors: null } }) as IApiResponse<R>;

/**
 * Serviço CRUD com o mesmo contrato dos services do site.
 * Enquanto a API não existe, lê e escreve num store em memória (reinicia ao recarregar).
 * Para ligar à API, troca cada bloco pelo pedido comentado.
 */
export function createCrudService<T extends { id: string }>(
  resource: string,
  seed: T[],
): ICrudService<T> {
  const endpoint = `/admin/${resource}`;
  let store: T[] = structuredClone(seed);

  return {
    endpoint,

    list: async () => {
      try {
        // const { data } = await adminClient.get<IApiResponse<T[]>>(endpoint);
        // return data;
        return ok(store);
      } catch (error: any) {
        throw new Error(handleResponseErrorMessage(error));
      }
    },

    create: async (payload) => {
      try {
        // const { data } = await adminClient.post<IApiResponse<T>>(endpoint, payload);
        // return data;
        const item = { ...payload, id: crypto.randomUUID() } as T;
        store = [item, ...store];
        return ok(item);
      } catch (error: any) {
        throw new Error(handleResponseErrorMessage(error));
      }
    },

    update: async (id, payload) => {
      try {
        // const { data } = await adminClient.patch<IApiResponse<T>>(`${endpoint}/${id}`, payload);
        // return data;
        const current = store.find((i) => i.id === id);
        if (!current) throw new Error("Registo não encontrado");
        const item = { ...current, ...payload, id } as T;
        store = store.map((i) => (i.id === id ? item : i));
        return ok(item);
      } catch (error: any) {
        throw new Error(
          error?.response ? handleResponseErrorMessage(error) : error.message,
        );
      }
    },

    remove: async (id) => {
      try {
        // const { data } = await adminClient.delete<IApiResponse<null>>(`${endpoint}/${id}`);
        // return data;
        store = store.filter((i) => i.id !== id);
        return ok(null);
      } catch (error: any) {
        throw new Error(handleResponseErrorMessage(error));
      }
    },
  };
}
