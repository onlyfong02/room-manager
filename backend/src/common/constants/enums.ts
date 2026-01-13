export enum UserRole {
    OWNER = 'OWNER',
    STAFF = 'STAFF',
}

export enum RoomStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    MAINTENANCE = 'MAINTENANCE',
    DEPOSITED = 'DEPOSITED',
}

export enum TenantStatus {
    RENTING = 'RENTING',
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED',
    DEPOSITED = 'DEPOSITED',
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

export enum ContractType {
    LONG_TERM = 'LONG_TERM',
    SHORT_TERM = 'SHORT_TERM',
    DAILY = 'DAILY', // Optional: keep for legacy or specific granularity
    MONTHLY = 'MONTHLY', // Optional: keep for legacy
}

export enum ContractStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    TERMINATED = 'TERMINATED',
}

export enum PaymentCycle {
    MONTHLY = 'MONTHLY',
    MONTHLY_2 = 'MONTHLY_2',
    QUARTERLY = 'QUARTERLY',
    MONTHLY_6 = 'MONTHLY_6',
    MONTHLY_12 = 'MONTHLY_12',
    CUSTOM = 'CUSTOM',
}

export enum InvoiceStatus {
    PENDING = 'PENDING',
    PARTIAL = 'PARTIAL',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
}

export enum PaymentMethod {
    CASH = 'CASH',
    BANK_TRANSFER = 'BANK_TRANSFER',
    MOMO = 'MOMO',
    ZALOPAY = 'ZALOPAY',
    OTHER = 'OTHER',
}

export enum RoomType {
    LONG_TERM = 'LONG_TERM',     // Trọ
    SHORT_TERM = 'SHORT_TERM',   // Ngắn hạn
}

export enum ShortTermPricingType {
    HOURLY = 'HOURLY',   // Theo giờ
    DAILY = 'DAILY',     // Theo ngày
    FIXED = 'FIXED',     // Theo giá cố định
}
