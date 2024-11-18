import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfirmationType } from '.prisma/client';
import { PrismaService } from '@prisma/prisma.service';

interface ICreateConfirmation {
  user_id: string;
  code: string;
  type: ConfirmationType;
}

@Injectable()
export class ConfirmationRepository {
  constructor(private prisma: PrismaService) {}

  public async createConfirmation(payload: ICreateConfirmation) {
    const { user_id, code, type } = payload;

    try {
      return await this.prisma.confirmation.create({
        data: {
          user_id,
          code,
          type: type,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        'Error inserting user into database',
      );
    }
  }
}
