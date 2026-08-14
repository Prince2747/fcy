import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CreditCard, Plus, Search, Pencil, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PaymentMethod } from '@/types';
import { type BreadcrumbItem } from '@/types';

interface PaymentMethodsIndexProps {
    paymentMethods: {
        data: PaymentMethod[];
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
    filters: {
        search?: string;
    };
}

function PaymentMethodFormDialog({
    paymentMethod,
    onSuccess,
    onCancel,
}: {
    paymentMethod?: PaymentMethod;
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: paymentMethod?.name || '',
        code: paymentMethod?.code || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (paymentMethod) {
            put(`/fcy/settings/payment-methods/${paymentMethod.id}`, {
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        } else {
            post('/fcy/settings/payment-methods', {
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-5 py-5">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold text-zinc-600 dark:text-zinc-350 after:content-['*'] after:ml-0.5 after:text-red-500">
                        Payment Method Name
                    </Label>
                    <Input
                        id="name"
                        placeholder="e.g., Letter of Credit, Telegraphic Transfer"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={`h-10 bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 ${errors.name ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="code" className="text-xs font-semibold text-zinc-600 dark:text-zinc-350">
                        Code (Optional)
                    </Label>
                    <Input
                        id="code"
                        placeholder="e.g., LC, TT, CAD"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                        maxLength={50}
                        className={`h-10 font-mono text-sm bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 ${errors.code ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                    />
                    {errors.code && <p className="text-xs text-red-500 font-medium">{errors.code}</p>}
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Short code or abbreviation for the payment method</p>
                </div>

                {errors.code?.includes('already') && (
                    <div className="rounded-xl border border-amber-205 dark:border-amber-900/50 bg-amber-500/[0.04] p-4 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <div>
                            <span className="font-semibold block mb-0.5">Duplicate Payment Method Code</span>
                            A payment method with this code already exists in the system. Please use a different code.
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter className="border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="h-9 border-zinc-200 dark:border-zinc-800 button-press">
                    Cancel
                </Button>
                <Button type="submit" disabled={processing} className="h-9 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-colors button-press">
                    {processing ? 'Saving...' : (paymentMethod ? 'Update Payment Method' : 'Add Payment Method')}
                </Button>
            </DialogFooter>
        </form>
    );
}

export default function PaymentMethodsIndex({ paymentMethods, filters }: PaymentMethodsIndexProps) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [search, setSearch] = useState(filters.search || '');
    const [createOpen, setCreateOpen] = useState(false);
    const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    function handleSearch(value: string) {
        setSearch(value);
        router.get('/fcy/settings/payment-methods', { search: value }, { preserveState: true, replace: true });
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payment Methods', href: '/fcy/settings/payment-methods' },
    ];

    return (
        <>
            <Head title="Payment Methods Management" />

            <div className="flex flex-col gap-6 pb-8 px-8 md:px-12">
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-950/30 md:p-8">
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl transition-transform duration-700 group-hover:scale-110 animate-pulse-glow" />
                    <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-red-500/5 to-transparent blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
                    <div className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }} />

                    <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                                    System Configuration
                                </span>
                            </div>
                            <h1 className="animate-fade-in-up text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-3xl">
                                <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-white">
                                    Payment Methods
                                </span>
                            </h1>
                            <p className="animate-fade-in-up text-sm text-zinc-500 dark:text-zinc-400" style={{ animationDelay: '100ms' }}>
                                Manage payment methods available for FCY transactions.
                            </p>
                        </div>

                        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="button-press shrink-0 cursor-pointer gap-2 bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white shadow-sm transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                    <Plus className="h-4 w-4" />
                                    Add Payment Method
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                                        <CreditCard className="h-5 w-5 text-red-500" />
                                        Add New Payment Method
                                    </DialogTitle>
                                    <DialogDescription className="text-xs">
                                        Enter the payment method details below.
                                    </DialogDescription>
                                </DialogHeader>
                                <PaymentMethodFormDialog onSuccess={() => setCreateOpen(false)} onCancel={() => setCreateOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 shadow-sm animate-fade-in-up hover:shadow-xl hover:border-red-500/40 dark:hover:border-red-500/40 hover:-translate-y-1 transition-all duration-300 hover-lift">
                    <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-450" />
                                <Input
                                    placeholder="Search by name or code..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        if (!e.target.value) handleSearch('');
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSearch(search);
                                    }}
                                    className="pl-9 h-10 border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:border-red-500/50 text-sm"
                                />
                            </div>
                            {search && (
                                <Button variant="outline" onClick={() => handleSearch('')} className="h-10 px-4 cursor-pointer gap-2 shrink-0 hover:bg-zinc-50 dark:hover:bg-zinc-900 border-zinc-250 dark:border-zinc-800">
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden animate-fade-in-up hover:shadow-xl hover:border-red-500/40 dark:hover:border-red-500/40 hover:-translate-y-1 transition-all duration-300 hover-lift">
                    <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-850 px-6">
                        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-zinc-450" />
                            Registered Payment Methods
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-805 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                                {paymentMethods.total}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {paymentMethods.data.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <Table className="w-full">
                                        <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40">
                                            <TableRow className="border-b border-zinc-150 dark:border-zinc-850">
                                                <TableHead className="w-14 px-4 py-3 text-center font-semibold text-zinc-700 dark:text-zinc-350">#</TableHead>
                                                <TableHead className="py-3 px-6 font-semibold text-zinc-700 dark:text-zinc-350">Name</TableHead>
                                                <TableHead className="py-3 px-6 font-semibold text-zinc-700 dark:text-zinc-350">Code</TableHead>
                                                <TableHead className="py-3 px-6 font-semibold text-zinc-700 dark:text-zinc-350 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paymentMethods.data.map((method, index) => (
                                                <TableRow key={method.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 border-b border-zinc-150 dark:border-zinc-850 transition-colors">
                                                    <TableCell className="w-14 px-4 py-3.5 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                                        {(paymentMethods.current_page - 1) * paymentMethods.per_page + index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100 py-3.5 px-6">
                                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{method.name}</span>
                                                    </TableCell>
                                                    <TableCell className="py-3.5 px-6">
                                                        {method.code ? (
                                                            <code className="text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-700/50">
                                                                {method.code}
                                                            </code>
                                                        ) : (
                                                            <span className="text-sm text-zinc-500 dark:text-zinc-400">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right py-3.5 px-6">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/20 dark:hover:text-amber-400 transition-colors button-press" onClick={() => setEditPaymentMethod(method)}>
                                                                <Pencil className="h-3.5 w-3.5" />
                                                                <span className="sr-only">Edit</span>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-zinc-100 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/10">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                        Showing {paymentMethods.from} to {paymentMethods.to} of {paymentMethods.total} payment methods
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {paymentMethods.links.map((link, i) => {
                                            if (!link.url) {
                                                return <span key={i} className="px-2.5 py-1.5 text-xs text-zinc-405 dark:text-zinc-505" dangerouslySetInnerHTML={{ __html: link.label }} />;
                                            }
                                            return (
                                                <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" className="h-8 min-w-8 px-2 text-xs border-zinc-200 dark:border-zinc-800" onClick={() => router.get(link.url!, {}, { preserveState: true, replace: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 mb-4">
                                    <CreditCard className="h-10 w-10 text-zinc-400" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-350">No payment methods found</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1.5 mb-5 leading-normal">
                                    {search ? 'No payment methods match your search. Try adjusting your search terms.' : 'There are no payment methods in the system. Click below to add the first one.'}
                                </p>
                                {!search && (
                                    <Button onClick={() => setCreateOpen(true)} className="gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold button-press">
                                        <Plus className="h-4 w-4" />
                                        Add First Payment Method
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={!!editPaymentMethod} onOpenChange={(open) => !open && setEditPaymentMethod(null)}>
                    <DialogContent className="sm:max-w-2xl border border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <DialogHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4">
                            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Pencil className="h-5 w-5 text-amber-500" />
                                Edit Payment Method
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Update the payment method details below.
                            </DialogDescription>
                        </DialogHeader>
                        {editPaymentMethod && (
                            <PaymentMethodFormDialog paymentMethod={editPaymentMethod} onSuccess={() => setEditPaymentMethod(null)} onCancel={() => setEditPaymentMethod(null)} />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
