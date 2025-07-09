import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { chromium } from 'playwright';

@Injectable()
export class AppService {
  async olxParser(text: string) {
    const url = `https://www.olx.kz/list/q-${encodeURIComponent(text)}/`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(response.data);
    const result = [];

    $('.css-1sw7q4x').each((_, el) => {
      const title = $(el).find('h6').text().trim();
      const price = $(el).find('.css-10b0gli').text().trim();
      const link = $(el).find('a').attr('href');

      if (text && price && link) {
        result.push({ title, price, url: link, source: 'olx' });
      }
    });

    return result;
  }

  async kaspiParser(text: string) {
    const url = `https://kaspi.kz/shop/search/?text=${encodeURIComponent(text)}`;
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const result = await page.$$eval('div.item-card__info', (items) =>
      items
        .map((el) => {
          const title = el
            .querySelector('a.item-card__name-link')
            ?.textContent?.trim();
          const link = el
            .querySelector('a.item-card__name-link')
            ?.getAttribute('href');
          const price = el
            .querySelector('span.item-card__prices-price')
            ?.textContent?.trim();

          if (title && price && link) {
            return {
              title,
              price,
              url: `https://kaspi.kz${link}`,
              source: 'kaspi',
            };

            return null;
          }
        })
        .filter(Boolean),
    );

    await browser.close();
    return result;
  }

  async parsing(query: string) {
    const [olx, kaspi] = await Promise.all([
      this.olxParser(query),
      this.kaspiParser(query),
    ]);

    return [...olx, ...kaspi];
  }
}
