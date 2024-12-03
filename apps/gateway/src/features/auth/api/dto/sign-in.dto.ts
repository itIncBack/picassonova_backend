export class SignInDto {
  ipAddress: string;
  userAgent: string;
  refreshTokenFromRequest?: string;
  email: string;
  password: string;
}

interface IInput {
  ipAddress?: string;
  userAgent?: string;
  refreshTokenFromRequest?: string;
  email: string;
  password: string;
}

// MAPPERS

export const SignInMapper = (input: IInput): SignInDto => {
  const outputDto = new SignInDto();

  outputDto.ipAddress = input.ipAddress || 'unknown';
  outputDto.userAgent = input.userAgent || 'unknown';
  outputDto.refreshTokenFromRequest = input.refreshTokenFromRequest;
  outputDto.email = input.email;
  outputDto.password = input.password;

  return outputDto;
};
