import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@apps/gateway/prisma/prisma.service';
import { ConfirmationType } from '@prisma/client';

interface ICreateConfirmation {
  userId: string;
  code: string;
  type: ConfirmationType;
}

@Injectable()
export class ConfirmationRepository {
  constructor(private prisma: PrismaService) {}

  public async createConfirmation(payload: ICreateConfirmation) {
    const { userId, code, type } = payload;

    try {
      return await this.prisma.confirmation.create({
        data: {
          userId,
          code,
          type,
        },
      });
    } catch (e) {
      console.error('Error creating confirmation:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error creating confirmation in the database',
      );
    }
  }

  public async upsertConfirmation(payload: ICreateConfirmation) {
    const { userId, code, type } = payload;

    try {
      // Try to update an existing confirmation
      const updateResult = await this.prisma.confirmation.updateMany({
        where: { userId, type },
        data: { code, isConfirmed: false },
      });

      // If an update was performed (record exists), return true
      if (updateResult.count > 0) {
        return { updated: true };
      }

      // If no record was updated, create a new confirmation
      const newConfirmation = await this.prisma.confirmation.create({
        data: {
          userId,
          code,
          type,
        },
      });

      return { created: true, confirmation: newConfirmation };
    } catch (e) {
      console.error('Error upserting confirmation:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error upserting confirmation in the database',
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
      console.error('Error fetching confirmation by code:', {
        error: (e as Error).message,
        code,
      });
      throw new InternalServerErrorException(
        'Error fetching confirmation from the database',
      );
    }
  }

  public async getConfirmationUserIdAndType(
    userId: string,
    confirmationType: ConfirmationType,
  ) {
    try {
      return await this.prisma.confirmation.findFirst({
        where: {
          userId,
          type: confirmationType,
        },
      });
    } catch (e) {
      console.error('Error fetching confirmation by email:', {
        error: (e as Error).message,
      });
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
        data: { isConfirmed },
      });
    } catch (e) {
      console.error('Error updating is_confirmed status:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error fetching confirmation from the database',
      );
    }
  }

  public async updateConfirmationCode(confirmationId: string, code: string) {
    try {
      return await this.prisma.confirmation.update({
        where: {
          id: confirmationId,
        },
        data: { code: code },
      });
    } catch (e) {
      console.error('Error updating is_confirmed status:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error fetching confirmation from the database',
      );
    }
  }
}
