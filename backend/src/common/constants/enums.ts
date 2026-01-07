export enum UserRole {
    OWNER = 'OWNER',
    STAFF = 'STAFF',
}

export enum RoomStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    MAINTENANCE = 'MAINTENANCE',
}

export enum TenantStatus {
    ACTIVE = 'ACTIVE',
    MOVED_OUT = 'MOVED_OUT',
}

export enum ContractType {
    LONG_TERM = 'LONG_TERM',
    DAILY = 'DAILY',
    MONTHLY = 'MONTHLY',
}

export enum ContractStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    TERMINATED = 'TERMINATED',
}

export enum PaymentCycle {
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    DAILY = 'DAILY',
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
