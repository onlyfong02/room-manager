# API & Data Fetching Rules

## API Client
Location: `frontend/src/api/client.ts`

### Important: Response Format
API returns paginated data in this format:
```json
{
    "data": [...],
    "meta": {
        "total": 100,
        "totalPages": 10,
        "currentPage": 1,
        "limit": 10
    }
}
```

**Always extract array correctly:**
```typescript
// ❌ WRONG - will cause "map is not a function" error
const { data: items = [] } = useQuery({
    queryFn: async () => {
        const res = await apiClient.get('/items');
        return res.data; // This is { data: [...], meta: {...} }
    },
});

// ✅ CORRECT
const { data: items = [] } = useQuery({
    queryFn: async () => {
        const res = await apiClient.get('/items');
        return Array.isArray(res.data?.data) ? res.data.data : [];
    },
});
```

## API Object Pattern
Define API functions as an object at module level:
```typescript
const moduleApi = {
    getAll: async (params: { page: number; limit: number; search?: string }) => {
        const response = await apiClient.get('/module', { params });
        return response.data;
    },
    create: async (data: ModuleFormData) => {
        const response = await apiClient.post('/module', data);
        return response.data;
    },
    update: async (id: string, data: Partial<ModuleFormData>) => {
        const response = await apiClient.put(`/module/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/module/${id}`);
        return response.data;
    },
};
```

## Query Pattern
```typescript
const { data, isPending, error } = useQuery({
    queryKey: ['module', { page: currentPage, limit: pageSize, search: searchTerm }],
    queryFn: () => moduleApi.getAll({ page: currentPage, limit: pageSize, search: searchTerm }),
});

// Extract data safely
const items = Array.isArray(data?.data) ? data.data : [];
const meta = data?.meta || { total: 0, totalPages: 1 };
```

## Mutation Patterns

### Create
```typescript
const createMutation = useMutation({
    mutationFn: moduleApi.create,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['module'] });
        setIsAddOpen(false);
        toast({ title: t('module.createSuccess') });
    },
    onError: (error: any) => {
        toast({
            variant: 'destructive',
            title: t('module.createError'),
            description: error.response?.data?.message?.join(', ') || error.message
        });
    },
});
```

### Update
```typescript
const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ModuleFormData> }) => {
        return moduleApi.update(id, data);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['module'] });
        setIsEditOpen(false);
        setSelectedItem(null);
        toast({ title: t('module.updateSuccess') });
    },
    onError: (error: any) => {
        toast({
            variant: 'destructive',
            title: t('module.updateError'),
            description: error.response?.data?.message?.join(', ') || error.message
        });
    },
});
```

### Delete
```typescript
const deleteMutation = useMutation({
    mutationFn: moduleApi.delete,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['module'] });
        setIsDeleteOpen(false);
        setSelectedItem(null);
        toast({ title: t('module.deleteSuccess') });
    },
    onError: () => {
        toast({ variant: 'destructive', title: t('module.deleteError') });
    },
});
```

## 401 Handling
Already configured in `api/client.ts`:
- Clears token and redirects to `/login` on 401 errors
- Skips if already on `/login` or `/register` pages

## Important Rules
1. **Always extract array** from paginated response with `data?.data`
2. **Use Array.isArray()** for safety checks
3. **Invalidate queries** after mutations
4. **Show toast** on success/error
5. **Reset state** (close dialog, clear selection) on success
