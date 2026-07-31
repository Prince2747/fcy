
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    FileText,
    Plus,
    Eye,
    ArrowRight,
    FileX,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Ban,
    SlidersHorizontal,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };

    requestStats: {
        total: number;
        pendingChecker: number;
        pendingApprover: number;
        approved: number;
    };

    userRoles: string[];

    filters: {
        search?: string;
        status?: string;
    };
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
        color: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20',
    },

    pending_checker: {
        label: 'Pending Checker',
        icon: Clock,
        color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    },

    pending_approver: {
        label: 'Pending Approver',
        icon: Clock,
        color: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    },

    approved: {
        label: 'Approved',
        icon: CheckCircle,
        color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    },

    rejected_by_checker: {
        label: 'Rejected by Checker',
        icon: FileX,
        color: 'bg-red-500/10 text-red-700 border-red-500/20',
    },

    rejected_by_approver: {
        label: 'Rejected by Approver',
        icon: XCircle,
        color: 'bg-red-700/10 text-red-800 border-red-700/20',
    },
};

const statusOptions: { value: string; label: string }[] = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending_checker', label: 'Pending Checker' },
    { value: 'pending_approver', label: 'Pending Approver' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected_by_checker', label: 'Rejected by Checker' },
    { value: 'rejected_by_approver', label: 'Rejected by Approver' },
];

