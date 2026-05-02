export type Role = "ADMIN" | "USER";
export type Status = "ACTIVE" | "INACTIVE";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  role: Role;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}
