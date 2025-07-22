import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SulpacService {
  constructor(private readonly config: ConfigService) {}
}
