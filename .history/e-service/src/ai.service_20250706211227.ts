import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly API_URL = String(process.env.OPENROUTER_API_URL);
  private readonly API_KEY = process.env.OPENROUTER_API_KEY;

  async generateCategoryAndUrgency(data: { categories: any }): Promise<any> {
    const response = await axios.post(
      this.API_URL,
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: `
          Проанализируй жалобу и сгенерируй ответ в формате JSON.
          переведите контент на русский язык, если это не так.
          
          ❗ Обрати внимание:
          - Поле "region" уже передано отдельно — **не нужно определять его из текста**, ${JSON.stringify(data.regions)}.
          - Категорию выбери  из ${JSON.stringify(data.categories)}
          - Срочность оцени: "Низкая", "Средняя", "Высокая"
          - Составь краткое резюме жалобы 
          - Ответ строго в формате JSON
          
          Пример формата:
          {
            "categoryId": 1,
            "regionId": 1,
            "urgency": "Высокая",
            "summary": "....."
          }
          
          Входящие данные:
          
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
