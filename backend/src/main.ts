import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationPipe } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Get config service
    const configService = app.get(ConfigService);

    // Use Winston logger
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // Enable CORS
    const corsOrigins = configService.get('CORS_ORIGIN')?.split(',') || ['http://localhost:5173', 'http://localhost:5174'];
    app.enableCors({
        origin: corsOrigins,
        credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix(configService.get('API_PREFIX') || 'api');

    // Global validation pipe
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

    const port = process.env.PORT || 3000;
    console.log(`Application is running on: http://localhost:${port} (Restarted at ${new Date().toISOString()})`);
    await app.listen(port);

    console.log(`🚀 Application is running on: http://localhost:${port}/${configService.get('API_PREFIX')}`);
}

bootstrap();
