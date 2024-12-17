import { User } from '@prisma/client';

export class MeOutputDto {
  userName: string;
  email: string;
  userId: string;
}

// MAPPERS

export const MeOutputDtoMapper = (
  user: Omit<User, 'password'>,
): MeOutputDto => {
  const outputDto = new MeOutputDto();

  outputDto.userName = user.userName;
  outputDto.email = user.email;
  outputDto.userId = user.id;

  return outputDto;
};
