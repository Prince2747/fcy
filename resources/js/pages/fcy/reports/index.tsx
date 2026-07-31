import { Head, router, setLayoutProps } from '@inertiajs/react';
import {
    FileText,
    Download,
    FileSpreadsheet,
    Filter,
    Ban,
    Calendar,
    Building2,
    DollarSign,
    CreditCard,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import fcy from '@/routes/fcy';
import type { Currency, Customer, FcyRequest, FcyRequestStatus, PaymentMethod } from '@/types';
import { type BreadcrumbItem } from '@/types';

interface ReportsIndexProps {
    requests: {
        data: FcyRequest[];
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
    customers: Pick<Customer, 'id' | 'importer_name'>[];
    currencies: Pick<Currency, 'id' | 'code' | 'name'>[];
    paymentMethods: Pick<PaymentMethod, 'id' | 'name' | 'code'>[];
    filters: {
        status?: string;
        customer_id?: string;
        currency_id?: string;
        payment_method_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

const statusOptions: { value: string; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending_checker', label: 'Pending Checker' },
    { value: 'pending_approver', label: 'Pending Approver' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected_by_checker', label: 'Rejected by Checker' },
    { value: 'rejected_by_approver', label: 'Rejected by Approver' },
];

const statusBadgeColors: Record<string, string> = {
    draft: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-400',
    pending_checker: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    pending_approver: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    approved: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    rejected_by_checker: 'bg-red-500/10 text-red-700 dark:text-red-400',
    rejected_by_approver: 'bg-red-700/10 text-red-800 dark:text-red-500',
};

export default function ReportsIndex({
    requests,
    customers,
    currencies,
    paymentMethods,
    filters,
}: ReportsIndexProps) {
    const [status, setStatus] = useState(filters.status || '');
    const [customerId, setCustomerId] = useState(filters.customer_id || '');
    const [currencyId, setCurrencyId] = useState(filters.currency_id || '');
    const [paymentMethodId, setPaymentMethodId] = useState(filters.payment_method_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reports', href: '/fcy/reports' },
    ];

    setLayoutProps({ breadcrumbs });

    function applyFilters() {
        router.get(
            fcy.reports.index().url,
            {
                status: status || undefined,
                customer_id: customerId || undefined,
                currency_id: currencyId || undefined,
                payment_method_id: paymentMethodId || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            },
            { preserveState: true, replace: true },
        );
    }

    function clearFilters() {
        setStatus('');
        setCustomerId('');
        setCurrencyId('');
        setPaymentMethodId('');
        setDateFrom('');
        setDateTo('');
        router.get(fcy.reports.index().url, {}, { preserveState: true, replace: true });
    }

    function buildExportUrl(format: 'csv' | 'excel'): string {
        const params = new URLSearchParams();
        params.set('format', format);
        if (status) params.set('status', status);
        if (customerId) params.set('customer_id', customerId);
        if (currencyId) params.set('currency_id', currencyId);
        if (paymentMethodId) params.set('payment_method_id', paymentMethodId);
        if (dateFrom) params.set('date_from', dateFrom);
        if (dateTo) params.set('date_to', dateTo);

        return `${fcy.reports.export().url}?${params.toString()}`;
    }

    function handleExport(format: 'csv' | 'excel') {
        window.location.href = buildExportUrl(format);
    }

    const hasActiveFilters = status || customerId || currencyId || paymentMethodId || dateFrom || dateTo;

    return (
        <>
            <Head title="Reports" />

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
                                    Reports & Exports
                                </span>
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
                                FCY Request Reports
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Filter and export foreign currency requests as CSV or Excel files.
                            </p>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => handleExport('csv')}
                                className="gap-2 bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white shadow-sm hover:from-red-700 hover:to-red-800 hover:shadow"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                            <Button
                                onClick={() => handleExport('excel')}
                                variant="outline"
                                className="gap-2 border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                Export Excel
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 shadow-sm">
                    <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-850 px-6">
                        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Filter className="h-4 w-4 text-zinc-450" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {/* Status Filter */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-350">Status</Label>
                                <Select value={status || ' '} onValueChange={(v) => setStatus(v === ' ' ? '' : v)}>
                                    <SelectTrigger className="h-10 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">All Statuses</SelectItem>
                                        {statusOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Customer Filter */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-350">Customer</Label>
                                <Select value={customerId || ' '} onValueChange={(v) => setCustomerId(v === ' ' ? '' : v)}>
                                    <SelectTrigger className="h-10 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                            <SelectValue placeholder="All Customers" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">All Customers</SelectItem>
                                        {customers.map((customer) => (
                                            <SelectItem key={customer.id} value={customer.id.toString()}>
                                                {customer.importer_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Currency Filter */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-350">Currency</Label>
                                <Select value={currencyId || ' '} onValueChange={(v) => setCurrencyId(v === ' ' ? '' : v)}>
                                    <SelectTrigger className="h-10 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                            <SelectValue placeholder="All Currencies" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">All Currencies</SelectItem>
                                        {currencies.map((currency) => (
                                            <SelectItem key={currency.id} value={currency.id.toString()}>
                                                {currency.code} - {currency.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Payment Method Filter */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-350">Payment Method</Label>
                                <Select value={paymentMethodId || ' '} onValueChange={(v) => setPaymentMethodId(v === ' ' ? '' : v)}>
                                    <SelectTrigger className="h-10 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                            <SelectValue placeholder="All Methods" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">All Methods</SelectItem>
                                        {paymentMethods.map((method) => (
                                            <SelectItem key={method.id} value={method.id.toString()}>
                                                {method.code ?? method.name} - {method.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date From */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-350">Date From</Label>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="h-10 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                                />
                            </div>

                            {/* Date To */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-350">Date To</Label>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="h-10 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-end gap-2">
                                <Button onClick={applyFilters} className="h-10 gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold">
                                    <Filter className="h-4 w-4" />
                                    Apply
                                </Button>
                                {hasActiveFilters && (
                                    <Button variant="outline" onClick={clearFilters} className="h-10 gap-2 border-zinc-250 dark:border-zinc-800">
                                        <Ban className="h-4 w-4" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Table */}
                <Card className="overflow-hidden border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
                    <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-850 px-6">
                        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <FileText className="h-4 w-4 text-zinc-450" />
                            Results
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-805 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                                {requests.total}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {requests.data.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <Table className="w-full">
                                       <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40">
    <TableRow className="border-b border-zinc-150 dark:border-zinc-850">
        <TableHead className="w-16 px-4 py-3 text-center font-semibold">
            #
        </TableHead>
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
    </TableRow>
</TableHeader>

<TableBody>
    {requests.data.map((req, index) => (
        <TableRow
            key={req.id}
            className="border-b border-zinc-150 dark:border-zinc-850 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
        >
            {/* Row Number */}
            <TableCell className="w-16 px-4 py-3.5 text-center">
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-zinc-100 px-1.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {(requests.current_page - 1) * requests.per_page + index + 1}
                </span>
            </TableCell>

            {/* Request Number */}
            <TableCell className="px-6 py-3.5 font-mono text-xs font-semibold">
                {req.request_number}
            </TableCell>

            {/* Customer */}
            <TableCell className="px-6 py-3.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {req.customer?.importer_name ?? 'N/A'}
            </TableCell>

            {/* Currency */}
            <TableCell className="px-6 py-3.5 text-sm">
                {req.currency?.code ?? 'N/A'}
            </TableCell>

            {/* Amount */}
            <TableCell className="px-6 py-3.5 text-sm font-mono">
                {Number(req.fcy_amount_requested).toLocaleString()}
            </TableCell>

            {/* Status */}
            <TableCell className="px-6 py-3.5">
                <Badge
                    className={`px-2.5 py-1 text-xs ${
                        statusBadgeColors[req.status] ?? ''
                    }`}
                >
                    {req.status
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                </Badge>
            </TableCell>

            {/* Date */}
            <TableCell className="whitespace-nowrap px-6 py-3.5 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {new Date(req.created_at).toLocaleDateString()}
                </span>
            </TableCell>
        </TableRow>
    ))}
</TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-zinc-100 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/10">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                        Showing {requests.from} to {requests.to} of {requests.total} requests
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {requests.links.map((link, i) => {
                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1.5 text-xs text-zinc-400 dark:text-zinc-600"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            }
                                            return (
                                                <Button
                                                    key={i}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    className="h-8 min-w-8 px-2 text-xs border-zinc-200 dark:border-zinc-800"
                                                    onClick={() => router.get(link.url!, {}, { preserveState: true, replace: true })}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 mb-4">
                                    <FileText className="h-10 w-10 text-zinc-400" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-350">No requests found</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1.5">
                                    {hasActiveFilters
                                        ? 'No requests match your current filters. Try adjusting or clearing your filters.'
                                        : 'There are no FCY requests in the system yet.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}