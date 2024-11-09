import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { InterlayerNotice } from '@base/models/Interlayer';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  public async create(email: string): Promise<InterlayerNotice> {
    const notice = new InterlayerNotice();
    console.log('email', email);
    try {
      console.log('test1');
      const res = await this.prisma.user.create({
        data: {
          email,
        },
      });
      console.log('res', res);
      return notice;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error inserting user into database',
      );
    }
  }
}
