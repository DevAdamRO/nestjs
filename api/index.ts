// api/index.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';

let server: any; // Express instance caché entre invocaciones

export default async function handler(req: any, res: any) {
  try {
    if (!server) {
      const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
      // activa CORS si lo necesitas:
      // app.enableCors({ origin: '*', methods: 'GET,POST,PUT,PATCH,DELETE' });
      await app.init(); // ¡No uses app.listen en serverless!
      server = app.getHttpAdapter().getInstance(); // Express
      Logger.log('Nest app initialized (cached)', 'vercel');
    }
    return server(req, res);
  } catch (err: any) {
    console.error('Vercel/Nest handler error:', err);
    res.status(500).json({ message: 'Internal error', detail: String(err?.message ?? err) });
  }
}
