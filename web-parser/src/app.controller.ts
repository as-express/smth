import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('parsing')
  async parsing(query: string): Promise<any> {
    return this.appService.parsing(query);
  }
}
