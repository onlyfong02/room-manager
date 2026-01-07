import { useTranslation } from 'react-i18next';
import { Building2, DoorOpen, Users, Receipt } from 'lucide-react';

export default function DashboardPage() {
    const { t } = useTranslation();

    const stats = [
        { icon: Building2, label: t('dashboard.stats.buildings'), value: '0', color: 'bg-blue-500' },
        { icon: DoorOpen, label: t('dashboard.stats.rooms'), value: '0', color: 'bg-green-500' },
        { icon: Users, label: t('dashboard.stats.tenants'), value: '0', color: 'bg-purple-500' },
        { icon: Receipt, label: t('dashboard.stats.unpaidInvoices'), value: '0', color: 'bg-orange-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">{t('dashboard.title')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">{t('dashboard.welcome')}</h2>
                <p className="text-gray-600">
                    {t('dashboard.description')}
                </p>
            </div>
        </div>
    );
}
