import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { BuildingsService } from '../modules/buildings/buildings.service';
import { RoomsService } from '../modules/rooms/rooms.service';
import { RoomGroupsService } from '../modules/room-groups/room-groups.service';
import { TenantsService } from '../modules/tenants/tenants.service';
import { RoomType, ShortTermPricingType, RoomStatus } from '../common/constants/enums';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        const connection = app.get<Connection>(getConnectionToken());

        console.log('Clearing database...');
        await connection.dropDatabase();
        console.log('Database cleared.');

        const usersService = app.get(UsersService);
        const buildingsService = app.get(BuildingsService);
        const roomsService = app.get(RoomsService);
        const roomGroupsService = app.get(RoomGroupsService);
        const tenantsService = app.get(TenantsService);

        // 1. Create User
        console.log('Seeding user...');
        const user = await usersService.create({
            email: 'admin@example.com',
            password: 'password123',
            fullName: 'Admin User',
            phone: '0901234567',
        });
        const ownerId = user._id.toString();
        console.log('User seeded:', user.email);

        // 2. Create Buildings
        console.log('Seeding buildings...');
        const buildingA = await buildingsService.create(ownerId, {
            name: 'Skyline Tower',
            address: {
                street: '123 Le Loi',
                ward: 'Ben Nghe',
                district: 'District 1',
                city: 'Ho Chi Minh',
            },
            description: 'Luxury apartments'
        });

        const buildingB = await buildingsService.create(ownerId, {
            name: 'Sunset Villa',
            address: {
                street: '456 Nguyen Hue',
                ward: 'Ben Nghe',
                district: 'District 1',
                city: 'Ho Chi Minh',
            },
            description: 'Quiet villa'
        });

        console.log('Buildings seeded:', buildingA.name, buildingB.name);

        // 3. Create Room Groups
        console.log('Seeding room groups...');
        const groupVIP = await roomGroupsService.create(ownerId, {
            buildingId: (buildingA as any)._id.toString(),
            name: 'VIP Rooms',
            description: 'Luxury rooms with city view',
            color: '#FFD700',
            sortOrder: 1,
            isActive: true
        });

        const groupStandard = await roomGroupsService.create(ownerId, {
            buildingId: (buildingA as any)._id.toString(),
            name: 'Standard Rooms',
            description: 'Affordable rooms',
            color: '#C0C0C0',
            sortOrder: 2,
            isActive: true
        });
        console.log('Room groups seeded:', groupVIP.name, groupStandard.name);

        // 4. Create Rooms
        console.log('Seeding rooms...');

        // Building A - Long Term Room
        await roomsService.create(ownerId, {
            buildingId: (buildingA as any)._id,
            roomGroupId: (groupStandard as any)._id,
            roomName: 'A101',
            floor: 1,
            roomType: RoomType.LONG_TERM,
            status: RoomStatus.AVAILABLE,
            area: 25,
            defaultRoomPrice: 5000000,
            defaultElectricPrice: 3500,
            defaultWaterPrice: 20000,
            defaultTermMonths: 6,
            maxOccupancy: 2,
            amenities: ['AC', 'Wifi', 'Kitchen'],
            description: 'Cozy room for students'
        });

        // Building A - Short Term Room (Hourly - Table)
        await roomsService.create(ownerId, {
            buildingId: (buildingA as any)._id,
            roomGroupId: (groupVIP as any)._id,
            roomName: 'A201',
            floor: 2,
            roomType: RoomType.SHORT_TERM,
            status: RoomStatus.AVAILABLE,
            area: 30,
            shortTermPricingType: ShortTermPricingType.HOURLY,
            hourlyPricingMode: 'TABLE',
            shortTermPrices: [
                { fromValue: 0, toValue: 2, price: 100000 },
                { fromValue: 2, toValue: -1, price: 50000 }, // Additional hours
            ],
            maxOccupancy: 2,
            description: 'VIP hourly room'
        });

        // Building B - Short Term Room (Daily)
        await roomsService.create(ownerId, {
            buildingId: (buildingB as any)._id,
            roomName: 'B101',
            floor: 1,
            roomType: RoomType.SHORT_TERM,
            status: RoomStatus.AVAILABLE,
            area: 35,
            shortTermPricingType: ShortTermPricingType.DAILY,
            shortTermPrices: [
                { fromValue: 0, toValue: 1, price: 500000 },
                { fromValue: 1, toValue: -1, price: 450000 }
            ],
            maxOccupancy: 4,
            amenities: ['TV', 'Fridge']
        });

        console.log('Rooms seeded successfully!');

        // 5. Create Tenants
        console.log('Seeding tenants...');

        await tenantsService.create(ownerId, {
            fullName: 'Nguyen Van An',
            idCard: '012345678901',
            phone: '0909123456',
            email: 'nguyenvanan@gmail.com',
            permanentAddress: '123 Tran Hung Dao, Q1, TP.HCM',
            occupation: 'Nhân viên văn phòng',
            emergencyContact: {
                name: 'Nguyen Thi Hoa',
                phone: '0909111222',
                relationship: 'Mẹ'
            }
        });

        await tenantsService.create(ownerId, {
            fullName: 'Tran Thi Bich',
            idCard: '098765432109',
            phone: '0987654321',
            email: 'tranthibich@gmail.com',
            permanentAddress: '456 Le Van Sy, Q3, TP.HCM',
            occupation: 'Sinh viên',
            emergencyContact: {
                name: 'Tran Van Binh',
                phone: '0909333444',
                relationship: 'Bố'
            }
        });

        await tenantsService.create(ownerId, {
            fullName: 'Le Hoang Cuong',
            idCard: '111222333444',
            phone: '0912345678',
            email: 'lehoangcuong@gmail.com',
            permanentAddress: '789 Nguyen Trai, Q5, TP.HCM',
            occupation: 'Kỹ sư phần mềm'
        });

        await tenantsService.create(ownerId, {
            fullName: 'Pham Minh Duc',
            idCard: '555666777888',
            phone: '0923456789',
            email: 'phamminhduc@gmail.com',
            permanentAddress: '321 Hai Ba Trung, Q1, TP.HCM',
            occupation: 'Giáo viên',
            emergencyContact: {
                name: 'Pham Thi Lan',
                phone: '0909555666',
                relationship: 'Vợ'
            }
        });

        await tenantsService.create(ownerId, {
            fullName: 'Hoang Thi Em',
            idCard: '999888777666',
            phone: '0934567890',
            permanentAddress: '654 Vo Van Tan, Q3, TP.HCM',
            occupation: 'Y tá'
        });

        console.log('Tenants seeded successfully!');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();

