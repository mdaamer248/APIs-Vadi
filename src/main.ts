import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  }),
);
  app.enableCors();
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Vadi-BackEnd')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 4000);
}
  

bootstrap();
