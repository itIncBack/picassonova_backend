import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { InterlayerNotice } from '@base/models/Interlayer';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  public async create(email: string): Promise<InterlayerNotice<User>> {
    const notice = new InterlayerNotice<User>();

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
        },
      });

      notice.addData(user as User);

      return notice;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error inserting user into database',
      );
    }
  }
}
