import { Head, Link, router } from '@inertiajs/react';
import { FileText, Plus, Search, Eye, ArrowRight, FileCheck, FileX, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { FcyRequest, FcyRequestStatus } from '@/types';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import fcy from '@/routes/fcy';

interface IndexProps {
    requests: {
        data: FcyRequest[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            links: { url: string | null; label: string; active: boolean }[];
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

const statusConfig: Record<FcyRequestStatus, { label: string; icon: React.ElementType; color: string }> = {
    draft: { label: 'Draft', icon: FileText, color: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20' },
    pending_checker: { label: 'Pending Checker', icon: Clock, color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' },
    pending_approver: { label: 'Pending Approver', icon: Clock, color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
    approved: { label: 'Approved', icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
    rejected_by_checker: { label: 'Rejected by Checker', icon: FileX, color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' },
    rejected_by_approver: { label: 'Rejected by Approver', icon: XCircle, color: 'bg-red-700/10 text-red-800 dark:text-red-500 border-red-700/20' },
};

export default function Index({ requests, requestStats, userRoles }: IndexProps) {
    const [search, setSearch] = useState('');
    const isMaker = userRoles.includes('fcymaker');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'FCY Requests', href: '/fcy/requests' },
    ];

    return (
        <>
            <Head title="FCY Requests" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Foreign Currency Requests
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            {isMaker ? 'Create and manage FCY requests.' : 'Review and manage FCY requests.'}
                        </p>
                    </div>
                    <Link href={fcy.requests.create()}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Request
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-3.5">
                            <CardTitle className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Requests</CardTitle>
                            <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                                <FileText className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-3.5 pt-1">
                            <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{requestStats.total}</div>
                        </CardContent>
                    </Card>
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-3.5">
                            <CardTitle className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Pending Checker</CardTitle>
                            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                                <Clock className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-3.5 pt-1">
                            <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{requestStats.pendingChecker}</div>
                        </CardContent>
                    </Card>
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-3.5">
                            <CardTitle className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Pending Approver</CardTitle>
                            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                                <Clock className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-3.5 pt-1">
                            <div className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{requestStats.pendingApprover}</div>
                        </CardContent>
                    </Card>
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-3.5">
                            <CardTitle className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Approved</CardTitle>
                            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                <CheckCircle className="h-3.5 w-3.5" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-3.5 pt-1">
                            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{requestStats.approved}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Requests Table */}
                <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                    <CardContent className="p-0">
                        {requests.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table className="w-full">
                                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40">
                                        <TableRow className="border-b border-zinc-150 dark:border-zinc-850">
                                            <TableHead className="py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-350">Request #</TableHead>
                                            <TableHead className="py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-350">Customer</TableHead>
                                            <TableHead className="py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-350">Currency</TableHead>
                                            <TableHead className="py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-350">Amount</TableHead>
                                            <TableHead className="py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-350">Status</TableHead>
                                            <TableHead className="py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-350">Date</TableHead>
                                            <TableHead className="py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-350 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {requests.data.map((req) => {
                                            const StatusIcon = statusConfig[req.status].icon;
                                            return (
                                                <TableRow key={req.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors border-b border-zinc-150 dark:border-zinc-850">
                                                    <TableCell className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 py-3.5 px-4">
                                                        {req.request_number}
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-4 text-sm text-zinc-700 dark:text-zinc-300">
                                                        {req.customer?.importer_name ?? 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-4 text-sm text-zinc-700 dark:text-zinc-300">
                                                        {req.currency?.code ?? 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-4 text-sm text-zinc-700 dark:text-zinc-300">
                                                        {Number(req.fcy_amount_requested).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-4">
                                                        <Badge className={`inline-flex items-center gap-1.5 font-medium px-2.5 py-1 ${statusConfig[req.status].color}`}>
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusConfig[req.status].label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-4 text-xs text-zinc-500 dark:text-zinc-400">
                                                        {new Date(req.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-4 text-right">
                                                        <Link href={fcy.requests.show({ request: req.id })}>
                                                            <Button variant="ghost" size="sm" className="gap-1.5">
                                                                <Eye className="h-3.5 w-3.5" />
                                                                View
                                                                <ArrowRight className="h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 mb-4">
                                    <FileText className="h-8 w-8 text-zinc-400" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-350 mb-1">No FCY requests found</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-450 max-w-sm">
                                    {isMaker ? 'Create a new foreign currency request to get started.' : 'There are no requests pending your review.'}
                                </p>
                                <Link href={fcy.requests.create()} className="mt-4">
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create Request
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
