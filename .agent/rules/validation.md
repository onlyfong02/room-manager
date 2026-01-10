# Validation Rules

## File Location
- `frontend/src/lib/validations.ts`

## Schema Pattern
Use Zod with react-hook-form and i18n:

```typescript
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

export const useModuleSchema = () => {
    const { t } = useTranslation();

    return z.object({
        // Required string
        name: z.string().min(1, t('validation.required', { field: t('module.name') })),
        
        // Optional string
        description: z.string().optional(),
        
        // Email with validation
        email: z.string()
            .min(1, t('validation.required', { field: t('module.email') }))
            .email(t('validation.email', { field: t('module.email') })),
        
        // Phone with Vietnamese format
        phone: z.string()
            .min(1, t('validation.required', { field: t('module.phone') }))
            .refine((val) => isValidVietnamesePhone(val), {
                message: t('validation.phone'),
            }),
        
        // Number with min value
        price: z.number().min(0, t('validation.min', { field: t('module.price'), min: 0 })),
        
        // Password with min length
        password: z.string()
            .min(1, t('validation.required', { field: t('auth.password') }))
            .min(6, t('validation.minLength', { field: t('auth.password'), min: 6 })),
    });
};

export type ModuleFormData = z.infer<ReturnType<typeof useModuleSchema>>;
```

## Vietnamese Phone Validation
```typescript
const vietnamesePhoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])[0-9]{7}$/;

export const isValidVietnamesePhone = (phone: string): boolean => {
    return vietnamesePhoneRegex.test(phone.replace(/\s/g, ''));
};
```

Valid formats:
- 10 digits: 0901234567, 0351234567
- +84 format: +84901234567

## Form Usage
```typescript
const schema = useModuleSchema();

const form = useForm<ModuleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
        name: '',
        email: '',
        // ...
    },
});
```

## Error Display
```tsx
<Input
    {...register('fieldName')}
    className={errors.fieldName ? 'border-destructive' : ''}
/>
{errors.fieldName && (
    <p className="text-sm text-destructive">{errors.fieldName.message}</p>
)}
```

## Required Field Indicator
Always mark required fields with red asterisk:
```tsx
<Label htmlFor="name">
    {t('module.name')} <span className="text-destructive">*</span>
</Label>
```

## Important Rules
1. **Always use hooks** for schemas (`useModuleSchema`) to get i18n translations
2. **Export type** alongside schema for TypeScript support
3. **Use refine** for custom validations (like phone format)
4. **Border color** changes to `border-destructive` on error
5. **Error message** displayed with `text-sm text-destructive`
