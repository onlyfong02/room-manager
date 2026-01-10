import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useBuildingStore } from '@/stores/buildingStore';
import apiClient from '@/api/client';

interface Building {
    _id: string;
    name: string;
}

const fetchBuildings = async (): Promise<Building[]> => {
    const response = await apiClient.get('/buildings');
    // API returns { data: [...], meta: {...} }, extract the array
    return Array.isArray(response.data?.data) ? response.data.data : [];
};

export default function BuildingSelector() {
    const { t } = useTranslation();
    const { selectedBuildingId, setSelectedBuildingId } = useBuildingStore();

    const { data: buildings = [] } = useQuery({
        queryKey: ['buildings'],
        queryFn: fetchBuildings,
    });

    const hasBuildings = buildings.length > 0;

    // Auto-reset to "all" if selected building no longer exists
    useEffect(() => {
        if (selectedBuildingId && hasBuildings) {
            const buildingExists = buildings.some(b => b._id === selectedBuildingId);
            if (!buildingExists) {
                setSelectedBuildingId(null);
            }
        }
    }, [buildings, selectedBuildingId, hasBuildings, setSelectedBuildingId]);

    return (
        <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <Select
                value={hasBuildings ? (selectedBuildingId || 'all') : 'none'}
                onValueChange={(value) => setSelectedBuildingId(value === 'all' ? null : value)}
                disabled={!hasBuildings}
            >
                <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder={t('common.selectBuilding')}>
                        {!hasBuildings ? (
                            <span className="text-muted-foreground">{t('common.noBuildings')}</span>
                        ) : undefined}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {hasBuildings ? (
                        <>
                            <SelectItem value="all">
                                <span className="font-medium">{t('common.allBuildings')}</span>
                            </SelectItem>
                            {buildings.map((building) => (
                                <SelectItem key={building._id} value={building._id}>
                                    {building.name}
                                </SelectItem>
                            ))}
                        </>
                    ) : (
                        <SelectItem value="none" disabled>
                            {t('common.noBuildings')}
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}
