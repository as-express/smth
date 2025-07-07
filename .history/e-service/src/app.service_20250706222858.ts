import { Injectable } from '@nestjs/common';
import { UserReqDto } from './dto/user-req.dto';

@Injectable()
export class AppService {
  constructor() {}
  async find(data: UserReqDto) {}
}
