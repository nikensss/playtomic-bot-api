import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { PlaytomicController } from './playtomic.controller';
import { PlaytomicService } from './playtomic.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    UsersModule,
  ],
  controllers: [PlaytomicController],
  providers: [PlaytomicService],
})
export class PlaytomicModule {}
