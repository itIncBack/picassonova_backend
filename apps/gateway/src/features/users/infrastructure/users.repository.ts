import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { InterlayerNotice } from '@base/models/Interlayer';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  public async create(): Promise<InterlayerNotice> {
    const notice = new InterlayerNotice();

    try {
      await this.prisma.user.create({
        data: {
          email: 'email@email.com',
        },
      });

      return notice;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error inserting user into database',
      );
    }
  }
}
