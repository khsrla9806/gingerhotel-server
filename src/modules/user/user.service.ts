import { Injectable } from '@nestjs/common';
import { UserSchema } from 'src/models/UserSchema';

@Injectable()
export class UserService {
  constructor() {}

  async findUser() {
    // 실제 디비 연동시 데이터 조회 후 리턴되는 곳
    return true;
  }
}
