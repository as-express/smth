import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('OPENROUTER_API_KEY');
    this.apiUrl = this.config.get<string>('OPENROUTER_API_URL');
  }

  async parseRequest(text: string) {
    const response = await axios.post(
      this.apiUrl,
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
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'http://localhost:3000/api/ai',
          'X-Title': 'Complaint AI',
        },
      },
    );

    return response.data.choices?.[0]?.message?.content;
  }

  async dataOptimization(data: any) {
    const response = await axios.post(
      this.apiUrl,
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: `
              Ты получаешь массив товаров в формате JSON. НЕ изменяй структуру и названия полей (title, price, url, source).

              📌 Для каждого товара:
              - Добавь новое поле "ai-review" — в нём напиши краткий обзор на русском языке, укажи, стоит ли покупать товар, примерно в процентах (например: 100% — отличный выбор, 70% — можно рассмотреть, 50% — есть лучшие варианты).

              📌 В конце добавь два поля:
              - "finalReview" —
