import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Calendar, MoreHorizontal, FileText, Wrench, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomCardProps {
    room: {
        _id: string;
        roomCode: string;
        roomName: string;
        floor: number;
        status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'DEPOSITED';
        roomType: 'LONG_TERM' | 'SHORT_TERM';
        defaultRoomPrice?: number;
        roomGroupId?: { _id: string; name: string; color?: string };
        activeContract?: {
            _id: string;
            tenantId?: { _id: string; fullName: string; phone?: string };
            endDate?: string;
            contractCode?: string;
        };
    };
    onCreateContract?: (roomId: string) => void;
    onViewContract?: (contractId: string) => void;
    onToggleStatus?: (roomId: string, newStatus: 'AVAILABLE' | 'MAINTENANCE') => void;
    isTogglingStatus?: boolean;
}

const statusColors = {
    AVAILABLE: 'border-l-green-500',
    OCCUPIED: 'border-l-blue-500',
    MAINTENANCE: 'border-l-yellow-500',
    DEPOSITED: 'border-l-orange-500',
};

const statusBadgeColors = {
    AVAILABLE: 'bg-green-500',
    OCCUPIED: 'bg-blue-500',
    MAINTENANCE: 'bg-yellow-500',
    DEPOSITED: 'bg-orange-500',
};

export default function RoomCard({
    room,
    onCreateContract,
    onViewContract,
    onToggleStatus,
    isTogglingStatus,
}: RoomCardProps) {
    const { t } = useTranslation();

    const formatCurrency = (amount: number | undefined) => {
        if (amount === undefined || amount === null) return '-';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const canToggleStatus = room.status === 'AVAILABLE' || room.status === 'MAINTENANCE';
    const hasActiveContract = room.status === 'OCCUPIED' && room.activeContract;

    return (
        <Card
            className={cn(
                'border-l-4 hover:shadow-md transition-shadow',
                statusColors[room.status]
            )}
        >
            <CardContent className="p-4">
                {/* Header: Status badge and Menu */}
                <div className="flex items-start justify-between mb-3">
                    <Badge className={cn('text-xs', statusBadgeColors[room.status])}>
                        {t(`rooms.status${room.status.charAt(0) + room.status.slice(1).toLowerCase()}`)}
                    </Badge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {room.status === 'AVAILABLE' && onCreateContract && (
                                <DropdownMenuItem onClick={() => onCreateContract(room._id)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('dashboard.createContract')}
                                </DropdownMenuItem>
                            )}
                            {hasActiveContract && onViewContract && (
                                <DropdownMenuItem onClick={() => onViewContract(room.activeContract!._id)}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    {t('dashboard.viewContract')}
                                </DropdownMenuItem>
                            )}
                            {canToggleStatus && onToggleStatus && (
                                <DropdownMenuItem
                                    onClick={() => onToggleStatus(
                                        room._id,
                                        room.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE'
                                    )}
                                    disabled={isTogglingStatus}
                                >
                                    <Wrench className="h-4 w-4 mr-2" />
                                    {room.status === 'AVAILABLE'
                                        ? t('dashboard.setMaintenance')
                                        : t('dashboard.setAvailable')}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Room Name & Code */}
                <h3 className="font-semibold text-lg">{room.roomName}</h3>
                <p className="text-sm text-muted-foreground font-mono">{room.roomCode}</p>

                {/* Room Info or Contract Info */}
                <div className="mt-3 space-y-2 text-sm">
                    {hasActiveContract ? (
                        <>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{room.activeContract?.tenantId?.fullName || t('dashboard.noTenant')}</span>
                            </div>
                            {room.activeContract?.endDate && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{t('dashboard.leaseEnds')}: {formatDate(room.activeContract.endDate)}</span>
                                </div>
                            )}
                        </>
                    ) : room.status === 'MAINTENANCE' ? (
                        <div className="flex items-center gap-2 text-yellow-600">
                            <Wrench className="h-4 w-4" />
                            <span>{t('rooms.statusMaintenance')}</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="italic text-muted-foreground">{t('dashboard.noActiveContract')}</span>
                            </div>
                            {room.defaultRoomPrice && (
                                <div className="text-muted-foreground">
                                    {formatCurrency(room.defaultRoomPrice)}/{t('common.month')}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Action Button */}
                <div className="mt-4">
                    {room.status === 'AVAILABLE' && onCreateContract && (
                        <Button
                            className="w-full"
                            size="sm"
                            onClick={() => onCreateContract(room._id)}
                        >
                            {t('dashboard.createContract')}
                        </Button>
                    )}
                    {hasActiveContract && onViewContract && (
                        <Button
                            variant="secondary"
                            className="w-full"
                            size="sm"
                            onClick={() => onViewContract(room.activeContract!._id)}
                        >
                            {t('dashboard.viewContract')}
                        </Button>
                    )}
                    {room.status === 'MAINTENANCE' && onToggleStatus && (
                        <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                            onClick={() => onToggleStatus(room._id, 'AVAILABLE')}
                            disabled={isTogglingStatus}
                        >
                            {t('dashboard.resolveIssue')}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
