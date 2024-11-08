import { EnvironmentVariable } from './configuration';
import { IsNumber, IsString } from 'class-validator';

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
}
