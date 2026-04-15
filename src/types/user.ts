type Role = "admin" | "user";

export interface User {
  fio: string;
  birthDate: string; // Date ?
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
}
