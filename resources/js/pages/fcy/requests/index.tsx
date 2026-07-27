import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    Plus,
    Eye,
    ArrowRight,
    FileX,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { FcyRequest, FcyRequestStatus } from '@/types';
import fcy from '@/routes/fcy';

interface IndexProps {
    requests: {
        data: FcyRequest[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            links: {
                url: string | null;
                label: string;
                active: boolean;
            }[];
        };
    };

    requestStats: {
        total: number;
        pendingChecker: number;
        pendingApprover: number;
        approved: number;
    };

    userRoles: string[];
}

const statusConfig: Record<
    FcyRequestStatus,
    {
        label: string;
        icon: React.ElementType;
        color: string;
    }
> = {
    draft: {
        label: 'Draft',
        icon: FileText,
        color:
            'bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20',
    },

    pending_checker: {
        label: 'Pending Checker',
        icon: Clock,
        color:
            'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    },

    pending_approver: {
        label: 'Pending Approver',
        icon: Clock,
        color:
            'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    },

    approved: {
        label: 'Approved',
        icon: CheckCircle,
        color:
            'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    },

    rejected_by_checker: {
        label: 'Rejected by Checker',
        icon: FileX,
        color:
            'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    },

    rejected_by_approver: {
        label: 'Rejected by Approver',
        icon: XCircle,
        color:
            'bg-red-700/10 text-red-800 dark:text-red-500 border-red-700/20',
    },
};

export default function Index({
    requests,
    requestStats,
    userRoles,
}: IndexProps) {
    const isMaker = userRoles.includes('fcymaker');

    return (
        <>
            <Head title="FCY Requests" />

            <div className="flex flex-col gap-6 pb-8 px-8 md:px-12">

                {/* =======================================================
                    HERO HEADER CARD
                ======================================================== */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-950/30 md:p-8">

                    {/* Background Gradients & Glow Effects */}
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl transition-transform duration-700 group-hover:scale-110" />

                    <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-red-500/5 to-transparent blur-3xl" />

                    {/* Header Details & Action Button */}
                    <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                                    FCY Operations
                                </span>
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
                                Foreign Currency Requests
                            </h1>

                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {isMaker
                                    ? 'Create and manage FCY requests.'
                                    : 'Review and manage FCY requests.'}
                            </p>
                        </div>

                        <Link href={fcy.requests.create()}>
                            <Button className="shrink-0 cursor-pointer gap-2 bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white shadow-sm hover:from-red-700 hover:to-red-800 hover:shadow">
                                <Plus className="h-4 w-4" />
                                New Request
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* =======================================================
                    STATISTICS CARDS
                ======================================================== */}
                <div className="grid gap-4 md:grid-cols-4">

                    {/* Total Requests */}
                    <Card className="border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/50 shadow-sm transition-all duration-300 hover:border-red-500/40 hover:-translate-y-0.5">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pb-1 pt-3.5">
                            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Total Requests
                            </CardTitle>

                            <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-1.5 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                                <FileText className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>

                        <CardContent className="px-4 pb-3.5 pt-1">
                            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                {requestStats.total}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Checker */}
                    <Card className="border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/50 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-0.5">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pb-1 pt-3.5">
                            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Pending Checker
                            </CardTitle>

                            <div className="rounded-lg border border-amber-100 bg-amber-50 p-1.5 text-amber-600 dark:border-amber-900/30 dark:bg-amber-950/50 dark:text-amber-400">
                                <Clock className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>

                        <CardContent className="px-4 pb-3.5 pt-1">
                            <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                {requestStats.pendingChecker}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Approver */}
                    <Card className="border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/50 shadow-sm transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-0.5">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pb-1 pt-3.5">
                            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Pending Approver
                            </CardTitle>

                            <div className="rounded-lg border border-blue-100 bg-blue-50 p-1.5 text-blue-600 dark:border-blue-900/30 dark:bg-blue-950/50 dark:text-blue-400">
                                <Clock className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>

                        <CardContent className="px-4 pb-3.5 pt-1">
                            <div className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                                {requestStats.pendingApprover}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Approved */}
                    <Card className="border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/50 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-0.5">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pb-1 pt-3.5">
                            <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Approved
                            </CardTitle>

                            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-1.5 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <CheckCircle className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>

                        <CardContent className="px-4 pb-3.5 pt-1">
                            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {requestStats.approved}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* =======================================================
                    REQUESTS TABLE
                ======================================================== */}
                <Card className="overflow-hidden border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40">
                                    <TableRow className="border-b border-zinc-150 dark:border-zinc-850">
                                        <TableHead className="px-6 py-3 font-semibold">
                                            Request #
                                        </TableHead>

                                        <TableHead className="px-6 py-3 font-semibold">
                                            Customer
                                        </TableHead>

                                        <TableHead className="px-6 py-3 font-semibold">
                                            Currency
                                        </TableHead>

                                        <TableHead className="px-6 py-3 font-semibold">
                                            Amount
                                        </TableHead>

                                        <TableHead className="px-6 py-3 font-semibold">
                                            Status
                                        </TableHead>

                                        <TableHead className="px-6 py-3 font-semibold">
                                            Date
                                        </TableHead>

                                        <TableHead className="px-6 py-3 text-right font-semibold">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {requests.data.length > 0 ? (
                                        requests.data.map((req) => {
                                            const StatusIcon =
                                                statusConfig[req.status].icon;

                                            return (
                                                <TableRow
                                                    key={req.id}
                                                    className="border-b border-zinc-150 transition-colors hover:bg-zinc-50/50 dark:border-zinc-850 dark:hover:bg-zinc-900/30"
                                                >
                                                    <TableCell className="px-6 py-3.5 font-mono text-xs font-semibold">
                                                        {req.request_number}
                                                    </TableCell>

                                                    <TableCell className="px-6 py-3.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {req.customer
                                                            ?.importer_name ??
                                                            'N/A'}
                                                    </TableCell>

                                                    <TableCell className="px-6 py-3.5 text-sm">
                                                        {req.currency?.code ??
                                                            'N/A'}
                                                    </TableCell>

                                                    <TableCell className="px-6 py-3.5 text-sm font-mono">
                                                        {Number(
                                                            req.fcy_amount_requested,
                                                        ).toLocaleString()}
                                                    </TableCell>

                                                    <TableCell className="px-6 py-3.5">
                                                        <Badge
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-medium ${
                                                                statusConfig[
                                                                    req.status
                                                                ].color
                                                            }`}
                                                        >
                                                            <StatusIcon className="h-3 w-3" />

                                                            {
                                                                statusConfig[
                                                                    req.status
                                                                ].label
                                                            }
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell className="whitespace-nowrap px-6 py-3.5 text-xs text-zinc-500 dark:text-zinc-400">
                                                        {new Date(
                                                            req.created_at,
                                                        ).toLocaleDateString()}
                                                    </TableCell>

                                                    <TableCell className="px-6 py-3.5 text-right">
                                                        <Link
                                                            href={fcy.requests.show(
                                                                {
                                                                    request:
                                                                        req.id,
                                                                },
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="gap-1.5 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-400"
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                                View
                                                                <ArrowRight className="h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-80"
                                            >
                                                <div className="flex flex-col items-center justify-center text-center">
                                                    <div className="mb-4 rounded-full border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-850 dark:bg-zinc-900">
                                                        <FileText className="h-8 w-8 text-zinc-400" />
                                                    </div>

                                                    <p className="mb-1 text-sm font-semibold text-zinc-700 dark:text-zinc-350">
                                                        No FCY requests found
                                                    </p>

                                                    <p className="max-w-sm text-xs text-zinc-500 dark:text-zinc-450">
                                                        {isMaker
                                                            ? 'Create a new foreign currency request to get started.'
                                                            : 'There are no requests pending your review.'}
                                                    </p>

                                                    <Link
                                                        href={fcy.requests.create()}
                                                        className="mt-4"
                                                    >
                                                        <Button className="gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-sm">
                                                            <Plus className="h-4 w-4" />
                                                            Create Request
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}