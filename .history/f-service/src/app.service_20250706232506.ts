import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { FindDto } from './dto/find.dto';

@Injectable()
export class AppService {
  async findResult(data: FindDto) {
    const req = await axios.post(process.env.AXUM_SERVICE_URL, {
      q: data.text,
    });

    return req.data;
  }
}
