import { Inject, Injectable } from '@nestjs/common';
import { UserReqDto } from './dto/user-req.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('F_SERVICE') private readonly client: ClientProxy) {}

  async find(data: UserReqDto) {}
}
