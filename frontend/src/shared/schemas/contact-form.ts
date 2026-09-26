import { z } from "zod";

export const schemaContactForm = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  website: z
    .string()
    .refine(
      (val) => val === "" || z.url().safeParse(val).success,
      "URL inválida",
    ),
  message: z.string().min(1, "Message is required"),
});

export type IContactForm = z.infer<typeof schemaContactForm>;
