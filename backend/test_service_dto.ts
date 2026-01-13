
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateContractDto } from './src/modules/contracts/dto/contract.dto';

const payload = {
    "roomId": "6965be30e950f0f630a65d4a",
    "startDate": "2026-01-13",
    "endDate": "",
    "roomType": "SHORT_TERM",
    "shortTermPricingType": "DAILY",
    "rentPrice": 5369282.19,
    "depositAmount": 500000,
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

console.log('--- Testing Contract DTO Validation with Service Charges ---');
const instance = plainToInstance(CreateContractDto, payload, { enableImplicitConversion: true });
const errors = validateSync(instance, { whitelist: true, forbidNonWhitelisted: true });

if (errors.length > 0) {
    console.log('Found validation errors:');
    errors.forEach(err => {
        console.log(`- Property: ${err.property}`);
        if (err.children) {
            err.children.forEach(child => {
                console.log(`  - Child Property: ${child.property}`);
                console.log(`  - Constraints: ${JSON.stringify(child.constraints)}`);
            });
        }
    });
} else {
    console.log('No validation errors found!');
}
