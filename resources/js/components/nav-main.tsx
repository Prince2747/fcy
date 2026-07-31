import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                       <SidebarMenuButton
    asChild
    isActive={isCurrentUrl(item.href)}
    tooltip={{ children: item.title }}
    className="
        transition-all duration-200
        data-[active=true]:bg-gradient-to-r
        data-[active=true]:from-red-600
        data-[active=true]:to-red-700
        data-[active=true]:text-white
        data-[active=true]:shadow-sm
        data-[active=true]:shadow-red-500/20
        data-[active=true]:hover:from-red-700
        data-[active=true]:hover:to-red-800
        data-[active=true]:hover:text-white
    "
>
    <Link href={item.href} prefetch>
        {item.icon && <item.icon />}
        <span>{item.title}</span>
    </Link>
</SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
