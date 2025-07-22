import { Inject, Injectable } from '@nestjs/common';
import { UserReqDto } from './dto/user-req.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AiService } from './ai.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('PARSER_SERVICE') private readonly client: ClientProxy,
    private readonly AiService: AiService,
  ) {}

  async find(data: UserReqDto) {
    // const parsed = await this.AiService.parseRequest(data.query);
    const result = await firstValueFrom(
      this.client.send('parsing', data.query),
    );

    // console.log(result);
    // return await this.AiService.dataOptimization(result);
    return result;
  }
}
