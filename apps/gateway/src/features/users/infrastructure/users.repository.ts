import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@apps/gateway/prisma/prisma.service';
import { CreateUser } from './types';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  public async createUser(payload: CreateUser) {
    const { userName, hashedPassword, email } = payload;

    try {
      return await this.prisma.user.create({
        data: {
          email,
          userName,
          password: hashedPassword,
        },
        select: {
          id: true,
        },
      });
    } catch (e) {
      console.error('Error inserting user into database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error inserting user into database',
      );
    }
  }

  public async getUserByEmail(email?: string) {
    try {
      return await this.prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          id: true,
          userName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          role: true,
        },
      });
    } catch (e) {
      console.error('Error fetching user from database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error fetching user from database',
      );
    }
  }

  public async getUserById(userId: string) {
    try {
      return await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          userName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          role: true,
        },
      });
    } catch (e) {
      console.error('Error fetching user from database: ', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error fetching user from database',
      );
    }
  }

  public async getUserByEmailWithPass(email: string) {
    try {
      return await this.prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          id: true,
          userName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          role: true,
          password: true,
        },
      });
    } catch (e) {
      console.error('Error fetching user from database: ', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error fetching user from database',
      );
    }
  }

  public async updatePassword(
    userId: string,
    password: string,
  ): Promise<boolean> {
    try {
      const result = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: password,
        },
      });

      return Boolean(result);
    } catch (e) {
      console.error('Error during update password operation:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException('Error updating user password');
    }
  }
}
