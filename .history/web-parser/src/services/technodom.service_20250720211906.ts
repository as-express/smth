import { Injectable } from '@nestjs/common';

@Injectable()
export class TechnodomService {
  constructor(private readonly config: ConfigService) {}
}
