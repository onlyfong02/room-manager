import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Users, Search, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import apiClient from '@/api/client';
import Pagination from '@/components/Pagination';
import TenantForm, { TenantFormData } from '@/components/forms/TenantForm';

interface Tenant {
    _id: string;
    code: string;
    fullName: string;
    email: string;
    phone: string;
    idNumber: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    occupation?: string;
    // Map emergency contact
    emergencyContact?: {
        name?: string;
        phone?: string;
        relationship?: string;
    };
    isActive: boolean;
    createdAt: string;
}

const tenantsApi = {
    getAll: async (): Promise<Tenant[]> => {
        const response = await apiClient.get('/tenants');
        // API may return {data: [...], meta: {...} } or direct array
        const rawData = Array.isArray(response.data?.data) ? response.data.data :
            Array.isArray(response.data) ? response.data : [];

        // Map backend fields to frontend interface
        return rawData.map((t: any) => ({
            ...t,
            idNumber: t.idCard,
            address: t.permanentAddress,
        }));
    },
    create: async (data: TenantFormData) => {
        // Map frontend fields to backend fields
        const backendData = {
            fullName: data.fullName,
            idCard: data.idNumber, // Backend uses idCard, not idNumber
            phone: data.phone,
            email: data.email || undefined,
            dateOfBirth: data.dateOfBirth || undefined,
            gender: data.gender || undefined,
            permanentAddress: data.address || undefined,
            occupation: data.occupation || undefined,
            emergencyContact: data.emergencyContact || undefined,
        };
        const response = await apiClient.post('/tenants', backendData);
        return response.data;
    },
    update: async (id: string, data: Partial<TenantFormData>) => {
        // Map frontend fields to backend fields
        const backendData: any = {};
        if (data.fullName) backendData.fullName = data.fullName;
        if (data.phone) backendData.phone = data.phone;
        if (data.email) backendData.email = data.email;
        if (data.idNumber) backendData.idCard = data.idNumber;
        if (data.dateOfBirth) backendData.dateOfBirth = data.dateOfBirth;
        if (data.gender) backendData.gender = data.gender;
        if (data.occupation) backendData.occupation = data.occupation;
        if (data.emergencyContact) backendData.emergencyContact = data.emergencyContact;
        if (data.address) backendData.permanentAddress = data.address;

        const response = await apiClient.put(`/tenants/${id}`, backendData);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/tenants/${id}`);
        return response.data;
    },
};

export default function TenantsPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: tenants = [], isLoading } = useQuery({
        queryKey: ['tenants'],
        queryFn: tenantsApi.getAll,
    });

    const createMutation = useMutation({
        mutationFn: tenantsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            setIsAddOpen(false);
            toast({ title: t('tenants.createSuccess') });
        },
        onError: () => {
            toast({ variant: 'destructive', title: t('tenants.createError') });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<TenantFormData> }) =>
            tenantsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            setIsEditOpen(false);
            setSelectedTenant(null);
            toast({ title: t('tenants.updateSuccess') });
        },
        onError: () => {
            toast({ variant: 'destructive', title: t('tenants.updateError') });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: tenantsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            setIsDeleteOpen(false);
            setSelectedTenant(null);
            toast({ title: t('tenants.deleteSuccess') });
        },
        onError: () => {
            toast({ variant: 'destructive', title: t('tenants.deleteError') });
        },
    });

    const handleEdit = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsEditOpen(true);
    };

    const handleDelete = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsDeleteOpen(true);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const filteredTenants = tenants.filter(
        (tenant) =>
            tenant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.phone.includes(searchTerm) ||
            tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredTenants.length / pageSize);
    const paginatedTenants = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTenants.slice(start, start + pageSize);
    }, [filteredTenants, currentPage, pageSize]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('tenants.title')}</h1>
                    <p className="text-muted-foreground">{t('tenants.subtitle')}</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('tenants.add')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{t('tenants.addTitle')}</DialogTitle>
                            <DialogDescription>{t('tenants.addDescription')}</DialogDescription>
                        </DialogHeader>
                        <TenantForm
                            onSubmit={(data) => createMutation.mutate(data)}
                            onCancel={() => setIsAddOpen(false)}
                            isSubmitting={createMutation.isPending}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('common.search')}
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {t('tenants.list')}
                    </CardTitle>
                    <CardDescription>
                        {t('tenants.totalCount', { count: filteredTenants.length })}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : filteredTenants.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('tenants.noData')}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('tenants.fullName')}</TableHead>
                                    <TableHead>{t('tenants.code')}</TableHead>
                                    <TableHead>{t('tenants.contact')}</TableHead>
                                    <TableHead>{t('tenants.idNumber')}</TableHead>
                                    <TableHead className="text-center">{t('common.status')}</TableHead>
                                    <TableHead>{t('tenants.createdAt')}</TableHead>
                                    <TableHead className="w-[70px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedTenants.map((tenant) => (
                                    <TableRow key={tenant._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                                        {getInitials(tenant.fullName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{tenant.fullName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{tenant.code}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Phone className="h-3 w-3" />
                                                    {tenant.phone}
                                                </div>
                                                {tenant.email && (
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Mail className="h-3 w-3" />
                                                        {tenant.email}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{tenant.idNumber}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={tenant.isActive ? 'default' : 'secondary'}>
                                                {tenant.isActive ? t('common.active') : t('common.inactive')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(tenant.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(tenant)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(tenant)} className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {filteredTenants.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={filteredTenants.length}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setCurrentPage(1);
                            }}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('tenants.editTitle')}</DialogTitle>
                        <DialogDescription>{t('tenants.editDescription')}</DialogDescription>
                    </DialogHeader>
                    {selectedTenant && (
                        <TenantForm
                            key={selectedTenant._id}
                            defaultValues={{
                                code: selectedTenant.code,
                                fullName: selectedTenant.fullName,
                                email: selectedTenant.email,
                                phone: selectedTenant.phone,
                                idNumber: selectedTenant.idNumber,
                                dateOfBirth: selectedTenant.dateOfBirth ? selectedTenant.dateOfBirth.split('T')[0] : '',
                                gender: selectedTenant.gender,
                                address: selectedTenant.address,
                                occupation: selectedTenant.occupation,
                                emergencyContact: selectedTenant.emergencyContact,
                            }}
                            onSubmit={(data) =>
                                updateMutation.mutate({ id: selectedTenant._id, data })
                            }
                            onCancel={() => setIsEditOpen(false)}
                            isSubmitting={updateMutation.isPending}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('tenants.deleteTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('tenants.deleteConfirm', { name: selectedTenant?.fullName })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedTenant && deleteMutation.mutate(selectedTenant._id)}
                            disabled={deleteMutation.isPending}
                        >
                            {t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
