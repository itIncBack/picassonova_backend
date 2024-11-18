import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SignUpDto } from '@apps/gateway/src/features/auth/api/dto/input/sign-up.input.dto';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUser, NewUser, User } from './types';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  public async createUser(payload: CreateUser): Promise<NewUser> {
    const { user_name, hashedPassword, email } = payload;

    try {
      return await this.prisma.user.create({
        data: {
          email,
          user_name,
          password: hashedPassword,
        },
        select: {
          id: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        'Error inserting user into database',
      );
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          id: true,
          user_name: true,
          email: true,
          created_at: true,
          updated_at: true,
          role: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        'Error fetching user from database',
      );
    }
  }
}
