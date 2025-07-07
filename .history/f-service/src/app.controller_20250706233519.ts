import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { FindDto } from './dto/find.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('filtering')
  async filtering(data: FindDto) {
    return this.appService.findResult(data);
  }
}
