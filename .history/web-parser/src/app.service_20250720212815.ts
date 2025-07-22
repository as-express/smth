import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import axios from 'axios';

@Injectable()
export class AppService {
  async parsing(query: string) {
    const [kaspi, sulpak, technodom] = await Promise.all([
      this.kaspi(query),
      this.sulpak(query),
      this.technodom(query),
    ]);
    return [...kaspi, ...sulpak, ...technodom];
  }
}
