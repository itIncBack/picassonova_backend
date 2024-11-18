import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignUpDto } from './dto/input/sign-up.input.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpCommand } from '@apps/gateway/src/features/auth/application/handlers/sign-up.handler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('sign_up')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signUp(@Body() input: SignUpDto) {
    const { user_name, password, email } = input;

    await this.commandBus.execute<SignUpCommand, void>(
      new SignUpCommand(user_name, password, email),
    );
  }
}
