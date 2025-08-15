// api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Server } from 'http';

let server: Server; // se inicializa una sola vez en frío

export default async function handler(req: any, res: any) {
  if (!server) {
    const app = await NestFactory.create(AppModule, { logger: false });
    await app.init(); // NO app.listen() en serverless
    server = app.getHttpAdapter().getInstance();
  }
  return server(req, res);
}
