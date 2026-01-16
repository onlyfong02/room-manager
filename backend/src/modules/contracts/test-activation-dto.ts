import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ActivateContractDto } from '@modules/contracts/dto/contract.dto';

async function testValidation(payload: any, label: string) {
    console.log(`\n--- Testing: ${label} ---`);
    const dto = plainToInstance(ActivateContractDto, payload, { enableImplicitConversion: true });
    console.log('Transformed DTO:', dto);
    console.log('startDate type:', typeof dto.startDate);
    console.log('startDate is Date instance:', dto.startDate instanceof Date);
    console.log('startDate toString:', Object.prototype.toString.call(dto.startDate));
    console.log('startDate getTime:', (dto.startDate as any).getTime());
    console.log('startDate is valid:', !isNaN((dto.startDate as any).getTime()));

    const errors = await validate(dto);
    if (errors.length > 0) {
        console.log('Validation Errors:', JSON.stringify(errors, null, 2));
    } else {
        console.log('Validation Passed!');
    }
}

async function runTests() {
    await testValidation({
        startDate: '2026-01-13',
        endDate: '2027-01-13'
    }, 'Valid dates as strings');

    await testValidation({
        startDate: '2026-01-13',
        endDate: ''
    }, 'Empty string endDate');

    await testValidation({
        startDate: '2026-01-13',
        endDate: null
    }, 'Null endDate');

    await testValidation({
        startDate: '',
        endDate: '2027-01-13'
    }, 'Empty string startDate');
}

runTests();
