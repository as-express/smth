import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chromium } from 'playwright';

@Injectable()
export class KaspiService {
  constructor(private readonly config: ConfigService) {}

  async parse(text: string) {
    const baseUrl = this.config.get<string>('KASPI_BASE_URL');
    const searchPath = this.config.get<string>('KASPI_SEARCH_PATH');
    const userAgent = this.config.get<string>('KASPI_USER_AGENT');
    const fullUrl = `${baseUrl}${searchPath}${encodeURIComponent(text)}`;

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    try {
      const ctx = await browser.newContext({
        userAgent,
      });

      const page = await ctx.newPage();
      await page.goto(fullUrl.replace('${text}', encodeURIComponent(text)), {
        waitUntil: 'domcontentloaded',
        timeout: 180000,
      });
      await page.waitForSelector('div.item-card__info', { timeout: 10000 });

      return await page.$$eval(
        'div.item-card__info',
        (nodes, apiUrl) =>
          nodes
            .map((el) => {
              const t = el
                .querySelector('a.item-card__name-link')
                ?.textContent?.trim();
              const l = el
                .querySelector('a.item-card__name-link')
                ?.getAttribute('href');
              const p = el
                .querySelector('span.item-card__prices-price')
                ?.textContent?.trim();
              return t && l && p
                ? {
                    title: t,
                    price: p,
                    url: `${apiUrl}${l}`,
                    source: 'kaspi',
                  }
                : null;
            })
            .filter(Boolean),
        baseUrl,
      );
    } finally {
      await browser.close();
    }
  }
}
