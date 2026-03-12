import type { CommonPropsDB } from "./commonsTypes";

export type UsuarioDB = CommonPropsDB & {
  name: string;
  last_name: string;
  email: string;
  rol: "ADMIN" | "SUPERVISOR" | "USER";
};
