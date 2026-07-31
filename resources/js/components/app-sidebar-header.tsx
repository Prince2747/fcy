import { Moon, Sun } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { NotificationsBell } from '@/components/notifications-bell';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-w border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() =>
                                updateAppearance(
                                    appearance === 'dark' ? 'light' : 'dark',
                                )
                            }
                            className="group inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                            aria-label={appearance === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            <Sun className="size-5 scale-100 rotate-0 opacity-80 transition-all group-hover:opacity-100 dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute size-5 scale-0 rotate-90 opacity-80 transition-all group-hover:opacity-100 dark:scale-100 dark:rotate-0" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{appearance === 'dark' ? 'Light mode' : 'Dark mode'}</p>
                    </TooltipContent>
                </Tooltip>
                <NotificationsBell />
            </div>
        </header>
    );
}
