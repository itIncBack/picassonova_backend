import { Role } from '@prisma/client';

export type User = {
  id: string;
  user_name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  role: Role;
};

export type NewUser = { id: string };

export type CreateUser = {
  user_name: string;
  email: string;
  hashedPassword: string;
  role?: Role;
};
