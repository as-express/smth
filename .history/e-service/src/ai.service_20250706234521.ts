import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly API_URL = String(process.env.OPENROUTER_API_URL);
  private readonly API_KEY = process.env.OPENROUTER_API_KEY;

  async parseRequest(text: string) {
    const response = await axios.post(
      this.API_URL,
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: `
            сделай этот текст чётким и кратким примером если написано iphone 11 128гб new to просто сделай это iphone 11
            а если он сам по себе такой четкий например iphone 11, tv, playstation оставить не трогай просто верните это значение
          
          ❗ Обрати внимание:
          - Ответ строго в формате JSON
          
          Пример формата:
          {
          "text": ""
          }
          
          Входящие данные:
          ${text}

          Ответ: 
          `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000/api/ai',
          'X-Title': 'Complaint AI',
        },
      },
    );

    return response.data.choices[0].message.content;
  }

  async dataOptimization(data: any) {
    const response = await axios.post(
      this.API_URL,
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: `
            добавь description к ответу и пиши там краткий обзор стоит ли сколько % например 100 это отлично нужно брать а 50 % это нужно хорошенько  подумать  или 
            рассмотреть  другие  варианты и в консе добавь обект ревьев  и напиши там общий предикт типа из всех этих лутшые 5-10 почему и личный совет 

       
       ❗ Обрати внимание:
       - Ответ строго в формате JSON
       
       Пример формата:
       {
        title: String,
 price: String,
 url: String,
 source: String, // olx / kaspi
       }
       
       Входящие данные:
       ${data}
       Ответ: 
       `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000/api/ai',
          'X-Title': 'Complaint AI',
        },
      },
    );
    return response.data.choices[0].message.content;
  }
}
