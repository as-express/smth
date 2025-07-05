import { Controller } from '@nestjs/common';
import { EService } from './services/e-service';
import { FService } from './services/f-service';

@Controller()
export class AppController {
  constructor(
    private readonly EService: EService,
    private readonly FService: FService,
  ) {}
}