export default function Index({
    requests,
    requestStats,
    userRoles,
    filters,
}: IndexProps) {
    const isMaker = userRoles.includes('fcymaker');

    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    function handleSearch(value: string) {
        setSearch(value);

        router.get(
            fcy.requests.index().url,
            {
                search: value,
                status: statusFilter,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function handleStatusFilter(value: string) {
        const actualValue = value === ' ' ? '' : value;

        setStatusFilter(actualValue);

        router.get(
            fcy.requests.index().url,
            {
                search,
                status: actualValue,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function clearFilters() {
        setSearch('');
        setStatusFilter('');

        router.get(
            fcy.requests.index().url,
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    const hasActiveFilters = search || statusFilter;

    return (
        <>
            <Head title="FCY Requests" />

            <div className="flex flex-col gap-4 px-5 pb-6 md:px-8">

                {/* Header */}
                <div className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-4">
                    <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl transition-transform duration-700 group-hover:scale-110" />

                    <div className="absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-tr from-red-500/5 to-transparent blur-3xl" />

                    <div className="relative flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />

                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                    FCY Operations
                                </span>
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl">
                                Foreign Currency Requests
                            </h1>

                            <p className="text-xs text-zinc-500">
                                {isMaker
                                    ? 'Create and manage FCY requests.'
                                    : 'Review and manage FCY requests.'}
                            </p>
                        </div>

                        <Link href={fcy.requests.create()}>
                            <Button className="h-9 shrink-0 cursor-pointer gap-2 bg-gradient-to-r from-red-600 to-red-700 px-3 text-sm font-semibold text-white shadow-sm hover:from-red-700 hover:to-red-800">
                                <Plus className="h-4 w-4" />
                                New Request
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid gap-3 md:grid-cols-4">

                    <Card className="border border-zinc-200/80 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between px-3 pb-0.5 pt-2.5">
                            <CardTitle className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                                Total Requests
                            </CardTitle>

                            <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-1 text-zinc-600">
                                <FileText className="h-3 w-3" />
                            </div>
                        </CardHeader>

                        <CardContent className="px-3 pb-2.5 pt-0.5">
                            <div className="text-xl font-bold tracking-tight text-zinc-900">
                                {requestStats.total}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-zinc-200/80 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between px-3 pb-0.5 pt-2.5">
                            <CardTitle className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                                Pending Checker
                            </CardTitle>

                            <div className="rounded-lg border border-amber-100 bg-amber-50 p-1 text-amber-600">
                                <Clock className="h-3 w-3" />
                            </div>
                        </CardHeader>

                        <CardContent className="px-3 pb-2.5 pt-0.5">
                            <div className="text-xl font-bold tracking-tight text-amber-600">
                                {requestStats.pendingChecker}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-zinc-200/80 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between px-3 pb-0.5 pt-2.5">
                            <CardTitle className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                                Pending Approver
                            </CardTitle>

                            <div className="rounded-lg border border-blue-100 bg-blue-50 p-1 text-blue-600">
                                <Clock className="h-3 w-3" />
                            </div>
                        </CardHeader>

                        <CardContent className="px-3 pb-2.5 pt-0.5">
                            <div className="text-xl font-bold tracking-tight text-blue-600">
                                {requestStats.pendingApprover}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-zinc-200/80 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between px-3 pb-0.5 pt-2.5">
                            <CardTitle className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                                Approved
                            </CardTitle>

                            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-1 text-emerald-600">
                                <CheckCircle className="h-3 w-3" />
                            </div>
                        </CardHeader>

                        <CardContent className="px-3 pb-2.5 pt-0.5">
                            <div className="text-xl font-bold tracking-tight text-emerald-600">
                                {requestStats.approved}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border border-zinc-200/80 bg-white shadow-sm">
                    <CardContent className="p-3">
                        <div className="flex flex-col gap-2.5 md:flex-row">

                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />

                                <Input
                                    placeholder="Search by request #, customer, or amount..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);

                                        if (!e.target.value) {
                                            handleSearch('');
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch(search);
                                        }
                                    }}
                                    className="h-8 border-zinc-200 bg-white pl-9 text-xs focus-visible:border-red-500/50 focus-visible:ring-2 focus-visible:ring-red-500/20"
                                />
                            </div>

                            <div className="w-full md:w-48">
                                <Select
                                    value={statusFilter || ' '}
                                    onValueChange={handleStatusFilter}
                                >
                                    <SelectTrigger className="h-8 border-zinc-200 bg-white text-xs focus:ring-2 focus:ring-red-500/20">
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-zinc-400" />

                                            <SelectValue placeholder="All Statuses" />
                                        </div>
                                    </SelectTrigger>

                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value || ' '}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="h-8 shrink-0 cursor-pointer gap-1.5 border-zinc-200 px-3 text-xs hover:bg-zinc-50"
                                >
                                    <Ban className="h-3.5 w-3.5" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Requests Table */}
                <Card className="overflow-hidden border border-zinc-200/80 bg-white shadow-sm">
                    <CardContent className="p-0">

                        <div className="overflow-x-auto">
                            <Table className="w-full">

                                <TableHeader className="bg-zinc-50/70">
                                    <TableRow className="border-b border-zinc-200">

                                        {/* Number Column */}
                                        <TableHead className="w-10 px-2 py-2.5 text-center text-[10px] font-semibold text-zinc-500">
                                            #
                                        </TableHead>

                                        <TableHead className="px-3 py-2.5 text-xs font-semibold">
                                            Request #
                                        </TableHead>

                                        <TableHead className="px-3 py-2.5 text-xs font-semibold">
                                            Customer
                                        </TableHead>

                                        <TableHead className="px-3 py-2.5 text-xs font-semibold">
                                            Currency
                                        </TableHead>

                                        <TableHead className="px-3 py-2.5 text-xs font-semibold">
                                            Amount
                                        </TableHead>

                                        <TableHead className="px-3 py-2.5 text-xs font-semibold">
                                            Status
                                        </TableHead>

                                        <TableHead className="px-3 py-2.5 text-xs font-semibold">
                                            Date
                                        </TableHead>

                                        <TableHead className="px-3 py-2.5 text-right text-xs font-semibold">
                                            Actions
                                        </TableHead>

                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {requests.data.length > 0 ? (
                                        requests.data.map((req, index) => {

                                            const StatusIcon =
                                                statusConfig[req.status].icon;

                                            // Pagination-aware row number
                                            const rowNumber =
                                                (requests.current_page - 1) *
                                                    requests.per_page +
                                                index +
                                                1;

                                            return (
                                                <TableRow
                                                    key={req.id}
                                                    className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/60"
                                                >

                                                    {/* Row Number */}
                                                    <TableCell className="w-10 px-2 py-2 text-center">
                                                        <span className="text-[11px] font-medium text-zinc-400">
                                                            {rowNumber}
                                                        </span>
                                                    </TableCell>

                                                    {/* Request Number */}
                                                    <TableCell className="px-3 py-2 font-mono text-[11px] font-semibold text-zinc-800">
                                                        {req.request_number}
                                                    </TableCell>

                                                    {/* Customer */}
                                                    <TableCell className="px-3 py-2 text-sm font-semibold text-zinc-900">
                                                        {req.customer?.importer_name ??
                                                            'N/A'}
                                                    </TableCell>

                                                    {/* Currency */}
                                                    <TableCell className="px-3 py-2 text-xs font-medium text-zinc-600">
                                                        {req.currency?.code ??
                                                            'N/A'}
                                                    </TableCell>

                                                    {/* Amount */}
                                                    <TableCell className="px-3 py-2 font-mono text-xs font-medium text-zinc-700">
                                                        {Number(
                                                            req.fcy_amount_requested,
                                                        ).toLocaleString()}
                                                    </TableCell>

                                                    {/* Status */}
                                                    <TableCell className="px-3 py-2">
                                                        <Badge
                                                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium ${
                                                                statusConfig[
                                                                    req.status
                                                                ].color
                                                            }`}
                                                        >
                                                            <StatusIcon className="h-2.5 w-2.5" />

                                                            {
                                                                statusConfig[
                                                                    req.status
                                                                ].label
                                                            }
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Date */}
                                                    <TableCell className="whitespace-nowrap px-3 py-2 text-[11px] text-zinc-500">
                                                        {new Date(
                                                            req.created_at,
                                                        ).toLocaleDateString()}
                                                    </TableCell>

                                                    {/* Actions */}
                                                    <TableCell className="px-3 py-2 text-right">
                                                        <Link
                                                            href={fcy.requests.show(
                                                                {
                                                                    fcyRequest:
                                                                        req.id,
                                                                },
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 gap-1 px-2 text-[11px] hover:bg-blue-500/10 hover:text-blue-600"
                                                            >
                                                                <Eye className="h-3 w-3" />

                                                                View

                                                                <ArrowRight className="h-2.5 w-2.5" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="h-52"
                                            >
                                                <div className="flex flex-col items-center justify-center text-center">

                                                    <div className="mb-3 rounded-full border border-zinc-100 bg-zinc-50 p-3">
                                                        <FileText className="h-6 w-6 text-zinc-400" />
                                                    </div>

                                                    <p className="mb-1 text-sm font-semibold text-zinc-700">
                                                        No FCY requests found
                                                    </p>

                                                    <p className="max-w-sm text-xs text-zinc-500">
                                                        {hasActiveFilters
                                                            ? 'No requests match your search. Try adjusting your filters.'
                                                            : isMaker
                                                              ? 'Create a new foreign currency request to get started.'
                                                              : 'There are no requests pending your review.'}
                                                    </p>

                                                    {!hasActiveFilters &&
                                                        isMaker && (
                                                            <Link
                                                                href={fcy.requests.create()}
                                                                className="mt-3"
                                                            >
                                                                <Button className="h-8 gap-2 bg-gradient-to-r from-red-600 to-red-700 px-3 text-xs font-semibold text-white shadow-sm hover:from-red-700 hover:to-red-800">
                                                                    <Plus className="h-3.5 w-3.5" />
                                                                    Create Request
                                                                </Button>
                                                            </Link>
                                                        )}

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>

                            </Table>
                        </div>

                        {/* Pagination */}
                        {requests.data.length > 0 && (
                            <div className="flex flex-col items-center justify-between gap-2 border-t border-zinc-100 bg-zinc-50/20 p-3 sm:flex-row">

                                <div className="text-[11px] font-medium text-zinc-500">
                                    Showing {requests.from} to {requests.to} of{' '}
                                    {requests.total} requests
                                </div>

                                <div className="flex items-center gap-1">
                                    {requests.links.map((link, i) => {

                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 text-[11px] text-zinc-400"
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
                                                className="h-7 min-w-7 border-zinc-200 px-1.5 text-[11px]"
                                                onClick={() =>
                                                    router.get(
                                                        link.url!,
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            replace: true,
                                                        },
                                                    )
                                                }
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        );
                                    })}
                                </div>

                            </div>
                        )}

                    </CardContent>
                </Card>

            </div>
        </>
    );
}

