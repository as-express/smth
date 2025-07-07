import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  async findResult() {
    const req = await axios.post('', {});
    return req.data;
  }
}
