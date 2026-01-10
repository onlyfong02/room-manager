import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, DoorOpen, Search, Zap, Droplets } from 'lucide-react';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import apiClient from '@/api/client';
import Pagination from '@/components/Pagination';
import { useBuildingStore } from '@/stores/buildingStore';
import { formatCellValue } from '@/utils/tableUtils';
import RoomForm, { RoomFormData } from '@/components/forms/RoomForm';
import { PriceTablePopover } from '@/components/PriceTablePopover';

interface ShortTermPriceTier {
    fromValue: number;
    toValue: number;
    price: number;
}

interface Room {
    _id: string;
    roomCode: string;
    roomName: string;
    buildingId: { _id: string; name: string };
    roomGroupId?: { _id: string; name: string };
    floor: number;
    area?: number;
    maxOccupancy?: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
    amenities: string[];
    description?: string;
    // New fields
    roomType: 'LONG_TERM' | 'SHORT_TERM';
    defaultElectricPrice?: number;
    defaultWaterPrice?: number;
    defaultRoomPrice?: number;
    defaultTermMonths?: number;
    shortTermPricingType?: 'HOURLY' | 'DAILY' | 'FIXED';
    hourlyPricingMode?: 'PER_HOUR' | 'TABLE';
    pricePerHour?: number;
    shortTermPrices?: ShortTermPriceTier[];
    fixedPrice?: number;
    createdAt: string;
}

