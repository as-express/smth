import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chromium } from 'playwright';

@Injectable()
export class KaspiService {
  constructor(private readonly config: ConfigService) {}

  async kaspi(text: string) {
    const api = this.config.get<string>('KASPI_API');
    const url = this.config.get<string>('KASPI_URL');

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    try {
      const ctx = await browser.newContext({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      });

      const page = await ctx.newPage();
      await page.goto(api.replace('${text}', encodeURIComponent(text)), {
        waitUntil: 'domcontentloaded',
        timeout: 180000,
      });
      await page.waitForSelector('div.item-card__info', { timeout: 10000 });

      return await page.$$eval('div.item-card__info', (nodes) =>
        nodes
          .map((el) => {
            const t = el
              .querySelector<HTMLAnchorElement>('a.item-card__name-link')
              ?.textContent?.trim();
            const l = el
              .querySelector<HTMLAnchorElement>('a.item-card__name-link')
              ?.getAttribute('href');
            const p = el
              .querySelector<HTMLSpanElement>('span.item-card__prices-price')
              ?.textContent?.trim();
            return t && l && p
              ? {
                  title: t,
                  price: p,
                  url: `${url}${l}`,
                  source: 'kaspi',
                }
              : null;
          })
          .filter(Boolean),
      );
    } finally {
      await browser.close();
    }
  }
}
