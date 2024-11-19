import { EnvironmentVariable } from './configuration';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class APISettings {
  constructor(private readonly envVariables: EnvironmentVariable) {}

  // Application
  @IsNumber()
  public readonly PORT: number = Number(this.envVariables.PORT);
  @IsNumber()
  public readonly FILES_SERVICE_PORT: number = Number(
    this.envVariables.FILES_SERVICE_PORT,
  );
  @IsString()
  public readonly FILES_SERVICE_HOST: string = String(
    this.envVariables.FILES_SERVICE_HOST,
  );
  @IsString()
  public readonly ENV: string = String(this.envVariables.ENV);

  @IsString()
  public readonly DATABASE_URL: string = String(this.envVariables.DATABASE_URL);
  @IsString()
  public readonly SHADOW_DATABASE_URL: string = String(
    this.envVariables.SHADOW_DATABASE_URL,
  );

  //EMAIL
  @IsEmail()
  public readonly EMAIL_USER: string = this.envVariables.EMAIL_USER;
  @IsString()
  public readonly EMAIL_PASS: string = this.envVariables.EMAIL_PASS;
  @IsString()
  public readonly EMAIL_CONFIRMATION_CODE_EXPIRED_IN: string =
    this.envVariables.EMAIL_CONFIRMATION_CODE_EXPIRED_IN;

  //JWT
  @IsString()
  public readonly JWT_SECRET_KEY: string = this.envVariables.JWT_SECRET_KEY;
  @IsString()
  public readonly ACCESS_TOKEN_EXPIRED_IN: string =
    this.envVariables.ACCESS_TOKEN_EXPIRED_IN;
  @IsString()
  public readonly REFRESH_TOKEN_EXPIRED_IN: string =
    this.envVariables.REFRESH_TOKEN_EXPIRED_IN;
}
