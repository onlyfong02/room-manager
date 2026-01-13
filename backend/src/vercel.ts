import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { I18nValidationPipe } from 'nestjs-i18n';
import express from 'express';

const server = express();

let appPromise: Promise<any> | null = null;

async function bootstrap() {
    console.log('Bootstrapping NestJS for Vercel...');
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
    );

    const configService = app.get(ConfigService);
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.enableCors({
        origin: true,
        credentials: true,
    });

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
        new I18nValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    await app.init();
    console.log('NestJS initialized');
    return app;
}

export default async function handler(req: any, res: any) {
    if (!appPromise) {
        appPromise = bootstrap();
    }
    await appPromise;
    server(req, res);
}
