import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HttpRequestService {
  constructor(private readonly httpService: HttpService) {}

  async post<T>(
    url: string,
    body: any = null,
    params: Record<string, any> = {},
  ): Promise<T> {
    try {
      const response = await lastValueFrom(
        this.httpService.post<T>(url, body, { params }),
      );
      return response.data;
    } catch (error) {
      console.error(
        'HTTP POST request error:',
        error.message || error.toString(),
      );
      throw new Error('Failed to perform POST request');
    }
  }

  async get<T>(url: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<T>(url, { params }),
      );
      return response.data;
    } catch (error) {
      console.error(
        'HTTP GET request error:',
        error.message || error.toString(),
      );
      throw new Error('Failed to perform GET request');
    }
  }
}
