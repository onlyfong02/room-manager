---
description: Validation must be synced between Frontend (Zod) and Backend (class-validator)
---

# Validation Sync Rule (FE & BE)

## Nguyen tac
Moi validation truong du lieu **phai duoc ap dung dong thoi o ca Frontend va Backend**:
- **Frontend**: Zod schema trong `lib/validations.ts`
- **Backend**: class-validator decorators trong DTO files

## Mapping Validation

| Frontend (Zod) | Backend (class-validator) | Mo ta |
|----------------|---------------------------|-------|
| `.min(1, msg)` | `@IsNotEmpty()` | Bat buoc |
| `.string()` | `@IsString()` | Kieu chuoi |
| `.number()` | `@IsNumber()` | Kieu so |
| `.number().min(0)` | `@Min(0)` | So >= 0 |
| `.number().int()` | `@IsInt()` | So nguyen |
| `.email()` | `@IsEmail()` | Email hop le |
| `.optional()` | `@IsOptional()` | Khong bat buoc |
| `.enum(['A', 'B'])` | `@IsEnum(Enum)` | Enum value |
| `.refine(fn)` | Custom validator / pipe | Custom logic |
| `.max(100)` | `@MaxLength(100)` | Do dai toi da |

## Quy trinh them validation moi

1. **Xac dinh truong va rule validation**
2. **Cap nhat FE schema** (`lib/validations.ts`)
3. **Cap nhat BE DTO** (`modules/[module]/dto/[module].dto.ts`)
4. **Them translation** neu can (ca EN va VI)
5. **Test ca 2 phia**

## Checklist khi review

- [ ] FE schema co validation tuong ung voi BE DTO khong?
- [ ] Cac truong required o FE co `@IsNotEmpty()` o BE khong?
- [ ] Cac truong number co `@Min()`, `@Max()` phu hop khong?
- [ ] MaxLength/MinLength co dong bo khong?
