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
    Settings,
    HelpCircle,
    Bug,
    ChevronLeft,
    ChevronRight,
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
    const [isCollapsed, setIsCollapsed] = useState(false);

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
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 shadow-sm shrink-0">
                <div className="flex h-16 items-center px-4 gap-4">
                    {/* Mobile Menu Button */}
                    <Button
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
                                <DropdownMenuItem onClick={() => navigate('/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>{t('menu.settings')}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/help')}>
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    <span>{t('menu.help')}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/bug-report')}>
                                    <Bug className="mr-2 h-4 w-4" />
                                    <span>{t('menu.bugReport')}</span>
                                </DropdownMenuItem>
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

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-950 transition-all duration-300 ease-in-out border-r
                        lg:static lg:translate-x-0 h-full
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
                    `}
                >
                    <div className="flex flex-col h-full relative">
                        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
                            <nav className="space-y-1 px-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        title={isCollapsed ? item.label : ''}
                                        className={`
                                            flex items-center rounded-lg transition-all duration-300
                                            text-slate-700 hover:bg-slate-100 hover:text-slate-900 
                                            dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50
                                            h-10 px-3
                                        `}
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        <span className={`
                                            ml-3 truncate transition-all duration-300 whitespace-nowrap
                                            ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}
                                        `}>
                                            {item.label}
                                        </span>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Collapse Toggle - Desktop only */}
                        <div className="hidden lg:block absolute -right-4 top-6 z-50">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="h-8 w-8 rounded-full bg-white dark:bg-slate-950 shadow-md border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            </Button>
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
