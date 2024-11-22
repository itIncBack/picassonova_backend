import { InterlayerNotice } from '@libs/base/models/Interlayer';

export class SignInOutputDto {
  accessToken: string;
}

// MAPPERS

export const SignInOutputMapper = (
  accessToken: string,
): InterlayerNotice<SignInOutputDto> => {
  const outputDto = new SignInOutputDto();
  const notice = new InterlayerNotice<SignInOutputDto>(null);

  outputDto.accessToken = accessToken;

  notice.addData(outputDto);

  return notice;
};
