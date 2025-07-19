import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import axios from 'axios';

@Injectable()
export class AppService {
  async sulpack(q: string) {
    const url = `https://sulpak-api.evinent.site/api/search/autocomplete/1/3/${q}/true/`;
    try {
      const res = await axios.get(url);
      const data = res.data;
      return data.products.map((product: any) => ({
        title: product.title,
        price: product.price,
        oldPrice: product.priceOld,
        brand: product.brand,
        image: product.photoUrl,
        url: `https://www.sulpak.kz${product.url}`,
        // isAvailable: product.isAvailable,
        source: 'sulpak',
      }));
    } catch (err) {
      console.error('Ошибка при парсинге Sulpak:', err.message);
      return [];
    }
  }

  async kaspi(text: string) {
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
      await page.goto(
        `https://kaspi.kz/shop/search/?text=${encodeURIComponent(text)}`,
        { waitUntil: 'domcontentloaded', timeout: 180000 },
      );
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
                  url: `https://kaspi.kz${l}`,
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

  async parsing(query: string) {
    const [kaspi, sulpack] = await Promise.all([
      this.kaspi(query),
      this.sulpack(query),
    ]);
    return [...kaspi, ...sulpack];
  }
}
