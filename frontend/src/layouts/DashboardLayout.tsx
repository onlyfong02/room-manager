import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import {
    Home,
    Building2,
    DoorOpen,
    Users,
    FileText,
    Receipt,
    CreditCard,
    LogOut,
    Menu
} from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function DashboardLayout() {
    const { t } = useTranslation();
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: Home, label: t('nav.dashboard'), path: '/' },
        { icon: Building2, label: t('nav.buildings'), path: '/buildings' },
        { icon: DoorOpen, label: t('nav.rooms'), path: '/rooms' },
        { icon: Users, label: t('nav.tenants'), path: '/tenants' },
        { icon: FileText, label: t('nav.contracts'), path: '/contracts' },
        { icon: Receipt, label: t('nav.invoices'), path: '/invoices' },
        { icon: CreditCard, label: t('nav.payments'), path: '/payments' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-white border-r border-gray-200 transition-all duration-300`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    {sidebarOpen && <h1 className="text-xl font-bold text-primary">Room Manager</h1>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">{t('header.title')}</h2>
                        <div className="flex items-center gap-4">
                            <LanguageSwitcher />
                            <span className="text-sm text-gray-600">
                                {t('header.greeting', { name: user?.fullName })}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                {t('auth.logout')}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
