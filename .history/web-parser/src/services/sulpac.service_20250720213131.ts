import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ItemInterface } from 'src/interfaces';

@Injectable()
export class SulpacService {
  constructor(private readonly config: ConfigService) {}

  async parse(q: string) {
    try {
      const api = this.config.get<string>('SULPAC_API');
      const url = this.config.get<string>('SULPAC_URL');

      const req = api.replace('${q}', q);
      const res = await axios.get(req);
      const data = res.data;

      return data.products.map((product: any) => ({
        title: product.title,
        price: product.price,
        image: product.photoUrl,
        oldPrice: product.priceOld,
        brand: product.brand,
        url: `${url}${product.url}`,
        source: 'sulpak',
      })) as ItemInterface;
    } catch (err) {
      console.error('Sulpak:', err.message);
      return;
    }
  }
}
