import { Injectable } from '@nestjs/common';

@Injectable()
export class SulpacService {
  constructor(private readonly config: ConfigService) {}
}
