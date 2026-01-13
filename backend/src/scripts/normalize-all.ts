import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { normalizeString } from '../common/utils/string.util';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const connection = app.get<Connection>(getConnectionToken());

    const roomGroupModel = connection.model('RoomGroup');
    const serviceModel = connection.model('Service');
    const tenantModel = connection.model('Tenant');

    console.log('--- Start Migration: Normalize Names ---');

    // 1. Room Groups
    console.log('1. Normalizing Room Groups...');
    const roomGroups = await roomGroupModel.find({});
    let groupsCount = 0;
    for (const group of roomGroups) {
        const nameNormalized = normalizeString(group.name);
        if (group.nameNormalized !== nameNormalized) {
            group.nameNormalized = nameNormalized;
            await group.save();
            groupsCount++;
        }
    }
    console.log(`Updated ${groupsCount} Room Groups.`);

    // 2. Services
    console.log('2. Normalizing Services...');
    const services = await serviceModel.find({});
    let servicesCount = 0;
    for (const service of services) {
        const nameNormalized = normalizeString(service.name);
        if (service.nameNormalized !== nameNormalized) {
            service.nameNormalized = nameNormalized;
            await service.save();
            servicesCount++;
        }
    }
    console.log(`Updated ${servicesCount} Services.`);

    // 3. Tenants
    console.log('3. Normalizing Tenants...');
    const tenants = await tenantModel.find({});
    let tenantsCount = 0;
    for (const tenant of tenants) {
        const fullNameNormalized = normalizeString(tenant.fullName);
        if (tenant.fullNameNormalized !== fullNameNormalized) {
            tenant.fullNameNormalized = fullNameNormalized;
            await tenant.save();
            tenantsCount++;
            if (tenantsCount % 100 === 0) console.log(`Processed ${tenantsCount} tenants...`);
        }
    }
    console.log(`Updated ${tenantsCount} Tenants.`);

    console.log('--- Migration Finished! ---');
    await app.close();
}

bootstrap();
