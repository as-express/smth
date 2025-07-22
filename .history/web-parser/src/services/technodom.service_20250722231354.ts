import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ItemInterface } from 'src/interfaces';

@Injectable()
export class TechnodomService {
  constructor(private readonly config: ConfigService) {}

  async parse(query: string, page = 1, limit = 10) {
    const api = this.config.get<string>('TECHNODOM_API');
    const url = this.config.get<string>('TECHNODOM_URL');
    const imageUrl = this.config.get<string>('TECHNODOM_IMAGES_URL');
    const cityId = this.config.get<string>('CITY_ID');
    const originUrl = this.config.get<string>('TECHNODOM_ORIGIN');
    const userAgent = this.config.get<string>('TECHNODOM_USER_AGENT');

    const payload = {
      categories: [''],
      city_id: cityId,
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
      const res = await axios.post(api, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          Origin: originUrl,
          Referer: payload.referer,
          'User-Agent': userAgent,
          affiliation: 'web',
        },
      });

      const { products } = res.data;
      const result = products.map((p) => ({
        sku: p.sku,
        title: p.title,
        price: p.price,
        price_usd: p.price_usd,
        image: `${imageUrl}${p.images?.[0] ?? ''}`,
        url: `${url}${p.uri}`,
        source: 'technodom',
      })) as ItemInterface[];

      return result;
    } catch (err) {
      console.error('Technodom:', err.message);
      return;
    }
  }
}
