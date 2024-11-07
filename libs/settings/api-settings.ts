import { EnvironmentVariable } from './configuration';
import { IsNumber, IsString } from 'class-validator';

export class APISettings {
  constructor(private readonly envVariables: EnvironmentVariable) {}

  // Application
  @IsNumber()
  public readonly PORT: number = Number(this.envVariables.AUTH_SERVICE_PORT);
  @IsNumber()
  public readonly AUTH_SERVICE_PORT: number = Number(
    this.envVariables.AUTH_SERVICE_PORT,
  );
  @IsString()
  public readonly AUTH_SERVICE_HOST: string = String(
    this.envVariables.AUTH_SERVICE_HOST,
  );
  @IsString()
  public readonly ENV: string = String(this.envVariables.ENV);
}
