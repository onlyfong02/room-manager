import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import {
    Home,
    Building2,
    DoorOpen,
    Users,
    FileText,
    Receipt,
    CreditCard,
    LogOut,
    Menu,
    X,
    Layers,
    Wrench,
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import BuildingSelector from '@/components/BuildingSelector';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardLayout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: Home, label: t('menu.dashboard'), path: '/' },
        { icon: Building2, label: t('menu.buildings'), path: '/buildings' },
        { icon: DoorOpen, label: t('menu.rooms'), path: '/rooms' },
        { icon: Layers, label: t('menu.roomGroups'), path: '/room-groups' },
        { icon: Users, label: t('menu.tenants'), path: '/tenants' },
        { icon: Wrench, label: t('menu.services'), path: '/services' },
        { icon: FileText, label: t('menu.contracts'), path: '/contracts' },
        { icon: Receipt, label: t('menu.invoices'), path: '/invoices' },
        { icon: CreditCard, label: t('menu.payments'), path: '/payments' },
    ];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 shadow-sm">
                <div className="flex h-16 items-center px-4 gap-4">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>

                    {/* Logo/Title */}
                    <Link to="/" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
                        <Building2 className="h-6 w-6 text-primary" />
                        <span className="hidden sm:inline-block">Room Manager</span>
                    </Link>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <BuildingSelector />
                        </div>
                        <LanguageSwitcher />
                        <ThemeToggle />

                        {/* User Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar>
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {user?.fullName ? getInitials(user.fullName) : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>{t('menu.logout')}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-white dark:bg-slate-950 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    <div className="flex h-full flex-col pt-16 lg:pt-0">
                        <div className="flex-1 overflow-y-auto py-4">
                            <nav className="space-y-1 px-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
