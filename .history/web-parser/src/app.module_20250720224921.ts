import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SulpacService } from './services/sulpac.service';
import { KaspiService } from './services/kaspi.service';
import { TechnodomService } from './services/technodom.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, SulpacService, KaspiService, TechnodomService],
})
export class AppModule {}
