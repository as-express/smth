import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  async findResult(data: FindD) {
    const req = await axios.post(process.env.AXUM_SERVICE_URL, {});
    return req.data;
  }
}
