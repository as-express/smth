import { Injectable } from '@nestjs/common';
import { KaspiService } from './services/kaspi.service';
import { SulpacService } from './services/sulpac.service';
import { TechnodomService } from './services/technodom.service';

@Injectable()
export class AppService {
  constructor(
    private readonly kaspiService: KaspiService,
    private readonly sulpacService: SulpacService,
    private readonly TechnodromService: TechnodomService,
  ) {}

  async parsing(query: string) {
    const [kaspi, sulpak, technodom] = await Promise.all([
      this.kaspi(query),
      this.sulpak(query),
      this.technodom(query),
    ]);
    return [...kaspi, ...sulpak, ...technodom];
  }
}
