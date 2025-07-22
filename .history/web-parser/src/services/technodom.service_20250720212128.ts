import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TechnodomService {
  constructor(private readonly config: ConfigService) {}

  async parse(query: string, page = 1, limit = 10) {
    const api = this.config.get<string>('TECHNODOM_API');
    const url = this.config.get<string>('TECHNODOM_URL');
    const imageUrl = this.config.get<string>('TECHNODOM_IMAGES_URL');
    const cityId = this.config.get<string>('CITY_ID');
    const originUrl = this.config.get<string>('CITY_ID');

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
          Origin: process.env.TECHNODOM_ORIGIN,
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
}
