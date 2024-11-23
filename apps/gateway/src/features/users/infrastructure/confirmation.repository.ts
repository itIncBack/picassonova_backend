import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfirmationType } from '.prisma/client';
import { PrismaService } from '@prisma/prisma.service';

interface ICreateConfirmation {
  email: string;
  code: string;
  type: ConfirmationType;
}

@Injectable()
export class ConfirmationRepository {
  constructor(private prisma: PrismaService) {}

  public async createConfirmation(payload: ICreateConfirmation) {
    const { email, code, type } = payload;

    try {
      return await this.prisma.confirmation.create({
        data: {
          email,
          code,
          type: type,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        'Error creating confirmation in the database',
      );
    }
  }

  public async getConfirmationByCode(code: string) {
    try {
      return await this.prisma.confirmation.findFirst({
        where: {
          code,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        'Error fetching confirmation from the database',
      );
    }
  }

  public async getConfirmationByEmail(email: string) {
    try {
      return await this.prisma.confirmation.findFirst({
        where: {
          email,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        'Error fetching confirmation from the database',
      );
    }
  }

  public async updateIsConfirmed(confirmationId: string, isConfirmed: boolean) {
    try {
      return await this.prisma.confirmation.update({
        where: {
          id: confirmationId,
        },
        data: { is_confirmed: isConfirmed },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        'Error fetching confirmation from the database',
      );
    }
  }
}
