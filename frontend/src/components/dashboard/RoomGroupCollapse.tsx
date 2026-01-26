import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import RoomCard from './RoomCard';

interface Room {
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
}

interface RoomGroupCollapseProps {
    groupName: string;
    groupColor?: string;
    rooms: Room[];
    onCreateContract?: (roomId: string) => void;
    onViewContract?: (contractId: string) => void;
    onToggleStatus?: (roomId: string, newStatus: 'AVAILABLE' | 'MAINTENANCE') => void;
    isTogglingStatus?: boolean;
    defaultOpen?: boolean;
}

export default function RoomGroupCollapse({
    groupName,
    groupColor,
    rooms,
    onCreateContract,
    onViewContract,
    onToggleStatus,
    isTogglingStatus,
    defaultOpen = true,
}: RoomGroupCollapseProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Count rooms by status
    const statusCounts = {
        AVAILABLE: rooms.filter(r => r.status === 'AVAILABLE').length,
        OCCUPIED: rooms.filter(r => r.status === 'OCCUPIED').length,
        MAINTENANCE: rooms.filter(r => r.status === 'MAINTENANCE').length,
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <div
                    className={cn(
                        'flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
                        'border-l-4',
                        groupColor ? '' : 'border-l-gray-400'
                    )}
                    style={groupColor ? { borderLeftColor: groupColor } : undefined}
                >
                    <div className="flex items-center gap-3">
                        <ChevronDown
                            className={cn(
                                'h-5 w-5 transition-transform',
                                isOpen ? '' : '-rotate-90'
                            )}
                        />
                        <span className="font-semibold text-lg">{groupName}</span>
                        <Badge variant="secondary" className="text-xs">
                            {rooms.length} {t('common.rooms')}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        {statusCounts.AVAILABLE > 0 && (
                            <Badge className="bg-green-500 text-xs">
                                {statusCounts.AVAILABLE} {t('dashboard.vacant')}
                            </Badge>
                        )}
                        {statusCounts.OCCUPIED > 0 && (
                            <Badge className="bg-blue-500 text-xs">
                                {statusCounts.OCCUPIED} {t('dashboard.occupied')}
                            </Badge>
                        )}
                        {statusCounts.MAINTENANCE > 0 && (
                            <Badge className="bg-yellow-500 text-xs">
                                {statusCounts.MAINTENANCE} {t('dashboard.maintenance')}
                            </Badge>
                        )}
                    </div>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 pl-8">
                    {rooms.map((room) => (
                        <RoomCard
                            key={room._id}
                            room={room}
                            onCreateContract={onCreateContract}
                            onViewContract={onViewContract}
                            onToggleStatus={onToggleStatus}
                            isTogglingStatus={isTogglingStatus}
                        />
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
