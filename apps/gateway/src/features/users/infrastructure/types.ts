import { Role } from '@prisma/client';

export type CreateUser = {
  userName: string;
  email: string;
  hashedPassword: string;
  role?: Role;
};
