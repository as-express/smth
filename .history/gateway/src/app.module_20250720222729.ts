import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EService } from './services/e-service';
import { FService } from './services/f-service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // E_SERVICE
    ClientsModule.registerAsync([
      {
        name: 'E_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [
              configService.get<string>('SERVER_URL') || 'nats://nats:4222',
            ],
          },
        }),
      },

      {
        name: 'F_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [
              configService.get<string>('SERVER_URL') || 'nats://nats:4222',
            ],
          },
        }),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [EService, FService],
})
export class AppModule {}
