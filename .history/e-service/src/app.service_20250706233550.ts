import { Inject, Injectable } from '@nestjs/common';
import { UserReqDto } from './dto/user-req.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AiService } from './ai.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('F_SERVICE') private readonly client: ClientProxy,
    private readonly AiService: AiService,
  ) {}

  async find(data: UserReqDto) {
    const parsed = await this.AiService.parseRequest(data.text);
    const result = await this.client.send('filtering', parsed);

    return await this.AiService.dataOptimization(result);
  }
}
