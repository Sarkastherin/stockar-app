import type { CommonPropsDB } from "./commonsTypes";

export const optionsRoles = [
  { value: "ADMIN", label: "Administrador", color: "green" },
  { value: "SUPERVISOR", label: "Supervisor", color: "yellow" },
  { value: "USER", label: "Usuario regular", color: "blue" },
];

export type UsuarioDB = CommonPropsDB & {
  name: string;
  last_name: string;
  email: string;
  role: "ADMIN" | "SUPERVISOR" | "USER";
};