const roomsApi = {
    getAll: async (): Promise<Room[]> => {
        const response = await apiClient.get('/rooms');
        return response.data;
    },
    create: async (data: RoomFormData) => {
        // Clean up empty strings for optional MongoID fields
        const cleanData = {
            ...data,
            roomGroupId: data.roomGroupId || undefined,
            description: data.description || undefined,
            area: data.area || undefined,
            maxOccupancy: data.maxOccupancy || undefined,
        };
        const response = await apiClient.post('/rooms', cleanData);
        return response.data;
    },
    update: async (id: string, data: Partial<RoomFormData>) => {
        // Clean up empty strings for optional MongoID fields
        // Also exclude buildingId as it cannot be changed after creation
        const { buildingId, ...updateData } = data;
        const cleanData = {
            ...updateData,
            roomGroupId: updateData.roomGroupId || undefined,
            description: updateData.description || undefined,
            area: updateData.area || undefined,
            maxOccupancy: updateData.maxOccupancy || undefined,
        };
        const response = await apiClient.put(`/rooms/${id}`, cleanData);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/rooms/${id}`);
        return response.data;
    },
};

export default function RoomsPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { selectedBuildingId } = useBuildingStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: rooms = [], isLoading } = useQuery({
        queryKey: ['rooms'],
        queryFn: roomsApi.getAll,
    });

    const createMutation = useMutation({
        mutationFn: roomsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            setIsAddOpen(false);
            toast({ title: t('rooms.createSuccess') });
        },
        onError: () => {
            toast({ variant: 'destructive', title: t('rooms.createError') });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<RoomFormData> }) =>
            roomsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            setIsEditOpen(false);
            setSelectedRoom(null);
            toast({ title: t('rooms.updateSuccess') });
        },
        onError: () => {
            toast({ variant: 'destructive', title: t('rooms.updateError') });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: roomsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            setIsDeleteOpen(false);
            setSelectedRoom(null);
            toast({ title: t('rooms.deleteSuccess') });
        },
        onError: () => {
            toast({ variant: 'destructive', title: t('rooms.deleteError') });
        },
    });

    // Quick status toggle mutation
    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'AVAILABLE' | 'MAINTENANCE' }) =>
            roomsApi.update(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            toast({ title: t('rooms.statusUpdated') });
        },
        onError: () => {
            toast({ variant: 'destructive', title: t('rooms.updateError') });
        },
    });

    const handleQuickStatusToggle = (room: Room) => {
        if (room.status === 'OCCUPIED') return; // Can't toggle OCCUPIED status
        const newStatus = room.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
        statusMutation.mutate({ id: room._id, status: newStatus });
    };

    const handleEdit = (room: Room) => {
        setSelectedRoom(room);
        setIsEditOpen(true);
    };

    const handleDelete = (room: Room) => {
        setSelectedRoom(room);
        setIsDeleteOpen(true);
    };

    const getStatusBadge = (room: Room) => {
        const isClickable = room.status !== 'OCCUPIED';
        const baseClasses = isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

        switch (room.status) {
            case 'AVAILABLE':
                return (
                    <Badge
                        className={`bg-green-500 ${baseClasses}`}
                        onClick={() => isClickable && handleQuickStatusToggle(room)}
                        title={isClickable ? t('rooms.clickToToggleStatus') : undefined}
                    >
                        {t('rooms.statusAvailable')}
                    </Badge>
                );
            case 'OCCUPIED':
                return <Badge className="bg-blue-500">{t('rooms.statusOccupied')}</Badge>;
            case 'MAINTENANCE':
                return (
                    <Badge
                        className={`bg-yellow-500 ${baseClasses}`}
                        onClick={() => isClickable && handleQuickStatusToggle(room)}
                        title={isClickable ? t('rooms.clickToToggleStatus') : undefined}
                    >
                        {t('rooms.statusMaintenance')}
                    </Badge>
                );
            default:
                return <Badge variant="outline">{room.status}</Badge>;
        }
    };

    const getRoomTypeBadge = (roomType: string) => {
        if (roomType === 'LONG_TERM') {
            return <Badge variant="outline" className="border-green-500 text-green-600">{t('rooms.roomTypeLongTerm')}</Badge>;
        }
        return <Badge variant="outline" className="border-orange-500 text-orange-600">{t('rooms.roomTypeShortTerm')}</Badge>;
    };

    const formatCurrency = (amount: number | undefined) => {
        if (amount === undefined || amount === null) return '-';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Get display price based on room type
    const getDisplayPrice = (room: Room) => {
        if (room.roomType === 'LONG_TERM') {
            return (
                <div className="flex flex-col gap-1 text-sm items-end">
                    <div className="font-medium whitespace-nowrap">
                        {formatCurrency(room.defaultRoomPrice)}
                        <span className="text-muted-foreground text-xs font-normal"> / {room.defaultTermMonths || 1} {t('common.months', 'tháng')}</span>
                    </div>
                    {(room.defaultElectricPrice || room.defaultWaterPrice) && (
                        <div className="flex gap-2 text-xs text-muted-foreground">
                            {room.defaultElectricPrice && (
                                <span className="flex items-center gap-1" title={t('rooms.defaultElectricPrice')}>
                                    <Zap className="h-3 w-3" />
                                    {formatCurrency(room.defaultElectricPrice)}
                                </span>
                            )}
                            {room.defaultWaterPrice && (
                                <span className="flex items-center gap-1" title={t('rooms.defaultWaterPrice')}>
                                    <Droplets className="h-3 w-3" />
                                    {formatCurrency(room.defaultWaterPrice)}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            );
        } else if (room.shortTermPricingType === 'FIXED') {
            return formatCurrency(room.fixedPrice);
        } else if (room.shortTermPricingType === 'HOURLY' && room.hourlyPricingMode === 'PER_HOUR') {
            return formatCurrency(room.pricePerHour) + '/h';
        } else if (room.shortTermPricingType === 'HOURLY' && room.hourlyPricingMode === 'TABLE' && room.shortTermPrices) {
            return <PriceTablePopover shortTermPrices={room.shortTermPrices} pricingType="HOURLY" />;
        } else if (room.shortTermPricingType === 'DAILY' && room.shortTermPrices) {
            return <PriceTablePopover shortTermPrices={room.shortTermPrices} pricingType="DAILY" />;
        }
        return t('rooms.priceTable');
    };

    // Filter by selected building first, then by search
    const buildingFilteredRooms = selectedBuildingId
        ? rooms.filter(room => room.buildingId?._id === selectedBuildingId)
        : rooms;

    const filteredRooms = buildingFilteredRooms.filter(
        (room) =>
            room.roomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.buildingId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredRooms.length / pageSize);
    const paginatedRooms = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredRooms.slice(start, start + pageSize);
    }, [filteredRooms, currentPage, pageSize]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Prepare edit default values
    const getEditDefaultValues = (room: Room): Partial<RoomFormData> => {
        return {
            buildingId: typeof room.buildingId === 'object' ? room.buildingId._id : room.buildingId,
            roomName: room.roomName,
            floor: room.floor,
            area: room.area,
            maxOccupancy: room.maxOccupancy,
            status: room.status,
            description: room.description,
            roomGroupId: room.roomGroupId ? (typeof room.roomGroupId === 'object' ? room.roomGroupId._id : room.roomGroupId) : undefined,
            roomType: room.roomType || 'LONG_TERM',
            defaultElectricPrice: room.defaultElectricPrice,
            defaultWaterPrice: room.defaultWaterPrice,
            defaultRoomPrice: room.defaultRoomPrice,
            defaultTermMonths: room.defaultTermMonths,
            shortTermPricingType: room.shortTermPricingType,
            hourlyPricingMode: room.hourlyPricingMode,
            pricePerHour: room.pricePerHour,
            shortTermPrices: (!room.shortTermPrices || room.shortTermPrices.length === 0)
                ? [
                    { fromValue: 0, toValue: 0, price: 0 },
                    { fromValue: 0, toValue: -1, price: 0 }
                ]
                : room.shortTermPrices,
            fixedPrice: room.fixedPrice,
        };
    };

    // Helper to clean payload before sending to API
    const cleanRoomData = (data: RoomFormData): any => {
        const payload: any = { ...data };

        // Clean up based on room type
        if (payload.roomType === 'LONG_TERM') {
            delete payload.shortTermPricingType;
            delete payload.hourlyPricingMode;
            delete payload.pricePerHour;
            delete payload.shortTermPrices;
            delete payload.fixedPrice;
        } else {
            // Short Term
            delete payload.defaultElectricPrice;
            delete payload.defaultWaterPrice;
            delete payload.defaultRoomPrice;
            delete payload.defaultTermMonths;

            if (payload.shortTermPricingType !== 'HOURLY') {
                delete payload.hourlyPricingMode;
                delete payload.pricePerHour;
            }
            if (payload.shortTermPricingType === 'HOURLY' && payload.hourlyPricingMode === 'PER_HOUR') {
                delete payload.shortTermPrices;
            }
            if (payload.shortTermPricingType === 'HOURLY' && payload.hourlyPricingMode === 'TABLE') {
                delete payload.pricePerHour;
            }
            if (payload.shortTermPricingType !== 'FIXED') {
                delete payload.fixedPrice;
            }
        }
        return payload;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('rooms.title')}</h1>
                    <p className="text-muted-foreground">{t('rooms.subtitle')}</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('rooms.add')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>{t('rooms.addTitle')}</DialogTitle>
                            <DialogDescription>{t('rooms.addDescription')}</DialogDescription>
                        </DialogHeader>
                        <RoomForm
                            onSubmit={(data) => createMutation.mutate(cleanRoomData(data))}
                            onCancel={() => setIsAddOpen(false)}
                            isSubmitting={createMutation.isPending}
                            preselectedBuildingId={selectedBuildingId}
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
                        <DoorOpen className="h-5 w-5" />
                        {t('rooms.list')}
                    </CardTitle>
                    <CardDescription>
                        {t('rooms.totalCount', { count: filteredRooms.length })}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('rooms.noData')}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('rooms.roomName')}</TableHead>
                                    <TableHead>{t('rooms.roomCode')}</TableHead>
                                    <TableHead>{t('rooms.building')}</TableHead>
                                    <TableHead className="text-center">{t('rooms.roomType')}</TableHead>
                                    <TableHead className="text-center">{t('rooms.floor')}</TableHead>
                                    <TableHead className="text-right">{t('rooms.defaultRoomPrice')}</TableHead>
                                    <TableHead className="text-center">{t('common.status')}</TableHead>
                                    <TableHead className="w-[70px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedRooms.map((room) => (
                                    <TableRow key={room._id}>
                                        <TableCell className="font-medium">{formatCellValue(room.roomName)}</TableCell>
                                        <TableCell className="font-mono text-muted-foreground">{formatCellValue(room.roomCode)}</TableCell>
                                        <TableCell>{formatCellValue(room.buildingId?.name)}</TableCell>
                                        <TableCell className="text-center">{getRoomTypeBadge(room.roomType)}</TableCell>
                                        <TableCell className="text-center">{formatCellValue(room.floor)}</TableCell>
                                        <TableCell className="text-right">{getDisplayPrice(room)}</TableCell>
                                        <TableCell className="text-center">{getStatusBadge(room)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(room)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(room)} className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {filteredRooms.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={filteredRooms.length}
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
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{t('rooms.editTitle')}</DialogTitle>
                        <DialogDescription>{t('rooms.editDescription')}</DialogDescription>
                    </DialogHeader>
                    {selectedRoom && (
                        <RoomForm
                            defaultValues={getEditDefaultValues(selectedRoom)}
                            onSubmit={(data) =>
                                updateMutation.mutate({ id: selectedRoom._id, data: cleanRoomData(data) })
                            }
                            onCancel={() => setIsEditOpen(false)}
                            isSubmitting={updateMutation.isPending}
                            isEditing={true}
                            roomCode={selectedRoom.roomCode}
                            currentStatus={selectedRoom.status}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('rooms.deleteTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('rooms.deleteConfirm', { name: selectedRoom?.roomCode })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedRoom && deleteMutation.mutate(selectedRoom._id)}
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
