import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantsService } from '@modules/tenants/tenants.service';
import { TenantsController } from '@modules/tenants/tenants.controller';
import { Tenant, TenantSchema } from '@modules/tenants/schemas/tenant.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }])],
    controllers: [TenantsController],
    providers: [TenantsService],
    exports: [TenantsService],
})
export class TenantsModule { }
