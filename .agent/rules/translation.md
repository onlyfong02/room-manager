# Translation Rules

## File Structure
- English: `frontend/public/locales/en/translation.json`
- Vietnamese: `frontend/public/locales/vi/translation.json`

## Key Naming Convention

### Module Keys
Each module (buildings, rooms, tenants, etc.) should have its own namespace:
```json
{
    "moduleName": {
        "title": "Tên module (tiêu đề trang)",
        "subtitle": "Mô tả ngắn cho trang",
        "list": "Danh sách [items]",
        "add": "Thêm [item]",
        "addTitle": "Tiêu đề dialog thêm mới",
        "addDescription": "Mô tả dialog thêm mới",
        "editTitle": "Tiêu đề dialog sửa",
        "editDescription": "Mô tả dialog sửa",
        "deleteTitle": "Tiêu đề dialog xóa",
        "deleteConfirm": "Bạn có chắc muốn xóa {{name}}?",
        "noData": "Chưa có [item]. Thêm [item] đầu tiên!",
        "totalCount": "{{count}} [items]",
        "createSuccess": "Tạo [item] thành công",
        "createError": "Tạo [item] thất bại",
        "updateSuccess": "Cập nhật [item] thành công",
        "updateError": "Cập nhật [item] thất bại",
        "deleteSuccess": "Xóa [item] thành công",
        "deleteError": "Xóa [item] thất bại"
    }
}
```

### Field Keys
For each field in a form:
```json
{
    "moduleName": {
        "fieldName": "Label của field",
        "fieldNamePlaceholder": "Placeholder text"
    }
}
```

### Common Keys
Use `common.*` namespace for reusable translations:
- `common.save`, `common.cancel`, `common.delete`, `common.edit`
- `common.loading`, `common.search`, `common.confirm`

### Validation Keys
Use `validation.*` namespace with interpolation:
```json
{
    "validation": {
        "required": "{{field}} là bắt buộc",
        "email": "{{field}} phải là email hợp lệ",
        "phone": "Số điện thoại không hợp lệ",
        "min": "{{field}} phải ít nhất {{min}}",
        "minLength": "{{field}} phải có ít nhất {{min}} ký tự"
    }
}
```

## Usage in Components
```typescript
const { t } = useTranslation();

// Simple key
t('buildings.title')

// With interpolation
t('buildings.deleteConfirm', { name: building.name })
t('validation.required', { field: t('buildings.name') })
```

## Important Rules
1. **Always add both EN and VI** translations simultaneously
2. **Use consistent naming** across modules
3. **Interpolation variables** use `{{variableName}}` syntax
4. **Placeholders** should end with `Placeholder` suffix
