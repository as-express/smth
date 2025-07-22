import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EService } from './services/e-service';
import { FService } from './services/f-service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'E_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.SERVER_URL || 'nats://nats:4222'],
        },
      },
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
  providers: [EService, FService],
})
export class AppModule {}
