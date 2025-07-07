import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserReqDto } from './dto/user-req.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('find')
  findProduct(data: UserReqDto) {
    return this.appService.find(data);
  }
}
