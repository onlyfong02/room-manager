# Modal (Dialog) Rules

## Component Import
```typescript
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
```

## Standard Modal Structure
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
        <Button>Open</Button>
    </DialogTrigger>
    <DialogContent className="max-w-md">
        <DialogHeader>
            <DialogTitle>{t('module.addTitle')}</DialogTitle>
            <DialogDescription>{t('module.addDescription')}</DialogDescription>
        </DialogHeader>
        
        {/* Form content goes here */}
        <ModuleForm
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
            isSubmitting={mutation.isPending}
        />
    </DialogContent>
</Dialog>
```

## Modal Types

### 1. Add Modal
```tsx
<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
    <DialogContent className="max-w-md">
        <DialogHeader>
            <DialogTitle>{t('module.addTitle')}</DialogTitle>
            <DialogDescription>{t('module.addDescription')}</DialogDescription>
        </DialogHeader>
        <ModuleForm
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setIsAddOpen(false)}
            isSubmitting={createMutation.isPending}
        />
    </DialogContent>
</Dialog>
```

### 2. Edit Modal
```tsx
<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
    <DialogContent className="max-w-md">
        <DialogHeader>
            <DialogTitle>{t('module.editTitle')}</DialogTitle>
            <DialogDescription>{t('module.editDescription')}</DialogDescription>
        </DialogHeader>
        {selectedItem && (
            <ModuleForm
                defaultValues={selectedItem}
                onSubmit={(data) => updateMutation.mutate({ id: selectedItem._id, data })}
                onCancel={() => setIsEditOpen(false)}
                isSubmitting={updateMutation.isPending}
            />
        )}
    </DialogContent>
</Dialog>
```

### 3. Delete Confirmation Modal
```tsx
<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>{t('module.deleteTitle')}</DialogTitle>
            <DialogDescription>
                {t('module.deleteConfirm', { name: selectedItem?.name })}
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                {t('common.cancel')}
            </Button>
            <Button
                variant="destructive"
                onClick={() => selectedItem && deleteMutation.mutate(selectedItem._id)}
                disabled={deleteMutation.isPending}
            >
                {t('common.delete')}
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
```

## Form Component Pattern
Forms should be separate components with this interface:
```typescript
interface ModuleFormProps {
    defaultValues?: Partial<ModuleFormData>;
    onSubmit: (data: ModuleFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}
```

## DialogFooter in Form
```tsx
<DialogFooter>
    <Button type="button" variant="outline" onClick={onCancel}>
        {t('common.cancel')}
    </Button>
    <Button type="submit" disabled={isSubmitting}>
        {t('common.save')}
    </Button>
</DialogFooter>
```

## Spacing Rules
- `DialogHeader`: Has `pb-4` padding bottom
- `DialogFooter`: Has `pt-4` padding top
- `DialogContent`: Has `gap-4` between children and `p-6` padding

## Width Classes
- Small forms: `max-w-md` (28rem)
- Medium forms: `max-w-lg` (32rem)
- Large forms: `max-w-xl` (36rem)

## Important Rules
1. **Always use controlled dialog** with `open` and `onOpenChange`
2. **Put DialogHeader first** with title and description
3. **Form scrolling**: Use `max-h-[60vh] overflow-y-auto` for form body
4. **DialogFooter last** with Cancel (outline) and Submit buttons
5. **Disable submit** when `isSubmitting` is true
