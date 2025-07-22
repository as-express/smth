import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import axios from 'axios';

@Injectable()
export class AppService {
  async sulpak(q: string) {
    try {
      const url = process.env.SULPAC_API.replace('${q}', q);
      const res = await axios.get(url);
      const data = res.data;

      return data.products.map((product: any) => ({
        title: product.title,
        price: product.price,
        image: product.photoUrl,
        oldPrice: product.priceOld,
        brand: product.brand,
        url: `${process.env.SULPAC_URL}${product.url}`,
        source: 'sulpak',
      }));
    } catch (err) {
      console.error('Sulpak:', err.message);
      return;
    }
  }

  async technodom(query: string, page = 1, limit = 10) {
    const payload = {
      categories: [''],
      city_id: String(process.env.CITY_ID),
      filters: {},
      limit,
      page,
      price_range: { max: 0, min: 0 },
      query,
      referer: `https://www.technodom.kz/search?recommended_by=instant_search&recommended_code=${encodeURIComponent(query)}&r46_search_query=${encodeURIComponent(query)}`,
      sort_by: 'popular',
      sort_order: '',
      type: 'full_search',
    };

    try {
      const res = await axios.post(process.env.TECHNODOM_API, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          Origin: 'https://www.technodom.kz',
          Referer: payload.referer,
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/138.0.0.0 Safari/537.36',
          affiliation: 'web',
        },
      });

      const { products } = res.data;
      const result = products.map((p) => ({
        sku: p.sku,
        title: p.title,
        price: p.price,
        price_usd: p.price_usd,
        image: `${process.env.TECHNODOM_IMAGES_URL}${p.images?.[0] ?? ''}`,
        url: `${process.env.TECHNODOM_API}${p.uri}`,
        source: 'technodom',
      }));

      return result;
    } catch (err) {
      console.error('Technodom:', err.message);
      return;
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
        process.env.KASPI_API.replace('${text}', encodeURIComponent(text)),
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
                  url: `${process.env.KASPI_URL}${l}`,
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
    const [kaspi, sulpak, technodom] = await Promise.all([
      this.kaspi(query),
      this.sulpak(query),
      this.technodom(query),
    ]);
    return [...kaspi, ...sulpak, ...technodom];
  }
}
