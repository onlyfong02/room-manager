import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BuildingState {
    selectedBuildingId: string | null; // null means "All Buildings"
    setSelectedBuildingId: (id: string | null) => void;
}

export const useBuildingStore = create<BuildingState>()(
    persist(
        (set) => ({
            selectedBuildingId: null,
            setSelectedBuildingId: (id) => set({ selectedBuildingId: id }),
        }),
        {
            name: 'building-storage',
        }
    )
);
