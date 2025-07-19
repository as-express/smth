import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EService {
  constructor(@Inject('E_SERVICE') private readonly client: ClientProxy) {}

  async find(query: string) {
    const result = await this.client.send('find', { query });
    return result;
  }
}
