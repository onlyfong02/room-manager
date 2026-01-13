import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, CreditCard, Search, MoreHorizontal, Wallet, Banknote, Smartphone } from 'lucide-react';
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

interface Payment {
    _id: string;
    invoice: { _id: string; invoiceNumber: string };
    invoiceId?: { _id: string; roomId?: { _id: string; buildingId?: { _id: string } } };
    amount: number;
    paymentMethod: 'cash' | 'bank_transfer' | 'momo' | 'other';
    paymentDate: string;
    notes?: string;
    createdAt: string;
}

const paymentsApi = {
    getAll: async (): Promise<Payment[]> => {
        const response = await apiClient.get('/payments');
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/payments/${id}`);
        return response.data;
    },
};

export default function PaymentsPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { selectedBuildingId } = useBuildingStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['payments'],
        queryFn: paymentsApi.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: paymentsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            setIsDeleteOpen(false);
            setSelectedPayment(null);
            toast({ title: t('payments.deleteSuccess') });
        },
        onError: () => {
            toast({ variant: 'destructive', title: t('payments.deleteError') });
        },
    });

    const handleDelete = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsDeleteOpen(true);
    };

    const getMethodBadge = (method: string) => {
        const icons: Record<string, React.ReactNode> = {
            cash: <Banknote className="h-3 w-3 mr-1" />,
            bank_transfer: <Wallet className="h-3 w-3 mr-1" />,
            momo: <Smartphone className="h-3 w-3 mr-1" />,
            other: <CreditCard className="h-3 w-3 mr-1" />,
        };
        const colors: Record<string, string> = {
            cash: 'bg-green-500',
            bank_transfer: 'bg-blue-500',
            momo: 'bg-pink-500',
            other: 'bg-gray-500',
        };
        return (
            <Badge className={colors[method] || 'bg-gray-500'}>
                <span className="flex items-center">
                    {icons[method]}
                    {t(`payments.method_${method}`)}
                </span>
            </Badge>
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Filter by selected building first, then by search
    const buildingFilteredPayments = selectedBuildingId
        ? payments.filter(payment => payment.invoiceId?.roomId?.buildingId?._id === selectedBuildingId)
        : payments;

    const filteredPayments = buildingFilteredPayments.filter(
        (payment) =>
            payment.invoice?.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate total
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

    // Pagination
    const totalPages = Math.ceil(filteredPayments.length / pageSize);
    const paginatedPayments = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredPayments.slice(start, start + pageSize);
    }, [filteredPayments, currentPage, pageSize]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('payments.title')}</h1>
                    <p className="text-muted-foreground">{t('payments.subtitle')}</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('payments.record')}
                </Button>
            </div>

            {/* Summary Card */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{t('payments.totalReceived')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</div>
                    <p className="text-xs text-muted-foreground">
                        {t('payments.transactionCount', { count: filteredPayments.length })}
                    </p>
                </CardContent>
            </Card>

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
                        <CreditCard className="h-5 w-5" />
                        {t('payments.list')}
                    </CardTitle>
                    <CardDescription>
                        {t('payments.totalCount', { count: filteredPayments.length })}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('payments.noData')}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('payments.invoice')}</TableHead>
                                    <TableHead className="text-right">{t('payments.amount')}</TableHead>
                                    <TableHead>{t('payments.method')}</TableHead>
                                    <TableHead>{t('payments.date')}</TableHead>
                                    <TableHead>{t('payments.notes')}</TableHead>
                                    <TableHead className="w-[70px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedPayments.map((payment) => (
                                    <TableRow key={payment._id}>
                                        <TableCell className="font-medium">
                                            {payment.invoice?.invoiceNumber || '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-600">
                                            {formatCurrency(payment.amount)}
                                        </TableCell>
                                        <TableCell>{getMethodBadge(payment.paymentMethod)}</TableCell>
                                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            {payment.notes || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleDelete(payment)} className="text-destructive">
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
                    {filteredPayments.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={filteredPayments.length}
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
                <DialogContent
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >

                    <DialogHeader>
                        <DialogTitle>{t('payments.deleteTitle')}</DialogTitle>
                        <DialogDescription>{t('payments.deleteConfirm')}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedPayment && deleteMutation.mutate(selectedPayment._id)}
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
