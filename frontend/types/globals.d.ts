export {};

export type Roles = "admin" | "moderator" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: Roles;
    };
  }
}
