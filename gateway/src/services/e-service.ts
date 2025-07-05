import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EService {
  constructor(@Inject('E_SERVICE') private readonly client: ClientProxy) {}
}
