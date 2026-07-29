import { Link } from '@inertiajs/react';
import { BookOpen, CreditCard, DollarSign, FileText, FolderGit2, LayoutDashboard, UserPlus } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import fcy from '@/routes/fcy';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Customer Registration',
        href: fcy.customers.index(),
        icon: UserPlus,
    },
    {
        title: 'FCY Requests',
        href: fcy.requests.index(),
        icon: FileText,
    },
    {
        title: 'Currencies',
        href: '/fcy/settings/currencies',
        icon: DollarSign,
    },
    {
        title: 'Payment Methods',
        href: '/fcy/settings/payment-methods',
        icon: CreditCard,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                    <SidebarMenuButton size="lg" asChild>
                        <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
