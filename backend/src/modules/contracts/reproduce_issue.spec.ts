
import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from './contracts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Contract } from './schemas/contract.schema';
import { RoomsService } from '../rooms/rooms.service';
import { TenantsService } from '../tenants/tenants.service';
import { ServicesService } from '../services/services.service';
import { CreateContractDto } from './dto/contract.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Define the payload
const rawPayload = {
    "buildingId": "6965be2ee950f0f630a6533b",
    "roomId": "6965be30e950f0f630a65d4a",
    "tenantId": "6965be31e950f0f630a65ffb",
    "startDate": "2026-01-13",
    // "endDate": "",
    "roomType": "SHORT_TERM",
    "shortTermPricingType": "DAILY",
    "rentPrice": 5369282.19,
    "electricityPrice": 3500,
    "waterPrice": 20000,
    "pricePerHour": 0,
    "fixedPrice": 0,
    "shortTermPrices": [
        { "fromValue": 0, "toValue": 3, "price": 300000 },
        { "fromValue": 3, "toValue": 4, "price": 300000 },
        { "fromValue": 4, "toValue": 5, "price": 300000 },
        { "fromValue": 5, "toValue": -1, "price": 300000 }
    ],
    "depositAmount": 500000,
    "paymentCycle": "MONTHLY",
    "paymentDueDay": 1,
    "initialElectricIndex": 0,
    "initialWaterIndex": 0,
    "serviceCharges": [
        {
            "name": "Điện Vida Extension",
            "amount": 169257.65,
            "quantity": 2,
            "isRecurring": true,
            "isPredefined": true,
            "serviceId": "6965be2ee950f0f630a65376"
        }
    ]
};

describe('ContractsService Reproduction', () => {
    let service: ContractsService;
    let servicesService: ServicesService;

    const mockContractModel = {
        findOne: jest.fn(),
        save: jest.fn(),
    };

    const mockRoomsService = {
        findOne: jest.fn().mockResolvedValue({
            _id: '6965be30e950f0f630a65d4a',
            buildingId: '6965be2ee950f0f630a6533b',
            roomType: 'SHORT_TERM'
        }),
    };

    const mockTenantsService = {
        findOne: jest.fn().mockResolvedValue({ _id: '6965be31e950f0f630a65ffb' }),
    };

    const mockServicesService = {
        findOne: jest.fn().mockResolvedValue({
            _id: '6965be2ee950f0f630a65376',
            name: 'Điện Vida Extension',
            priceType: 'FIXED',
            fixedPrice: 169257.65
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ContractsService,
                { provide: getModelToken(Contract.name), useValue: mockContractModel },
                { provide: RoomsService, useValue: mockRoomsService },
                { provide: TenantsService, useValue: mockTenantsService },
                { provide: ServicesService, useValue: mockServicesService },
            ],
        }).compile();

        service = module.get<ContractsService>(ContractsService);
        servicesService = module.get<ServicesService>(ServicesService);
    });

    it('should validate and create contract successfully', async () => {
        // 1. DTO Transformation & Validation
        const dto = plainToInstance(CreateContractDto, rawPayload, { enableImplicitConversion: true });

        // Check filtering of endDate
        console.log('EndDate after transform:', dto.endDate); // Should be undefined

        const errors = await validate(dto);
        if (errors.length > 0) {
            console.log('Validation Errors:', JSON.stringify(errors, null, 2));
            throw new Error('DTO Validation failed');
        }

        // 2. Service Logic Validation
        await service.validateCreateContract('owner_id', dto);
    });
});
