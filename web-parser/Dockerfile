FROM mcr.microsoft.com/playwright:v1.53.2-jammy

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install -g yarn && yarn install

COPY . .
RUN yarn build

CMD ["node", "dist/main"]
