import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { configService } from './configs/service';

async function startApiServer(port: number) {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(bodyParser.json({ limit: configService.BODY_SIZE_LIMIT }));

  await app.listen(port).then(() => {
    console.log(`-- Service is listening port ${port}`);
  });
}

async function bootstrap() {
  const port = configService.PORT || 3000;
  await startApiServer(port);
}

bootstrap();
