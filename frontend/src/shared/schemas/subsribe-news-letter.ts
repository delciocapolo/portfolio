import { z } from "zod";

export const schemaSubscribeNewsLetter = z.object({
  email: z.email().min(1, "Campo inválido"),
});

export type ISchemaSubscribeNewsLetter = z.infer<
  typeof schemaSubscribeNewsLetter
>;
