import { Head, Link, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import fcy from '@/routes/fcy';
import { Plus, Search, Eye, Pencil, Ban, Building2, Users, SlidersHorizontal, Calendar, BadgeInfo, CheckCircle, AlertTriangle, Power } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Customer, CustomerFormData } from '@/types';
import { type BreadcrumbItem } from '@/types';

interface CustomersIndexProps {
    customers: {
        data: Customer[];
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
    branches: string[];
    filters: {
        search?: string;
        branch?: string;
        status?: string;
    };
}

export default function CustomersIndex({ customers, branches, filters }: CustomersIndexProps) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [search, setSearch] = useState(filters.search || '');
    const [branchFilter, setBranchFilter] = useState(filters.branch || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [registerOpen, setRegisterOpen] = useState(false);
    const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
    const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
    const [deactivateCustomer, setDeactivateCustomer] = useState<Customer | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Handle URL param for opening create dialog
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('action') === 'create') {
            setRegisterOpen(true);
        }
    }, []);

    function handleSearch(value: string) {
        setSearch(value);
        router.get(
            fcy.customers.index().url,
            { search: value, branch: branchFilter, status: statusFilter },
            { preserveState: true, replace: true }
        );
    }

    function handleBranchFilter(value: string) {
        const actualValue = value === ' ' ? '' : value;
        setBranchFilter(actualValue);
        router.get(
            fcy.customers.index().url,
            { search, branch: actualValue, status: statusFilter },
            { preserveState: true, replace: true }
        );
    }

    function handleStatusFilter(value: string) {
        const actualValue = value === ' ' ? '' : value;
        setStatusFilter(actualValue);
        router.get(
            fcy.customers.index().url,
            { search, branch: branchFilter, status: actualValue },
            { preserveState: true, replace: true }
        );
    }

    function clearFilters() {
        setSearch('');
        setBranchFilter('');
        setStatusFilter('');
        router.get(fcy.customers.index().url, {}, { preserveState: true, replace: true });
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Customer Registration', href: '/fcy/customers' },
    ];

    return (
        <>
            <Head title="Customer Registration" />

            <div className="flex flex-col gap-6 pb-8 px-8 md:px-12">
                {/* Page Header */}
<div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-950/30 md:p-8">

    {/* Animated Gradient Orbs */}
    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl transition-transform duration-700 group-hover:scale-110 animate-pulse-glow" />

    <div
        className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-red-500/5 to-transparent blur-3xl animate-pulse-glow"
        style={{ animationDelay: '1s' }}
    />

    {/* Subtle Square Grid Pattern */}
    <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
            backgroundImage:
                'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
        }}
    />

    {/* Header Content */}
    <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        {/* Page Information */}
        <div className="space-y-1.5">

            {/* Section Label */}
            <div className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                    Customer Management
                </span>
            </div>

            {/* Page Title */}
            <h1 className="animate-fade-in-up text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
                <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-white">
                    Customer Registry
                </span>
            </h1>

            {/* Page Description */}
            <p
                className="animate-fade-in-up text-sm text-zinc-500 dark:text-zinc-400"
                style={{ animationDelay: '100ms' }}
            >
                Manage and register customer profiles for foreign currency operations.
            </p>

        </div>

        {/* Register Customer Button */}
        <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>

            <DialogTrigger asChild>
                <Button
                    className="button-press shrink-0 cursor-pointer gap-2 bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white shadow-sm transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow animate-fade-in-up"
                    style={{ animationDelay: '200ms' }}
                >
                    <Plus className="h-4 w-4" />
                    Register New Customer
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">

                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                        <Plus className="h-5 w-5 text-red-500" />
                        Register New Customer
                    </DialogTitle>

                    <DialogDescription className="text-xs">
                        Fill in the details below to register a new customer for foreign currency operations.
                    </DialogDescription>
                </DialogHeader>

                <CustomerFormDialog
                    onSuccess={() => setRegisterOpen(false)}
                    onCancel={() => setRegisterOpen(false)}
                    branches={branches}
                />
            </DialogContent>

        </Dialog>

    </div>


                </div>

                {/* Filters Section */}
                <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 shadow-sm animate-fade-in-up hover:shadow-xl hover:border-red-500/40 dark:hover:border-red-500/40 hover:-translate-y-1 transition-all duration-300 hover-lift">
                    <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search bar */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-450" />
                                <Input
                                    placeholder="Search by importer name, NBE account, or TIN..."
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
                                    className="pl-9 h-10 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:border-red-500/50 text-sm"
                                />
                            </div>

                            {/* Branch filter */}
                            <div className="w-full md:w-52">
                                <Select value={branchFilter || ' '} onValueChange={handleBranchFilter}>
                                    <SelectTrigger className="h-10 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-red-500/20">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                            <SelectValue placeholder="All Branches" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">All Branches</SelectItem>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch} value={branch}>
                                                {branch}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status filter */}
                            <div className="w-full md:w-44">
                                <Select value={statusFilter || ' '} onValueChange={handleStatusFilter}>
                                    <SelectTrigger className="h-10 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-red-500/20">
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                            <SelectValue placeholder="All Statuses" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">All Statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear filters */}
                            {(search || branchFilter || statusFilter) ? (
                                <Button 
                                    variant="outline" 
                                    onClick={clearFilters}
                                    className="h-10 px-4 cursor-pointer gap-2 shrink-0 hover:bg-zinc-50 dark:hover:bg-zinc-900 border-zinc-250 dark:border-zinc-800"
                                >
                                    <Ban className="h-4 w-4" />
                                    Clear Filters
                                </Button>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                {/* Directory Table Section */}
                <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden animate-fade-in-up hover:shadow-xl hover:border-red-500/40 dark:hover:border-red-500/40 hover:-translate-y-1 transition-all duration-300 hover-lift">
                    <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-850 px-6">
                        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Users className="h-4 w-4 text-zinc-450" />
                            Registered Importers
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-805 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                                {customers.total}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {customers.data.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <Table className="w-full">
                                        <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40">
                                            <TableRow className="border-b border-zinc-150 dark:border-zinc-850">
                                                <TableHead className="py-3 px-6 font-semibold text-zinc-700 dark:text-zinc-350">Importer Name</TableHead>
                                                <TableHead className="py-3 px-6 font-semibold text-zinc-700 dark:text-zinc-350">Branch</TableHead>
                                                <TableHead className="py-3 px-6 font-semibold text-zinc-700 dark:text-zinc-350">NBE ACC. NO</TableHead>
                                                <TableHead className="py-3 px-6 font-semibold text-zinc-700 dark:text-zinc-350">TIN Number</TableHead>
                                                <TableHead className="py-3 px-6 font-semibold text-zinc-700 dark:text-zinc-350">Status</TableHead>
                                                <TableHead className="py-3 px-6 font-semibold text-zinc-700 dark:text-zinc-350 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {customers.data.map((customer) => (
                                                <TableRow key={customer.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 border-b border-zinc-150 dark:border-zinc-850 transition-colors stagger-item">
                                                    <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100 py-3.5 px-6">
                                                        {customer.importer_name}
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-6">
                                                        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 text-sm">
                                                            <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                                                            <span>{customer.branch}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-6">
                                                        <code className="text-[10px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-700/50">
                                                            {customer.nbe_account_no}
                                                        </code>
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-6">
                                                        <code className="text-[10px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-700/50">
                                                            {customer.tin_number}
                                                        </code>
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-6">
                                                        <Badge
                                                            variant={customer.status === 'active' ? 'default' : 'secondary'}
                                                            className={
                                                                customer.status === 'active'
                                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 hover:bg-emerald-500/15 border-emerald-500/25 px-2.5 py-0.5'
                                                                    : 'bg-zinc-500/10 text-zinc-650 dark:text-zinc-450 hover:bg-zinc-500/15 border-zinc-500/25 px-2.5 py-0.5'
                                                            }
                                                        >
                                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${customer.status === 'active' ? 'bg-emerald-500 animate-pulse-glow' : 'bg-zinc-400'}`} />
                                                            {customer.status === 'active' ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right py-3.5 px-6">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-400 transition-colors button-press"
                                                                onClick={() => setViewCustomer(customer)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                <span className="sr-only">View</span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/20 dark:hover:text-amber-400 transition-colors button-press"
                                                                onClick={() => setEditCustomer(customer)}
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                                <span className="sr-only">Edit</span>
                                                            </Button>
                                                            {customer.status === 'active' ? (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors button-press"
                                                                        onClick={() => setDeactivateCustomer(customer)}
                                                                    >
                                                                    <Ban className="h-3.5 w-3.5" />
                                                                    <span className="sr-only">Deactivate</span>
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-colors button-press"
                                                                    onClick={() => {
                                                                        router.patch(fcy.customers.activate({ customer: customer.id }).url, {}, {
                                                                            preserveState: true,
                                                                            onSuccess: () => {
                                                                                toast.success(`Customer '${customer.importer_name}' activated successfully.`);
                                                                            },
                                                                        });
                                                                    }}
                                                                >
                                                                    <Power className="h-3.5 w-3.5" />
                                                                    <span className="sr-only">Activate</span>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination Panel */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-zinc-100 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/10">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                        Showing {customers.from} to {customers.to} of {customers.total} customers
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {customers.links.map((link, i) => {
                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1.5 text-xs text-zinc-405 dark:text-zinc-505"
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
                                    <Users className="h-10 w-10 text-zinc-400" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-350">No customers found</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1.5 mb-5 leading-normal">
                                    {search || branchFilter || statusFilter
                                        ? 'No registrations match your search filters. Try adjusting or clearing your filters.'
                                        : 'There are no importers registered in the database yet. Click below to register the first.'}
                                </p>
                                {!search && !branchFilter && !statusFilter && (
                                    <Button onClick={() => setRegisterOpen(true)} className="gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold button-press">
                                        <Plus className="h-4 w-4" />
                                        Register New Customer
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* View Customer Details Dialog */}
            <Dialog open={!!viewCustomer} onOpenChange={(open) => !open && setViewCustomer(null)}>
                <DialogContent className="sm:max-w-xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4">
                        <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <BadgeInfo className="h-5 w-5 text-blue-500" />
                            Customer Registry Profile
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Full registration details for the specified customer.
                        </DialogDescription>
                    </DialogHeader>
                    {viewCustomer && (
                        <div className="py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-450 uppercase tracking-wider">Customer Name</Label>
                                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-105">{viewCustomer.importer_name}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-450 uppercase tracking-wider">Registered Branch</Label>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-105 flex items-center gap-1.5">
                                        <Building2 className="h-4 w-4 text-zinc-400" />
                                        {viewCustomer.branch}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-455 uppercase tracking-wider">NBE Account Number</Label>
                                    <p className="mt-1">
                                        <code className="text-xs font-mono font-bold bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-850 dark:text-zinc-200 px-2 py-1 rounded">
                                            {viewCustomer.nbe_account_no}
                                        </code>
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-455 uppercase tracking-wider">TIN Identification No.</Label>
                                    <p className="mt-1">
                                        <code className="text-xs font-mono font-bold bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-850 dark:text-zinc-200 px-2 py-1 rounded">
                                            {viewCustomer.tin_number}
                                        </code>
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-455 uppercase tracking-wider">Operational Status</Label>
                                    <div className="pt-1">
                                        <Badge
                                            variant={viewCustomer.status === 'active' ? 'default' : 'secondary'}
                                            className={
                                                viewCustomer.status === 'active'
                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 hover:bg-emerald-500/15 border-emerald-500/25 px-2.5 py-0.5'
                                                    : 'bg-zinc-500/10 text-zinc-650 dark:text-zinc-450 hover:bg-zinc-500/15 border-zinc-500/25 px-2.5 py-0.5'
                                            }
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${viewCustomer.status === 'active' ? 'bg-emerald-500 animate-pulse-glow' : 'bg-zinc-400'}`} />
                                            {viewCustomer.status === 'active' ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-455 uppercase tracking-wider">Registration Date</Label>
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-zinc-400" />
                                        {new Date(viewCustomer.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="border-t border-zinc-100 dark:border-zinc-900 pt-4">
                        <Button variant="outline" onClick={() => setViewCustomer(null)} className="h-9 border-zinc-200 dark:border-zinc-800 button-press">
                            Close Profile
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Customer Dialog */}
            <Dialog open={!!editCustomer} onOpenChange={(open) => !open && setEditCustomer(null)}>
                <DialogContent className="sm:max-w-xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4">
                        <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Pencil className="h-5 w-5 text-amber-500" />
                            Edit Customer Profile
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Modify the registration values for the selected customer profile.
                        </DialogDescription>
                    </DialogHeader>
                    {editCustomer && (
                        <EditCustomerForm
                            customer={editCustomer}
                            branches={branches}
                            onSuccess={() => setEditCustomer(null)}
                            onCancel={() => setEditCustomer(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Deactivate Confirmation Alert Dialog */}
            <AlertDialog open={!!deactivateCustomer} onOpenChange={(open) => !open && setDeactivateCustomer(null)}>
                <AlertDialogContent className="border border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-950 animate-scale-in">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
                            Deactivate Customer Account?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                            Are you sure you want to deactivate <span className="font-bold text-zinc-900 dark:text-zinc-105">{deactivateCustomer?.importer_name}</span>?
                            Deactivating this account will flag them as inactive and suspend foreign currency trading services.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 gap-2">
                        <AlertDialogCancel className="h-9 border-zinc-200 dark:border-zinc-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="h-9 bg-red-650 hover:bg-red-750 text-white font-semibold shadow-sm hover:shadow transition-colors"
                            onClick={() => {
                                if (deactivateCustomer) {
                                    router.delete(fcy.customers.destroy({ customer: deactivateCustomer.id }).url, {
                                        preserveState: true,
                                        onSuccess: () => {
                                            toast.success(`Customer deactivated successfully.`);
                                            setDeactivateCustomer(null);
                                        },
                                    });
                                }
                            }}
                        >
                            Deactivate Importer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function CustomerFormDialog({
    onSuccess,
    onCancel,
    branches,
}: {
    onSuccess: () => void;
    onCancel: () => void;
    branches: string[];
}) {
    const [branch, setBranch] = useState('');
    const [importerName, setImporterName] = useState('');
    const [nbeAccountNo, setNbeAccountNo] = useState('');
    const [tinNumber, setTinNumber] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch(fcy.customers.store().url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                },
                body: JSON.stringify({
                    branch,
                    importer_name: importerName,
                    nbe_account_no: nbeAccountNo,
                    tin_number: tinNumber,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(
                        Object.fromEntries(
                            Object.entries(data.errors).map(([key, messages]) => [key, (messages as string[])[0]]),
                        ),
                    );
                } else {
                    setErrors({ importer_name: data.message || 'Registration failed.' });
                }
                return;
            }

            toast.success(data.message || 'Customer registered successfully.');
            setBranch('');
            setImporterName('');
            setNbeAccountNo('');
            setTinNumber('');
            onSuccess();
        } catch {
            setErrors({ importer_name: 'An unexpected error occurred. Please try again.' });
        } finally {
            setProcessing(false);
        }
    }

    const hasDuplicateError =
        errors.nbe_account_no?.toLowerCase().includes('already') ||
        errors.tin_number?.toLowerCase().includes('already');

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-5 py-5">
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Branch */}
                    <div className="space-y-2">
                        <Label htmlFor="branch" className="text-xs font-semibold text-zinc-600 dark:text-zinc-350 after:content-['*'] after:ml-0.5 after:text-red-500">
                            Branch of the Customer
                        </Label>
                        <Select value={branch} onValueChange={(value) => setBranch(value)}>
                            <SelectTrigger id="branch" className={`h-10 bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 ${errors.branch ? 'border-red-500 focus:ring-red-500/20' : ''}`}>
                                <SelectValue placeholder="Select branch..." />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((branch) => (
                                    <SelectItem key={branch} value={branch}>
                                        {branch}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.branch && (
                            <p className="text-xs text-red-500 font-medium">{errors.branch}</p>
                        )}
                    </div>

                    {/* Importer Name */}
                    <div className="space-y-2">
                        <Label htmlFor="importer_name" className="text-xs font-semibold text-zinc-600 dark:text-zinc-355 after:content-['*'] after:ml-0.5 after:text-red-500">
                            Name of the Customer
                        </Label>
                        <Input
                            id="importer_name"
                            placeholder="Enter official registered name"
                            value={importerName}
                            onChange={(e) => setImporterName(e.target.value)}
                            className={`h-10 bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 ${errors.importer_name ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                        />
                        {errors.importer_name && (
                            <p className="text-xs text-red-500 font-medium">{errors.importer_name}</p>
                        )}
                    </div>

                    {/* NBE ACC. NO */}
                    <div className="space-y-2">
                        <Label htmlFor="nbe_account_no" className="text-xs font-semibold text-zinc-650 dark:text-zinc-355 after:content-['*'] after:ml-0.5 after:text-red-500">
                            NBE ACC. NO
                        </Label>
                        <Input
                            id="nbe_account_no"
                            placeholder="e.g., NBE-001234"
                            value={nbeAccountNo}
                            onChange={(e) => setNbeAccountNo(e.target.value)}
                            className={`h-10 font-mono text-sm bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 ${errors.nbe_account_no ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                        />
                        {errors.nbe_account_no && (
                            <p className="text-xs text-red-500 font-medium">{errors.nbe_account_no}</p>
                        )}
                    </div>

                    {/* TIN Number */}
                    <div className="space-y-2">
                        <Label htmlFor="tin_number" className="text-xs font-semibold text-zinc-650 dark:text-zinc-355 after:content-['*'] after:ml-0.5 after:text-red-500">
                            TIN Number
                        </Label>
                        <Input
                            id="tin_number"
                            placeholder="e.g., 1234-5678-9012"
                            value={tinNumber}
                            onChange={(e) => setTinNumber(e.target.value)}
                            className={`h-10 font-mono text-sm bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 ${errors.tin_number ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                        />
                        {errors.tin_number && (
                            <p className="text-xs text-red-500 font-medium">{errors.tin_number}</p>
                        )}
                    </div>
                </div>

                {/* Validation Banner */}
                {hasDuplicateError ? (
                    <div className="rounded-xl border border-amber-205 dark:border-amber-900/50 bg-amber-500/[0.04] p-4 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <div>
                            <span className="font-semibold block mb-0.5">Duplicate Registration Detected</span>
                            A customer with this NBE account number or TIN number already exists in the registry. Please verify the values and try again.
                        </div>
                    </div>
                ) : null}
            </div>

            <DialogFooter className="border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="h-9 border-zinc-200 dark:border-zinc-800 button-press">
                    Cancel
                </Button>
                <Button type="submit" disabled={processing} className="h-9 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-colors button-press">
                    {processing ? (
                        <>Registering Customer...</>
                    ) : (
                        <>Register Customer</>
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}

function EditCustomerForm({
    customer,
    branches,
    onSuccess,
    onCancel,
}: {
    customer: Customer;
    branches: string[];
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm<CustomerFormData>({
        branch: customer.branch,
        importer_name: customer.importer_name,
        nbe_account_no: customer.nbe_account_no,
        tin_number: customer.tin_number,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(fcy.customers.update({ customer: customer.id }).url, {
            onSuccess: () => {
                onSuccess();
            },
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-5 py-5">
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Branch select */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-branch" className="text-xs font-semibold text-zinc-650 dark:text-zinc-350 after:content-['*'] after:ml-0.5 after:text-red-500">
                            Branch of the Importer
                        </Label>
                        <Select value={data.branch} onValueChange={(value) => setData('branch', value)}>
                            <SelectTrigger id="edit-branch" className={`h-10 bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 ${errors.branch ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Select branch..." />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((branch) => (
                                    <SelectItem key={branch} value={branch}>
                                        {branch}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.branch && <p className="text-xs text-red-500 font-medium">{errors.branch}</p>}
                    </div>

                    {/* Importer Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-xs font-semibold text-zinc-650 dark:text-zinc-355 after:content-['*'] after:ml-0.5 after:text-red-500">
                            Name of the Importer
                        </Label>
                        <Input
                            id="edit-name"
                            value={data.importer_name}
                            onChange={(e) => setData('importer_name', e.target.value)}
                            className={`h-10 bg-zinc-50/30 dark:bg-zinc-955 border-zinc-250 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 ${errors.importer_name ? 'border-red-500' : ''}`}
                        />
                        {errors.importer_name && <p className="text-xs text-red-500 font-medium">{errors.importer_name}</p>}
                    </div>

                    {/* NBE Account Number */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-nbe" className="text-xs font-semibold text-zinc-650 dark:text-zinc-355 after:content-['*'] after:ml-0.5 after:text-red-500">
                            NBE ACC. NO
                        </Label>
                        <Input
                            id="edit-nbe"
                            value={data.nbe_account_no}
                            onChange={(e) => setData('nbe_account_no', e.target.value)}
                            className={`h-10 font-mono text-sm bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 ${errors.nbe_account_no ? 'border-red-500' : ''}`}
                        />
                        {errors.nbe_account_no && <p className="text-xs text-red-500 font-medium">{errors.nbe_account_no}</p>}
                    </div>

                    {/* TIN number */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-tin" className="text-xs font-semibold text-zinc-655 dark:text-zinc-355 after:content-['*'] after:ml-0.5 after:text-red-500">
                            TIN Number
                        </Label>
                        <Input
                            id="edit-tin"
                            value={data.tin_number}
                            onChange={(e) => setData('tin_number', e.target.value)}
                            className={`h-10 font-mono text-sm bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 ${errors.tin_number ? 'border-red-500' : ''}`}
                        />
                        {errors.tin_number && <p className="text-xs text-red-500 font-medium">{errors.tin_number}</p>}
                    </div>
                </div>
            </div>
            
            <DialogFooter className="border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="h-9 border-zinc-200 dark:border-zinc-800 button-press">
                    Cancel
                </Button>
                <Button type="submit" disabled={processing} className="h-9 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-colors button-press">
                    {processing ? 'Saving Changes...' : 'Save Changes'}
                </Button>
            </DialogFooter>
        </form>
    );
}