import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path'; // 👈 para resolver la ruta de uploads
import { NestExpressApplication } from '@nestjs/platform-express'; // 👈 para usar useStaticAssets

import { AppModule } from './app.module';
import { TrimStringsPipe } from './utils/TrimStringsPipe';
import { JwtAuthGuard } from './auth/guards/jwt-auth/jwt-auth.guard';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // 👇 Le decimos a Nest que la app es de tipo Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilita cookie-parser
  app.use(cookieParser());

  // Habilita CORS para permitir cookies cross-origin
  app.enableCors({
    origin: 'http://localhost:3001', // Cambia por el dominio de tu frontend
    credentials: true,
  });

  // Pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
    new TrimStringsPipe(),
  );

  // Guard global
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // 👇 Servir archivos estáticos de /uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Mi API')
    .setDescription('Documentación de la API generada con Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
