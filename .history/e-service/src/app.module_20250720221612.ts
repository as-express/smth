import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AiService } from './ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'PARSER_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.SERVER_URL || 'nats://nats:4222',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, AiService],
})
export class AppModule {}
