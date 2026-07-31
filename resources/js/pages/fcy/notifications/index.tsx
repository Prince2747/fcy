import { Head, router, setLayoutProps } from '@inertiajs/react';
import {
    Bell,
    CheckCheck,
    CheckCircle2,
    Info,
    AlertTriangle,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import fcy from '@/routes/fcy';
import type { AppNotification, NotificationType } from '@/types';
import { type BreadcrumbItem } from '@/types';

interface NotificationsIndexProps {
    notifications: {
        data: AppNotification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filter: 'all' | 'unread';
}

const typeConfig: Record<
    NotificationType,
    { icon: typeof Info; iconClass: string; dotClass: string; bgClass: string }
> = {
    info: {
        icon: Info,
        iconClass: 'text-blue-600 dark:text-blue-400',
        dotClass: 'bg-blue-500',
        bgClass: 'bg-blue-500/10',
    },
    success: {
        icon: CheckCircle2,
        iconClass: 'text-emerald-600 dark:text-emerald-400',
        dotClass: 'bg-emerald-500',
        bgClass: 'bg-emerald-500/10',
    },
    warning: {
        icon: AlertTriangle,
        iconClass: 'text-amber-600 dark:text-amber-400',
        dotClass: 'bg-amber-500',
        bgClass: 'bg-amber-500/10',
    },
    error: {
        icon: XCircle,
        iconClass: 'text-red-600 dark:text-red-400',
        dotClass: 'bg-red-500',
        bgClass: 'bg-red-500/10',
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
        year: 'numeric',
    });
}

export default function NotificationsIndex({
    notifications,
    filter,
}: NotificationsIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Notifications', href: '/fcy/notifications' },
    ];

    setLayoutProps({ breadcrumbs });

    function handleFilterChange(newFilter: 'all' | 'unread') {
        router.get(
            fcy.notifications.index().url,
            { filter: newFilter },
            { preserveState: true, replace: true },
        );
    }

    function handleMarkAsRead(id: string) {
        router.post(
            fcy.notifications.markAsRead({ id }).url,
            {},
            {
                preserveScroll: true,
                only: ['notifications', 'unreadNotificationsCount'],
            },
        );
    }

    function handleMarkAllRead() {
        router.post(
            fcy.notifications.markAllRead().url,
            {},
            {
                preserveScroll: true,
                only: ['notifications', 'unreadNotificationsCount'],
            },
        );
    }

    const hasUnread = notifications.data.some((n) => n.read_at === null);

    return (
        <>
            <Head title="Notifications" />

            <div className="flex flex-col gap-6 pb-8 px-8 md:px-12">
                {/* Header */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-950/30 md:p-8">
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-red-500/5 to-transparent blur-3xl" />

                    <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                                    Activity Feed
                                </span>
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
                                Notifications
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Stay updated on FCY request activity across the
                                workflow.
                            </p>
                        </div>

                        {hasUnread && (
                            <Button
                                onClick={handleMarkAllRead}
                                className="gap-2 bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white shadow-sm hover:from-red-700 hover:to-red-800 hover:shadow"
                            >
                                <CheckCheck className="h-4 w-4" />
                                Mark all as read
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('all')}
                        className={cn(
                            'h-9 gap-2',
                            filter === 'all'
                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                                : 'border-zinc-250 dark:border-zinc-800',
                        )}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'unread' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('unread')}
                        className={cn(
                            'h-9 gap-2',
                            filter === 'unread'
                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                                : 'border-zinc-250 dark:border-zinc-800',
                        )}
                    >
                        Unread
                    </Button>
                </div>

                {/* Notifications List */}
                <Card className="overflow-hidden border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
                    <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-850 px-6">
                        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Bell className="h-4 w-4 text-zinc-450" />
                            {filter === 'unread'
                                ? 'Unread Notifications'
                                : 'All Notifications'}
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-805 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                                {notifications.total}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {notifications.data.length > 0 ? (
                            <>
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
                                    {notifications.data.map((notification) => {
                                        const config =
                                            typeConfig[notification.data.type] ??
                                            typeConfig.info;
                                        const Icon = config.icon;
                                        const isUnread =
                                            notification.read_at === null;

                                        return (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    'flex items-start gap-4 px-6 py-4 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30',
                                                    isUnread && 'bg-zinc-50/30 dark:bg-zinc-900/20',
                                                )}
                                            >
                                                {/* Icon */}
                                                <div
                                                    className={cn(
                                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                                                        config.bgClass,
                                                    )}
                                                >
                                                    <Icon
                                                        className={cn(
                                                            'h-5 w-5',
                                                            config.iconClass,
                                                        )}
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                            {
                                                                notification
                                                                    .data
                                                                    .title
                                                            }
                                                        </p>
                                                        {isUnread && (
                                                            <span
                                                                className={cn(
                                                                    'h-2 w-2 shrink-0 rounded-full',
                                                                    config.dotClass,
                                                                )}
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                                                        {
                                                            notification
                                                                .data.message
                                                        }
                                                    </p>
                                                    <div className="mt-1.5 flex items-center gap-3">
                                                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                                            {formatRelativeTime(
                                                                notification.created_at,
                                                            )}
                                                        </span>
                                                        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                                                            {
                                                                notification
                                                                    .data
                                                                    .request_number
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action */}
                                                {isUnread && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                notification.id,
                                                            )
                                                        }
                                                        className="h-8 shrink-0 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        Mark as read
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-zinc-100 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/10">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                        Showing {notifications.from} to{' '}
                                        {notifications.to} of{' '}
                                        {notifications.total} notifications
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {notifications.links.map(
                                            (link, i) => {
                                                if (!link.url) {
                                                    return (
                                                        <span
                                                            key={i}
                                                            className="px-2.5 py-1.5 text-xs text-zinc-400 dark:text-zinc-600"
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    );
                                                }
                                                return (
                                                    <Button
                                                        key={i}
                                                        variant={
                                                            link.active
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        size="sm"
                                                        className="h-8 min-w-8 px-2 text-xs border-zinc-200 dark:border-zinc-800"
                                                        onClick={() =>
                                                            router.get(
                                                                link.url!,
                                                                {},
                                                                {
                                                                    preserveState:
                                                                        true,
                                                                    replace: true,
                                                                },
                                                            )
                                                        }
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 mb-4">
                                    <Bell className="h-10 w-10 text-zinc-400" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-350">
                                    No notifications
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1.5">
                                    {filter === 'unread'
                                        ? "You're all caught up! No unread notifications."
                                        : 'There are no notifications yet.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}