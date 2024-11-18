import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignUpDto } from './dto/input/sign-up.input.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpCommand } from '@apps/gateway/src/features/auth/application/handlers/sign-up.handler';
import { BadRequestSchema } from 'swagger/schemas/bad-request.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('sign_up')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully registered the user. No content is returned.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The user already exists or the provided data is invalid.',
    schema: BadRequestSchema,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async signUp(@Body() input: SignUpDto) {
    const { user_name, password, email } = input;

    await this.commandBus.execute<SignUpCommand, void>(
      new SignUpCommand(user_name, password, email),
    );
  }
}
