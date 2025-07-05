import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class FService {
  constructor(@Inject('F_SERVICE') private readonly client: ClientProxy) {}
}
