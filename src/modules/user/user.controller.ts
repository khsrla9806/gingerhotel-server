import { Injectable, Inject } from '@nestjs/common';
import { UserSchema } from 'src/models/UserSchema';
import { UserService } from './user.service';

@Injectable()
export class UserController {
  constructor(private user_service: UserService) {}

  async findUser() {
    // 유저를 찾기 위한 로직처리
    return await this.user_service.findUser();
  }
}
