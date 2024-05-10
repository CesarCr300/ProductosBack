import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './modules/app/app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer') //this line it's like adding this: @ApiBearerAuth() to every controller
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
