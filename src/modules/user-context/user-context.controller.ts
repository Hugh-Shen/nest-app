import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { RegisterUserDto } from './application/dtos/register-user.dto';
import { UserResponseMapper } from './interface/http/user-response.mapper'
import { UserRepositoryAbstract } from './domain/ports/user-repository.abstract';

@Controller('users')
export class UserContextController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly userRepository: UserRepositoryAbstract,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(dto);

    return UserResponseMapper.toResponse(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userRepository.findById(id);
    // 💡 这里我们打印一下 user.getProps() 看看结果
    console.log('Reconstituted User Props:', user?.getProps());
    
  }
}
