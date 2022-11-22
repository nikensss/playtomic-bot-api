import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PlaytomicController } from './playtomic.controller';
import { PlaytomicService } from './playtomic.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [PlaytomicController],
  providers: [PlaytomicService],
})
export class PlaytomicModule {}
