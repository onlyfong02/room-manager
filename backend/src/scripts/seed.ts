import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { BuildingsService } from '../modules/buildings/buildings.service';
import { RoomsService } from '../modules/rooms/rooms.service';
import { RoomGroupsService } from '../modules/room-groups/room-groups.service';
import { TenantsService } from '../modules/tenants/tenants.service';
import { ServicesService } from '../modules/services/services.service';
import { RoomType, ShortTermPricingType, RoomStatus } from '../common/constants/enums';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker/locale/en';

const f = faker as any;

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
        const servicesService = app.get(ServicesService);

        // 1. Create Admin User
        const user = await usersService.create({
            email: 'admin@example.com',
            password: 'password123',
            fullName: 'Admin User',
            phone: '0901234567',
        });
        const ownerId = user._id.toString();

        // 2. Create Buildings
        const buildings = [];
        for (let i = 0; i < 10; i++) {
            const building = await buildingsService.create(ownerId, {
                // Safe fallback if street() is missing, verify property access
                name: `Tòa nhà ${f.location?.street ? f.location.street() : f.address?.street() || 'Building ' + i}`,
                address: {
                    street: f.location?.streetAddress ? f.location.streetAddress() : f.address?.streetAddress() || '123 Street',
                    ward: f.location?.state ? f.location.state() : f.address?.state() || 'Ward 1',
                    district: f.location?.county ? f.location.county() : f.address?.county() || 'District 1',
                    city: 'Hồ Chí Minh',
                },
                description: f.lorem.sentence()
            });
            buildings.push(building);
        }
        console.log(`${buildings.length} buildings seeded.`);

        // 3. Create Services
        const serviceTypes = [
            { name: 'Điện', unit: 'kWh', price: 3500 },
            { name: 'Nước', unit: 'm3', price: 15000 },
            { name: 'Internet', unit: 'tháng', price: 100000 },
            { name: 'Vệ sinh', unit: 'tháng', price: 50000 },
        ];

        const services = [];
        for (let i = 0; i < 20; i++) {
            const type = f.helpers.arrayElement(serviceTypes);
            const isFixed = Math.random() > 0.3;
            const price = parseFloat(f.commerce.price({ min: 10000, max: 200000 }));

            const service = await servicesService.create(ownerId, {
                name: `${type.name} ${(f.location?.street ? f.location.street() : 'Service ' + i)}`,
                unit: type.unit,
                priceType: isFixed ? 'FIXED' : 'TABLE',
                fixedPrice: isFixed ? price : undefined,
                priceTiers: !isFixed ? [
                    { fromValue: 0, toValue: 10, price: price },
                    { fromValue: 11, toValue: -1, price: price * 1.5 }
                ] : undefined,
                buildingScope: 'ALL',
                isActive: true
            });
            services.push(service);
        }

        // 4. Rooms & Groups
        console.log('Seeding room groups and rooms...');
        const allRooms = [];
        for (const building of buildings) {
            try {
                const groupCount = f.number.int({ min: 3, max: 5 });
                for (let g = 0; g < groupCount; g++) {
                    const group = await roomGroupsService.create(ownerId, {
                        buildingId: (building as any)._id.toString(),
                        name: `Group ${f.commerce.productAdjective()}`,
                        description: f.lorem.sentence(),
                        color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
                        sortOrder: g,
                        isActive: true
                    });

                    const roomCount = f.number.int({ min: 10, max: 15 });
                    for (let r = 0; r < roomCount; r++) {
                        const roomType = f.helpers.arrayElement([RoomType.LONG_TERM, RoomType.SHORT_TERM]);

                        const roomName = `${building.name.substring(0, 1).toUpperCase()}-${g + 1}0${r + 1}`;

                        // Debug log 
                        // console.log(`Creating room ${roomName}`);

                        const roomData: any = {
                            buildingId: (building as any)._id.toString(),
                            roomGroupId: (group as any)._id.toString(),
                            roomName: roomName,
                            floor: g + 1,
                            roomType: roomType,
                            status: f.helpers.arrayElement([RoomStatus.AVAILABLE, RoomStatus.OCCUPIED, RoomStatus.MAINTENANCE]),
                            area: f.number.int({ min: 20, max: 60 }),
                            maxOccupancy: f.number.int({ min: 2, max: 6 }),
                            amenities: f.helpers.arrayElements(['AC', 'Wifi'], 2), // Fixed count argument
                            description: f.lorem.sentence()
                        };

                        if (roomType === RoomType.LONG_TERM) {
                            roomData.defaultRoomPrice = parseFloat(f.commerce.price({ min: 3000000, max: 8000000 }));
                            roomData.defaultElectricPrice = 3500;
                            roomData.defaultWaterPrice = 20000;
                            roomData.defaultTermMonths = 6;
                        } else {
                            roomData.shortTermPricingType = ShortTermPricingType.FIXED;
                            roomData.fixedPrice = parseFloat(f.commerce.price({ min: 200000, max: 1000000 }));
                        }

                        const room = await roomsService.create(ownerId, roomData);
                        allRooms.push(room);
                    }
                }
            } catch (err: any) {
                console.error(`Error in building ${building.name}:`, err.message);
                // console.error(err); 
            }
        }
        console.log(`${allRooms.length} rooms seeded.`);

        // 5. Tenants
        const tenants = [];
        for (let i = 0; i < 150; i++) {
            const tenant = await tenantsService.create(ownerId, {
                fullName: f.person.fullName(),
                idCard: f.string.numeric(12),
                phone: f.phone.number(),
                email: f.internet.email(),
                permanentAddress: f.location?.streetAddress ? f.location.streetAddress() : 'Address',
                occupation: f.person.jobTitle()
            });
            tenants.push(tenant);
        }
        console.log(`${tenants.length} tenants seeded.`);
        console.log('Seeding completed successfully!');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();
