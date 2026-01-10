import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, FileText, Search, MoreHorizontal, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import apiClient from '@/api/client';
import Pagination from '@/components/Pagination';
import { useBuildingStore } from '@/stores/buildingStore';

interface Contract {
    _id: string;
    tenant: { _id: string; fullName: string };
    room: { _id: string; roomCode: string; buildingId?: { _id: string; name: string } };
    startDate: string;
    endDate: string;
    monthlyRent: number;
    deposit: number;
    status: 'active' | 'expired' | 'terminated';
    createdAt: string;
}

const contractsApi = {
    getAll: async (): Promise<Contract[]> => {
        const response = await apiClient.get('/contracts');
        return response.data;
    },
    create: async (data: Partial<Contract>) => {
        const response = await apiClient.post('/contracts', data);
        return response.data;
    },
    update: async (id: string, data: Partial<Contract>) => {
        const response = await apiClient.put(`/contracts/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/contracts/${id}`);
        return response.data;
    },
};

export default function ContractsPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { selectedBuildingId } = useBuildingStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: contracts = [], isLoading } = useQuery({
        queryKey: ['contracts'],
        queryFn: contractsApi.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: contractsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            setIsDeleteOpen(false);
            setSelectedContract(null);
            toast({ title: t('contracts.deleteSuccess') });
        },
        onError: () => {
            toast({ variant: 'destructive', title: t('contracts.deleteError') });
        },
    });

    const handleDelete = (contract: Contract) => {
        setSelectedContract(contract);
        setIsDeleteOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500">{t('contracts.statusActive')}</Badge>;
            case 'expired':
                return <Badge variant="secondary">{t('contracts.statusExpired')}</Badge>;
            case 'terminated':
                return <Badge variant="destructive">{t('contracts.statusTerminated')}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Filter by selected building first, then by search
    const buildingFilteredContracts = selectedBuildingId
        ? contracts.filter(contract => contract.room?.buildingId?._id === selectedBuildingId)
        : contracts;

    const filteredContracts = buildingFilteredContracts.filter(
        (contract) =>
            contract.tenant?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.room?.roomCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredContracts.length / pageSize);
    const paginatedContracts = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredContracts.slice(start, start + pageSize);
    }, [filteredContracts, currentPage, pageSize]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('contracts.title')}</h1>
                    <p className="text-muted-foreground">{t('contracts.subtitle')}</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('contracts.add')}
                </Button>
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
                        <FileText className="h-5 w-5" />
                        {t('contracts.list')}
                    </CardTitle>
                    <CardDescription>
                        {t('contracts.totalCount', { count: filteredContracts.length })}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : filteredContracts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('contracts.noData')}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('contracts.tenant')}</TableHead>
                                    <TableHead>{t('contracts.room')}</TableHead>
                                    <TableHead>{t('contracts.period')}</TableHead>
                                    <TableHead className="text-right">{t('contracts.monthlyRent')}</TableHead>
                                    <TableHead className="text-center">{t('common.status')}</TableHead>
                                    <TableHead className="w-[70px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedContracts.map((contract) => (
                                    <TableRow key={contract._id}>
                                        <TableCell className="font-medium">{contract.tenant?.fullName || '-'}</TableCell>
                                        <TableCell>{contract.room?.roomCode || '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(contract.monthlyRent)}</TableCell>
                                        <TableCell className="text-center">{getStatusBadge(contract.status)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        {t('common.edit')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(contract)} className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {t('common.delete')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {filteredContracts.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={filteredContracts.length}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setCurrentPage(1);
                            }}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('contracts.deleteTitle')}</DialogTitle>
                        <DialogDescription>{t('contracts.deleteConfirm')}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedContract && deleteMutation.mutate(selectedContract._id)}
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
