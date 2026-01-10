# UI & Styling Rules

## Color System
Using Tailwind CSS with CSS variables defined in `index.css`.

### Semantic Colors
| Usage | Light Mode Class | Dark Mode | Variable |
|-------|-----------------|-----------|----------|
| Background | `bg-background` | Auto | `--background` |
| Foreground | `text-foreground` | Auto | `--foreground` |
| Primary | `bg-primary text-primary-foreground` | Auto | `--primary` |
| Destructive (Error) | `bg-destructive text-destructive-foreground` | Auto | `--destructive` |
| Muted | `text-muted-foreground` | Auto | `--muted-foreground` |
| Border | `border-border` | Auto | `--border` |

### Status Colors
| Status | Class |
|--------|-------|
| Error/Destructive | `text-destructive`, `border-destructive`, `bg-destructive` |
| Success | `text-green-600`, `bg-green-50` |
| Warning | `text-yellow-600`, `bg-yellow-50` |
| Info | `text-blue-600`, `bg-blue-50` |

## Typography

### Headings
- Page title: `text-3xl font-bold tracking-tight`
- Card title: `text-lg font-semibold`
- Subtitle/Description: `text-muted-foreground`

### Body Text
- Normal: Default (no class needed)
- Small: `text-sm`
- Muted: `text-muted-foreground`
- Error: `text-sm text-destructive`

## Component Patterns

### Page Header
```tsx
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('module.title')}</h1>
        <p className="text-muted-foreground">{t('module.subtitle')}</p>
    </div>
    <Button>
        <Plus className="mr-2 h-4 w-4" />
        {t('module.add')}
    </Button>
</div>
```

### Search Input
```tsx
<div className="relative flex-1 max-w-sm">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
        placeholder={t('common.search')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9"
    />
</div>
```

### Card with Table
```tsx
<Card>
    <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {t('module.list')}
        </CardTitle>
        <CardDescription>
            {t('module.totalCount', { count: meta.total })}
        </CardDescription>
    </CardHeader>
    <CardContent>
        {isPending ? (
            <div className="text-center py-8 text-muted-foreground">
                {t('common.loading')}
            </div>
        ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
                {t('module.noData')}
            </div>
        ) : (
            <Table>...</Table>
        )}
    </CardContent>
</Card>
```

### Action Dropdown
```tsx
<DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEdit(item)}>
            <Pencil className="mr-2 h-4 w-4" />
            {t('common.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem 
            onClick={() => handleDelete(item)}
            className="text-destructive"
        >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('common.delete')}
        </DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
```

## Button Variants
- Primary action: `<Button>` (default)
- Secondary: `<Button variant="outline">`
- Danger: `<Button variant="destructive">`
- Icon only: `<Button variant="ghost" size="icon">`

## Badge Usage
```tsx
<Badge variant="secondary">{count}</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Status</Badge>
```

## Dark Mode Support
- Always use semantic color classes (`bg-background`, `text-foreground`)
- Avoid hardcoded colors like `bg-white` (use `bg-background`)
- Use `dark:` prefix for dark-mode specific overrides
- Example: `bg-slate-50 dark:bg-slate-900`

## Important Rules
1. **Use semantic colors** - Never hardcode #hex values
2. **Responsive design** - Use `sm:`, `md:`, `lg:` breakpoints
3. **Icon sizing** - Standard sizes: `h-4 w-4` (small), `h-5 w-5` (medium), `h-6 w-6` (large)
4. **Spacing** - Use consistent gap/padding: `gap-2`, `gap-4`, `p-4`, `py-8`
5. **Loading states** - Show `text-muted-foreground` centered text
6. **Empty states** - Show helpful message with CTA
