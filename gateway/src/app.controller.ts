import { Controller, Get, Query } from '@nestjs/common';
import { EService } from './services/e-service';
import { FService } from './services/f-service';

@Controller()
export class AppController {
  constructor(
    private readonly EService: EService,
    private readonly FService: FService,
  ) {}

  @Get()
  async function(@Query('text') query: string) {
    return this.EService.find(query);
  }
}
