FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# ✅ Обновляем Node.js до 20.18.1
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node -v \
    && npm -v

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# ✅ Установка браузеров Playwright
RUN npx playwright install --with-deps

CMD ["node", "dist/main"]
