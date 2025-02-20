import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@apps/gateway/prisma/prisma.service';
import { NewSessionDto } from '@apps/gateway/src/features/session/api/dto/new-session.dto';

@Injectable()
export class SessionsRepository {
  constructor(private prisma: PrismaService) {}

  public async create(newSession: NewSessionDto) {
    try {
      return await this.prisma.session.create({
        data: {
          userId: newSession.userId,
          ip: newSession.ip,
          title: newSession.title,
          deviceId: newSession.deviceId,
        },
        select: {
          id: true,
          deviceId: true,
          userId: true,
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

  public async update(sessionId: string) {
    try {
      return await this.prisma.session.update({
        where: {
          id: sessionId,
        },
        data: { updatedAt: new Date() },
        select: {
          id: true,
          deviceId: true,
          userId: true,
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

  public async getSessionById(sessionId: string) {
    try {
      return await this.prisma.session.findFirst({
        where: { id: sessionId },
        select: {
          id: true,
          deviceId: true,
          userId: true,
        },
      });
    } catch (e) {
      console.error('Error retrieving session from the database:', {
        error: (e as Error).message,
      });
      throw new InternalServerErrorException(
        'Error retrieving session from the database',
      );
    }
  }

  public async getSessionByUserAndDevice(deviceId: string, userId: string) {
    try {
      return await this.prisma.session.findFirst({
        where: {
          deviceId: deviceId,
          userId: userId,
        },
        select: {
          id: true,
          deviceId: true,
          userId: true,
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
          deviceId,
          userId,
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
