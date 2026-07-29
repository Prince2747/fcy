import { Head, Link, usePage } from '@inertiajs/react';
import {
    Users,
    UserPlus,
    CalendarDays,
    ArrowRight,
    Building2,
    FileText,
    CheckCircle,
    Clock,
    FileX,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import fcy from '@/routes/fcy';
import type { Customer, FcyRequest, FcyRequestStatus } from '@/types';
import { type BreadcrumbItem } from '@/types';

interface DashboardProps {
    stats: {
        total: number;
        active: number;
        newThisMonth: number;
    };
    requestStats: {
        total: number;
        pendingChecker: number;
        pendingApprover: number;
        approved: number;
        draft: number;
        rejectedByChecker: number;
        rejectedByApprover: number;
        myPending: number;
    };
    recentCustomers: Customer[];
    recentRequests: FcyRequest[];
    userRoles: string[];
}

const statusBadge: Record<FcyRequestStatus, { color: string; label: string }> =
    {
        draft: {
            color: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
            label: 'Draft',
        },
        pending_checker: {
            color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            label: 'Pending Checker',
        },
        pending_approver: {
            color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            label: 'Pending Approver',
        },
        approved: {
            color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            label: 'Approved',
        },
        rejected_by_checker: {
            color: 'bg-red-500/10 text-red-600 dark:text-red-400',
            label: 'Rejected',
        },
        rejected_by_approver: {
            color: 'bg-red-700/10 text-red-700 dark:text-red-500',
            label: 'Rejected Final',
        },
    };

export default function Dashboard({
    stats,
    requestStats,
    recentCustomers,
    recentRequests,
    userRoles,
}: DashboardProps) {
    const { auth } = usePage().props;
    const user = auth.user;

    const isMaker = userRoles.includes('fcymaker');

    const formattedDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'FCY Dashboard', href: '/fcy/dashboard' },
    ];

    return (
        <>
            <Head title="FCY Dashboard" />

            <div className="flex flex-col gap-8 px-8 pt-12 pb-8 md:px-12">
                {/* Dynamic Welcome Header Banner */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-8 md:p-10 dark:border-zinc-800/80 dark:bg-zinc-950/30">
                    <div className="animate-pulse-glow absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl transition-transform duration-700 group-hover:scale-110" />
                    <div
                        className="animate-pulse-glow absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-red-500/5 to-transparent blur-3xl transition-transform duration-700 group-hover:scale-110"
                        style={{ animationDelay: '1s' }}
                    />
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.04]"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                    />
                    <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] text-red-600 uppercase dark:text-red-400">
                                    Dashboard
                                </span>
                            </div>
                            <h1 className="animate-fade-in-up text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl lg:text-4xl dark:text-white">
                                <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-white">
                                    Welcome back, {user?.name || 'User'}
                                </span>
                            </h1>
                            <p
                                className="animate-fade-in-up max-w-2xl text-sm text-zinc-500 md:text-base dark:text-zinc-400"
                                style={{ animationDelay: '100ms' }}
                            >
                                Foreign Currency Operations Portal dashboard.
                                Monitor registrations and trade services.
                            </p>
                        </div>
                        <div
                            className="animate-fade-in-up mt-6 flex items-center gap-3 self-start md:mt-0 md:self-auto"
                            style={{ animationDelay: '200ms' }}
                        >
                            <div className="dark:text-zinc-350 flex items-center gap-2 rounded-full border border-zinc-200/50 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm transition-all duration-300 hover:border-red-500/30 hover:shadow-md hover:shadow-red-500/5 dark:border-zinc-800 dark:bg-zinc-900/80">
                                <CalendarDays className="h-3.5 w-3.5 text-red-500" />
                                {formattedDate}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Customer Stats */}
                <div className="grid gap-5 md:grid-cols-3">
                    <Card className="group relative overflow-hidden border border-zinc-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/40 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-red-500/40">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pt-3.5 pb-1">
                            <CardTitle className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                Total Importers
                            </CardTitle>
                            <div className="rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-600 transition-transform duration-200 group-hover:scale-110 dark:border-red-900/30 dark:bg-red-950/50 dark:text-red-400">
                                <Users className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pt-1 pb-3.5">
                            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                {stats.total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="group relative overflow-hidden border border-zinc-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/40 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-red-500/40">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pt-3.5 pb-1">
                            <CardTitle className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                Total Requests
                            </CardTitle>
                            <div className="rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-600 transition-transform duration-200 group-hover:scale-110 dark:border-red-900/30 dark:bg-red-950/50 dark:text-red-400">
                                <FileText className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pt-1 pb-3.5">
                            <div className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
                                {requestStats.total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="group relative overflow-hidden border border-zinc-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/40 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-red-500/40">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pt-3.5 pb-1">
                            <CardTitle className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                                New This Month
                            </CardTitle>
                            <div className="rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-600 transition-transform duration-200 group-hover:scale-110 dark:border-red-900/30 dark:bg-red-950/50 dark:text-red-400">
                                <CalendarDays className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pt-1 pb-3.5">
                            <div className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
                                {stats.newThisMonth}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Recent Registrations Card */}
                    <Card className="overflow-hidden border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl md:col-span-2 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-red-500/40">
                        <CardHeader className="dark:border-zinc-850 flex flex-row items-center justify-between border-b border-zinc-100 pb-4">
                            <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white">
                                Recent Registrations
                            </CardTitle>
                            <Link
                                href={fcy.customers.index()}
                                className="flex items-center gap-1 text-xs font-semibold text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recentCustomers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table className="w-full">
                                        <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40">
                                            <TableRow className="border-zinc-150 dark:border-zinc-850 border-b">
                                                <TableHead className="dark:text-zinc-350 px-4 py-3 font-semibold text-zinc-700">
                                                    Importer Name
                                                </TableHead>
                                                <TableHead className="dark:text-zinc-350 px-4 py-3 font-semibold text-zinc-700">
                                                    Branch
                                                </TableHead>
                                                <TableHead className="dark:text-zinc-350 px-4 py-3 font-semibold text-zinc-700">
                                                    Status
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentCustomers.map((customer) => (
                                                <TableRow
                                                    key={customer.id}
                                                    className="border-zinc-150 dark:border-zinc-850 border-b transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                                                >
                                                    <TableCell className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {customer.importer_name}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3.5">
                                                        {customer.branch}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3.5">
                                                        <Badge
                                                            className={
                                                                customer.status ===
                                                                'active'
                                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                                    : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                                                            }
                                                        >
                                                            {customer.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                    <p className="dark:text-zinc-350 mb-1 text-sm font-semibold text-zinc-700">
                                        No customers registered yet
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card className="overflow-hidden border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-red-500/40">
                        <CardHeader className="dark:border-zinc-850 border-b border-zinc-100 pb-4">
                            <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white">
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3.5 pt-4">
                            <Link
                                href={fcy.customers.index({
                                    query: { action: 'create' },
                                })}
                                className="group"
                            >
                                <div className="flex items-start gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/[0.03] dark:border-zinc-800 dark:bg-zinc-900/20 dark:hover:border-red-500/30 dark:hover:bg-red-500/[0.05]">
                                    <div className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-red-600 transition-transform duration-300 group-hover:scale-105 dark:border-red-900/20 dark:bg-red-950/50 dark:text-red-400">
                                        <UserPlus className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1 text-left">
                                        <h4 className="flex items-center gap-1 text-sm font-semibold text-zinc-900 dark:text-white">
                                            Register Customer
                                            <ArrowRight className="h-3 w-3 text-red-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 dark:text-red-400" />
                                        </h4>
                                        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                            Register a new importer for FX
                                            operations.
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            <Link href={fcy.requests.index()} className="group">
                                <div className="flex items-start gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/[0.03] dark:border-zinc-800 dark:bg-zinc-900/20 dark:hover:border-red-500/30 dark:hover:bg-red-500/[0.05]">
                                    <div className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-red-600 transition-transform duration-300 group-hover:scale-105 dark:border-red-900/20 dark:bg-red-950/50 dark:text-red-400">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1 text-left">
                                        <h4 className="flex items-center gap-1 text-sm font-semibold text-zinc-900 dark:text-white">
                                            View FCY Requests
                                            <ArrowRight className="h-3 w-3 text-red-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 dark:text-red-400" />
                                        </h4>
                                        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                            Manage and review FCY requests.
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            {isMaker && (
                                <Link
                                    href={fcy.requests.create()}
                                    className="group"
                                >
                                    <div className="flex items-start gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/[0.03] dark:border-zinc-800 dark:bg-zinc-900/20 dark:hover:border-red-500/30 dark:hover:bg-red-500/[0.05]">
                                        <div className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-red-600 transition-transform duration-300 group-hover:scale-105 dark:border-red-900/20 dark:bg-red-950/50 dark:text-red-400">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1 text-left">
                                            <h4 className="flex items-center gap-1 text-sm font-semibold text-zinc-900 dark:text-white">
                                                New FCY Request
                                                <ArrowRight className="h-3 w-3 text-red-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 dark:text-red-400" />
                                            </h4>
                                            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                                Create a new FCY request.
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent FCY Requests */}
                {recentRequests.length > 0 && (
                    <Card className="overflow-hidden border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/50">
                        <CardHeader className="dark:border-zinc-850 flex flex-row items-center justify-between border-b border-zinc-100 pb-4">
                            <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white">
                                Recent FCY Requests
                            </CardTitle>
                            <Link
                                href={fcy.requests.index()}
                                className="flex items-center gap-1 text-xs font-semibold text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table className="w-full">
                                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40">
                                        <TableRow className="border-zinc-150 dark:border-zinc-850 border-b">
                                            <TableHead className="dark:text-zinc-350 px-4 py-3 font-semibold text-zinc-700">
                                                Request #
                                            </TableHead>
                                            <TableHead className="dark:text-zinc-350 px-4 py-3 font-semibold text-zinc-700">
                                                Customer
                                            </TableHead>
                                            <TableHead className="dark:text-zinc-350 px-4 py-3 font-semibold text-zinc-700">
                                                Currency
                                            </TableHead>
                                            <TableHead className="dark:text-zinc-350 px-4 py-3 font-semibold text-zinc-700">
                                                Amount
                                            </TableHead>
                                            <TableHead className="dark:text-zinc-350 px-4 py-3 font-semibold text-zinc-700">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentRequests.map((req) => {
                                            const badge = statusBadge[
                                                req.status
                                            ] ?? {
                                                color: '',
                                                label: req.status,
                                            };
                                            return (
                                                <TableRow
                                                    key={req.id}
                                                    className="border-zinc-150 dark:border-zinc-850 border-b transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                                                >
                                                    <TableCell className="px-4 py-3.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                                        <Link
                                                            href={fcy.requests.show(
                                                                {
                                                                    request:
                                                                        req.id,
                                                                },
                                                            )}
                                                            className="transition-colors hover:text-red-600 dark:hover:text-red-400"
                                                        >
                                                            {req.request_number}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3.5 text-sm">
                                                        {req.customer
                                                            ?.importer_name ??
                                                            'N/A'}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3.5 text-sm">
                                                        {req.currency?.code ??
                                                            'N/A'}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3.5 text-sm">
                                                        {Number(
                                                            req.fcy_amount_requested,
                                                        ).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3.5">
                                                        <Badge
                                                            className={`${badge.color} text-xs`}
                                                        >
                                                            {badge.label}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
