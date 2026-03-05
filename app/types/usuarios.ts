import type { CommonPropsDB } from "./commonsTypes";

export type UsuarioDB = CommonPropsDB & {
  name: string;
  email: string;
  rol: "ADMIN" | "SUPERVISOR" | "USER";
};
