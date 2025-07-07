import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AiService } from './ai.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'F_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.SERVER_URL || 'nats://nats:4222'],
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, AiService],
})
export class AppModule {}
