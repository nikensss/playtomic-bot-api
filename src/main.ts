import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

const retry = (): void => {
  bootstrap().catch(ex => {
    console.error(ex);
    retry();
  });
};

retry();
