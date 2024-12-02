import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@apps/gateway/prisma/prisma.service';
import { NewSessionDto } from '@apps/gateway/src/features/session/api/dto/new-session.dto';
import { NewSession } from '@apps/gateway/src/features/session/infrastructure/types';

@Injectable()
export class SessionsRepository {
  constructor(private prisma: PrismaService) {}

  public async create(newSession: NewSessionDto): Promise<NewSession> {
    try {
      return await this.prisma.session.create({
        data: {
          user_id: newSession.userId,
          ip: newSession.ip,
          title: newSession.title,
          device_id: newSession.deviceId,
        },
        select: {
          id: true,
          device_id: true,
          user_id: true,
        },
      });
    } catch (e) {
      console.error('Error inserting session into database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error inserting session into database',
      );
    }
  }

  public async update(sessionId: string): Promise<NewSession> {
    try {
      return await this.prisma.session.update({
        where: {
          id: sessionId,
        },
        data: { updated_at: new Date() },
        select: {
          id: true,
          device_id: true,
          user_id: true,
        },
      });
    } catch (e) {
      console.error('Error updating session in the database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error updating session in the database',
      );
    }
  }

  public async getSessionByUserAndDevice(
    deviceId: string,
    userId: string,
  ): Promise<NewSession | null> {
    try {
      return await this.prisma.session.findFirst({
        where: {
          device_id: deviceId,
          user_id: userId,
        },
        select: {
          id: true,
          device_id: true,
          user_id: true,
        },
      });
    } catch (e) {
      console.error(
        'Error retrieving session from the database by device ID:',
        {
          error: (e as Error).message,
        },
      );
      throw new InternalServerErrorException(
        'Error retrieving session from the database by device ID',
      );
    }
  }

  public async deleteSessionByUserAndDevice(
    deviceId: string,
    userId: string,
  ): Promise<void> {
    try {
      await this.prisma.session.deleteMany({
        where: {
          device_id: deviceId,
          user_id: userId,
        },
      });
    } catch (e) {
      console.error('Error deleting session from the database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error deleting session from the database',
      );
    }
  }
}
