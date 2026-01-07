import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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
    app.enableCors({
        origin: configService.get('CORS_ORIGIN') || 'http://localhost:5173',
        credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix(configService.get('API_PREFIX') || 'api');

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    const port = configService.get('PORT') || 3000;
    await app.listen(port);

    console.log(`🚀 Application is running on: http://localhost:${port}/${configService.get('API_PREFIX')}`);
}

bootstrap();
