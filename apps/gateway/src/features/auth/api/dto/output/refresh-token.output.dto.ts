import { InterlayerNotice } from '@libs/base/models/Interlayer';

export class RefreshTokenOutputDto {
  accessToken: string;
}

// MAPPERS

export const RefreshTokenOutputMapper = (
  accessToken: string,
): InterlayerNotice<RefreshTokenOutputDto> => {
  const outputDto = new RefreshTokenOutputDto();
  const notice = new InterlayerNotice<RefreshTokenOutputDto>(null);

  outputDto.accessToken = accessToken;

  notice.addData(outputDto);

  return notice;
};
