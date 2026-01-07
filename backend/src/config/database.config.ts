import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    MongooseModuleOptions,
    MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class DatabaseConfig implements MongooseOptionsFactory {
    constructor(private configService: ConfigService) { }

    createMongooseOptions(): MongooseModuleOptions {
        return {
            uri: this.configService.get<string>('MONGODB_URI'),
            user: this.configService.get<string>('MONGODB_USER'),
            pass: this.configService.get<string>('MONGODB_PASSWORD'),
            retryAttempts: 3,
            retryDelay: 1000,
        };
    }
}
