import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '@settings/configuration';
import { HttpRequestService } from '@infrastructure/servises/http/http.service';

interface ReCaptchaResponse {
  success: boolean; // Whether the user's response was successful or not
  score?: number; // The score for reCAPTCHA v3 (optional)
  action?: string; // The action name for reCAPTCHA v3 (optional)
  challenge_ts?: string; // The timestamp of the challenge (ISO format)
  hostname?: string; // The hostname of the site where the challenge was solved
  'error-codes'?: string[]; // Any error codes returned by the API
}

@Injectable()
export class ReCaptchaService {
  private readonly secretKey: string;

  constructor(
    private readonly configService: ConfigService<ConfigurationType, true>,
    private readonly httpRequestService: HttpRequestService,
  ) {
    const apiSettings = configService.get('apiSettings', { infer: true });

    this.secretKey = apiSettings.GOOGLE_RECAPTCHA_SECRET_KEY;
  }

  async validate(token: string): Promise<{ success: boolean; score: number }> {
    const url = `https://www.google.com/recaptcha/api/siteverify`;

    try {
      const data = await this.httpRequestService.post<ReCaptchaResponse>(
        url,
        null,
        {
          secret: this.secretKey,
          response: token,
        },
      );

      if (!data.success) {
        throw new ForbiddenException({
          message: 'Validation failed: reCAPTCHA verification unsuccessful.',
        });
      }

      return { success: data.success, score: data.score || 0 };
    } catch (error) {
      if (error.response?.data?.error_codes) {
        console.error(
          'reCAPTCHA validation failed with error codes:',
          error.response.data.error_codes,
        );
      } else {
        console.error(
          'Error validating reCAPTCHA:',
          error.message || error.toString(),
        );
      }

      throw new ForbiddenException({
        message: 'Failed to validate reCAPTCHA. Please try again later.',
      });
    }
  }
}
