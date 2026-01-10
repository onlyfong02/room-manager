import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, DoorOpen, Users, Receipt } from 'lucide-react';

export default function DashboardPage() {
    const { t } = useTranslation();

    const stats = [
        {
            title: t('dashboard.totalBuildings'),
            value: '0',
            icon: Building2,
            description: t('dashboard.buildingsDesc'),
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: t('dashboard.totalRooms'),
            value: '0',
            icon: DoorOpen,
            description: t('dashboard.roomsDesc'),
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: t('dashboard.totalTenants'),
            value: '0',
            icon: Users,
            description: t('dashboard.tenantsDesc'),
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            title: t('dashboard.pendingInvoices'),
            value: '0',
            icon: Receipt,
            description: t('dashboard.invoicesDesc'),
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
                <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`rounded-full p-2 ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Welcome Card */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('dashboard.welcome')}</CardTitle>
                    <CardDescription>{t('dashboard.welcomeDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {t('dashboard.getStarted')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
