import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCheck, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { AppNotification, NotificationType } from '@/types';

type PageProps = {
    unreadNotificationsCount?: number;
};

const typeStyles: Record<
    NotificationType,
    { dot: string; icon: string }
> = {
    info: {
        dot: 'bg-blue-500',
        icon: 'text-blue-600 dark:text-blue-400',
    },
    success: {
        dot: 'bg-emerald-500',
        icon: 'text-emerald-600 dark:text-emerald-400',
    },
    warning: {
        dot: 'bg-amber-500',
        icon: 'text-amber-600 dark:text-amber-400',
    },
    error: {
        dot: 'bg-red-500',
        icon: 'text-red-600 dark:text-red-400',
    },
};

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
        return 'Just now';
    }

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    }

    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }

    if (diffDays < 7) {
        return `${diffDays}d ago`;
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

export function NotificationsBell() {
    const { unreadNotificationsCount } = usePage<PageProps>().props;
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // Poll for unread count every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['unreadNotificationsCount'],
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Fetch recent notifications when the dropdown opens
    useEffect(() => {
        if (!open) {
            return;
        }

        setLoading(true);

        fetch('/fcy/notifications?filter=unread', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setNotifications(data.notifications?.data ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [open]);

    const handleMarkAllRead = () => {
        router.post(
            '/fcy/notifications/mark-all-read',
            {},
            {
                preserveScroll: true,
                only: ['unreadNotificationsCount'],
                onSuccess: () => {
                    setNotifications([]);
                },
            },
        );
    };

    const handleMarkAsRead = (id: string) => {
        router.post(
            `/fcy/notifications/${id}/mark-as-read`,
            {},
            {
                preserveScroll: true,
                only: ['unreadNotificationsCount'],
                onSuccess: () => {
                    setNotifications((prev) =>
                        prev.filter((n) => n.id !== id),
                    );
                },
            },
        );
    };

    const count = unreadNotificationsCount ?? 0;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-full"
                    data-test="notifications-bell"
                >
                    <Bell className="h-5 w-5" />
                    {count > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                            {count > 99 ? '99+' : count}
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 p-0"
                sideOffset={8}
            >
                <div className="flex items-center justify-between border-b px-3 py-2.5">
                    <DropdownMenuLabel className="p-0 text-sm font-semibold">
                        Notifications
                    </DropdownMenuLabel>
                    {count > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-1 text-xs font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Loading...
                            </p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-8">
                            <Bell className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                No unread notifications
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const style =
                                typeStyles[notification.data.type] ??
                                typeStyles.info;

                            return (
                                <div key={notification.id}>
                                    <DropdownMenuItem
                                        className="flex flex-col items-start gap-1 px-3 py-2.5"
                                        onClick={() =>
                                            handleMarkAsRead(notification.id)
                                        }
                                    >
                                        <div className="flex w-full items-start gap-2.5">
                                            <div
                                                className={cn(
                                                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800',
                                                    style.icon,
                                                )}
                                            >
                                                <FileText className="h-3.5 w-3.5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                    {notification.data.title}
                                                </p>
                                                <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                                                    {notification.data.message}
                                                </p>
                                                <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                                                    {formatRelativeTime(
                                                        notification.created_at,
                                                    )}
                                                </p>
                                            </div>
                                            <span
                                                className={cn(
                                                    'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                                                    style.dot,
                                                )}
                                            />
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-0" />
                                </div>
                            );
                        })
                    )}
                </div>

                <DropdownMenuItem
                    asChild
                    className="justify-center border-t py-2.5 text-sm font-medium text-red-600 dark:text-red-400"
                >
                    <Link href="/fcy/notifications">View all notifications</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}