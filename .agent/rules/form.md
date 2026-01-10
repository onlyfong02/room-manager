# Form Component Rules

## File Location
Forms should be in `frontend/src/components/forms/[ModuleName]Form.tsx`

## Form Component Interface
```typescript
interface ModuleFormProps {
    defaultValues?: Partial<ModuleFormData>;
    onSubmit: (data: ModuleFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}
```

## Form Structure
```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { useModuleSchema } from '@/lib/validations';

export default function ModuleForm({
    defaultValues = { name: '', description: '' },
    onSubmit,
    onCancel,
    isSubmitting = false,
}: ModuleFormProps) {
    const { t } = useTranslation();
    const schema = useModuleSchema();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ModuleFormData>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                {/* Form fields */}
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>
                    {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {t('common.save')}
                </Button>
            </DialogFooter>
        </form>
    );
}
```

## Field Patterns

### Text Input
```tsx
<div className="space-y-2">
    <Label htmlFor="name">
        {t('module.name')} <span className="text-destructive">*</span>
    </Label>
    <Input
        id="name"
        {...register('name')}
        placeholder={t('module.namePlaceholder')}
        className={errors.name ? 'border-destructive' : ''}
    />
    {errors.name && (
        <p className="text-sm text-destructive">{errors.name.message}</p>
    )}
</div>
```

### Number Input
```tsx
<div className="space-y-2">
    <Label htmlFor="price">{t('module.price')} *</Label>
    <Input
        id="price"
        type="number"
        {...register('price', { valueAsNumber: true })}
        className={errors.price ? 'border-destructive' : ''}
    />
    {errors.price && (
        <p className="text-sm text-destructive">{errors.price.message}</p>
    )}
</div>
```

### Select with Controller
```tsx
<div className="space-y-2">
    <Label htmlFor="buildingId">{t('rooms.building')} *</Label>
    <Controller
        name="buildingId"
        control={control}
        render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={errors.buildingId ? 'border-destructive' : ''}>
                    <SelectValue placeholder={t('rooms.selectBuilding')} />
                </SelectTrigger>
                <SelectContent>
                    {items.map((item: any) => (
                        <SelectItem key={item._id} value={item._id}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )}
    />
    {errors.buildingId && (
        <p className="text-sm text-destructive">{errors.buildingId.message}</p>
    )}
</div>
```

### Optional Field (no asterisk)
```tsx
<div className="space-y-2">
    <Label htmlFor="description">{t('module.description')}</Label>
    <Input
        id="description"
        {...register('description')}
        placeholder={t('module.descriptionPlaceholder')}
    />
</div>
```

## Layout Patterns

### Two Columns
```tsx
<div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">...</div>
    <div className="space-y-2">...</div>
</div>
```

### Full Width Field in Grid
```tsx
<div className="grid grid-cols-2 gap-4">
    <div className="space-y-2 col-span-2">
        {/* Full width field */}
    </div>
</div>
```

## Important Rules
1. **Separate form components** from page components
2. **Use `useForm` with zodResolver** for validation
3. **Required fields** must have red asterisk `<span className="text-destructive">*</span>`
4. **Error border** using `border-destructive` class
5. **Error message** using `text-sm text-destructive`
6. **Scrollable body** with `max-h-[60vh] overflow-y-auto`
7. **DialogFooter** with Cancel (outline) on left, Submit on right
8. **Disable submit** when `isSubmitting={true}`
