import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    DollarSign,
    Plus,
    Search,
    Pencil,
    AlertTriangle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { Currency } from '@/types';
import { type BreadcrumbItem } from '@/types';

interface CurrenciesIndexProps {
    currencies: {
        data: Currency[];
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

function CurrencyFormDialog({
    currency,
    onSuccess,
    onCancel,
}: {
    currency?: Currency;
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
    } = useForm({
        code: currency?.code || '',
        name: currency?.name || '',
        symbol: currency?.symbol || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (currency) {
            put(`/fcy/settings/currencies/${currency.id}`, {
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        } else {
            post('/fcy/settings/currencies', {
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
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Currency Code */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="code"
                            className="text-xs font-semibold text-zinc-600 dark:text-zinc-350 after:ml-0.5 after:text-red-500 after:content-['*']"
                        >
                            Currency Code
                        </Label>

                        <Input
                            id="code"
                            placeholder="e.g., USD, EUR, GBP"
                            value={data.code}
                            onChange={(e) =>
                                setData(
                                    'code',
                                    e.target.value.toUpperCase(),
                                )
                            }
                            maxLength={3}
                            className={`h-10 border-zinc-250 bg-zinc-50/30 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-950 focus-visible:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/20 ${
                                errors.code
                                    ? 'border-red-500 focus-visible:ring-red-500/20'
                                    : ''
                            }`}
                        />

                        {errors.code && (
                            <p className="text-xs font-medium text-red-500">
                                {errors.code}
                            </p>
                        )}

                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                            3-letter ISO 4217 currency code
                        </p>
                    </div>

                    {/* Symbol */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="symbol"
                            className="text-xs font-semibold text-zinc-600 dark:text-zinc-350"
                        >
                            Symbol
                        </Label>

                        <Input
                            id="symbol"
                            placeholder="e.g., $, €, £"
                            value={data.symbol}
                            onChange={(e) =>
                                setData('symbol', e.target.value)
                            }
                            maxLength={10}
                            className={`h-10 border-zinc-250 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-950 focus-visible:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/20 ${
                                errors.symbol
                                    ? 'border-red-500 focus-visible:ring-red-500/20'
                                    : ''
                            }`}
                        />

                        {errors.symbol && (
                            <p className="text-xs font-medium text-red-500">
                                {errors.symbol}
                            </p>
                        )}
                    </div>
                </div>

                {/* Currency Name */}
                <div className="space-y-2">
                    <Label
                        htmlFor="name"
                        className="text-xs font-semibold text-zinc-600 dark:text-zinc-350 after:ml-0.5 after:text-red-500 after:content-['*']"
                    >
                        Currency Name
                    </Label>

                    <Input
                        id="name"
                        placeholder="e.g., US Dollar, Euro, British Pound"
                        value={data.name}
                        onChange={(e) =>
                            setData('name', e.target.value)
                        }
                        className={`h-10 border-zinc-250 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-950 focus-visible:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/20 ${
                            errors.name
                                ? 'border-red-500 focus-visible:ring-red-500/20'
                                : ''
                        }`}
                    />

                    {errors.name && (
                        <p className="text-xs font-medium text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Duplicate Currency Warning */}
                {errors.code?.includes('already') && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-205 bg-amber-500/[0.04] p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:text-amber-300">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                        <div>
                            <span className="mb-0.5 block font-semibold">
                                Duplicate Currency Code
                            </span>

                            A currency with this code already exists in the
                            system. Please use a different code.
                        </div>
                    </div>
                )}
            </div>

            <DialogFooter className="mt-2 border-t border-zinc-100 pt-4 dark:border-zinc-900">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="button-press h-9 border-zinc-200 dark:border-zinc-800"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={processing}
                    className="button-press h-9 bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white transition-colors hover:from-red-700 hover:to-red-800"
                >
                    {processing
                        ? 'Saving...'
                        : currency
                          ? 'Update Currency'
                          : 'Add Currency'}
                </Button>
            </DialogFooter>
        </form>
    );
}

export default function CurrenciesIndex({
    currencies,
    filters,
}: CurrenciesIndexProps) {
    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
        };
    };

    const [search, setSearch] = useState(filters.search || '');
    const [createOpen, setCreateOpen] = useState(false);
    const [editCurrency, setEditCurrency] =
        useState<Currency | null>(null);

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

        router.get(
            '/fcy/settings/currencies',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Currency Management',
            href: '/fcy/settings/currencies',
        },
    ];

    return (
        <>
            <Head title="Currency Management" />

            <div className="flex flex-col gap-6 px-8 pb-8 md:px-12">
                {/* Header */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-950/30 md:p-8">
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl transition-transform duration-700 group-hover:scale-110 animate-pulse-glow" />

                    <div
                        className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-red-500/5 to-transparent blur-3xl animate-pulse-glow"
                        style={{ animationDelay: '1s' }}
                    />

                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                    />

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
                                    Currency Registry
                                </span>
                            </h1>

                            <p
                                className="animate-fade-in-up text-sm text-zinc-500 dark:text-zinc-400"
                                style={{ animationDelay: '100ms' }}
                            >
                                Manage foreign currencies available for FCY
                                transactions.
                            </p>
                        </div>

                        {/* Add Currency Dialog */}
                        <Dialog
                            open={createOpen}
                            onOpenChange={setCreateOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    className="button-press shrink-0 cursor-pointer gap-2 bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white shadow-sm transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow animate-fade-in-up"
                                    style={{
                                        animationDelay: '200ms',
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Currency
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                                        <DollarSign className="h-5 w-5 text-red-500" />
                                        Add New Currency
                                    </DialogTitle>

                                    <DialogDescription className="text-xs">
                                        Enter the currency details below. The
                                        currency code should be a 3-letter ISO
                                        code.
                                    </DialogDescription>
                                </DialogHeader>

                                <CurrencyFormDialog
                                    onSuccess={() =>
                                        setCreateOpen(false)
                                    }
                                    onCancel={() =>
                                        setCreateOpen(false)
                                    }
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Search */}
                <Card className="animate-fade-in-up border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-red-500/40 hover-lift">
                    <CardContent className="p-5">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-450" />

                                <Input
                                    placeholder="Search by code, name, or symbol..."
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
                                    className="h-10 border-zinc-250 bg-white pl-9 text-sm dark:border-zinc-800 dark:bg-zinc-950 focus-visible:border-red-500/50 focus-visible:ring-2 focus-visible:ring-red-500/20"
                                />
                            </div>

                            {search && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleSearch('')}
                                    className="h-10 shrink-0 cursor-pointer gap-2 border-zinc-250 px-4 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Currency Table */}
                <Card className="animate-fade-in-up overflow-hidden border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-red-500/40 hover-lift">
                    <CardHeader className="border-b border-zinc-100 px-6 pb-3 dark:border-zinc-850">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-white">
                            <DollarSign className="h-4 w-4 text-zinc-450" />

                            Registered Currencies

                            <span className="rounded-full border border-zinc-200/50 bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:border-zinc-700/50 dark:bg-zinc-805 dark:text-zinc-400">
                                {currencies.total}
                            </span>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        {currencies.data.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <Table className="w-full">
                                        <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40">
                                            <TableRow className="border-b border-zinc-150 dark:border-zinc-850">
                                                {/* Number Column */}
                                                <TableHead className="w-14 px-4 py-3 text-center font-semibold text-zinc-700 dark:text-zinc-350">
                                                    #
                                                </TableHead>

                                                <TableHead className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-350">
                                                    Code
                                                </TableHead>

                                                <TableHead className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-350">
                                                    Currency Name
                                                </TableHead>

                                                <TableHead className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-350">
                                                    Symbol
                                                </TableHead>

                                                <TableHead className="px-6 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-350">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {currencies.data.map(
                                                (currency, index) => (
                                                    <TableRow
                                                        key={currency.id}
                                                        className="border-b border-zinc-150 transition-colors hover:bg-zinc-50/40 dark:border-zinc-850 dark:hover:bg-zinc-900/20"
                                                    >
                                                        {/* Number */}
                                                        <TableCell className="w-14 px-4 py-3.5 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                                            {(currencies.current_page -
                                                                1) *
                                                                currencies.per_page +
                                                                index +
                                                                1}
                                                        </TableCell>

                                                        {/* Code */}
                                                        <TableCell className="px-6 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                                                            <code className="rounded border border-zinc-200/50 bg-zinc-100 px-2 py-0.5 font-mono text-xs font-bold text-zinc-700 dark:border-zinc-700/50 dark:bg-zinc-800/80 dark:text-zinc-300">
                                                                {currency.code}
                                                            </code>
                                                        </TableCell>

                                                        {/* Currency Name */}
                                                        <TableCell className="px-6 py-3.5">
                                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                                {
                                                                    currency.name
                                                                }
                                                            </span>
                                                        </TableCell>

                                                        {/* Symbol */}
                                                        <TableCell className="px-6 py-3.5">
                                                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                                {currency.symbol ||
                                                                    '-'}
                                                            </span>
                                                        </TableCell>

                                                        {/* Actions */}
                                                        <TableCell className="px-6 py-3.5 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="button-press h-8 w-8 transition-colors hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/20 dark:hover:text-amber-400"
                                                                    onClick={() =>
                                                                        setEditCurrency(
                                                                            currency,
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                    <span className="sr-only">
                                                                        Edit
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-100 bg-zinc-50/20 p-5 dark:border-zinc-850 dark:bg-zinc-950/10 sm:flex-row">
                                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                        Showing {currencies.from} to{' '}
                                        {currencies.to} of{' '}
                                        {currencies.total} currencies
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {currencies.links.map(
                                            (link, i) => {
                                                if (!link.url) {
                                                    return (
                                                        <span
                                                            key={i}
                                                            className="px-2.5 py-1.5 text-xs text-zinc-405 dark:text-zinc-505"
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
                                                        className="h-8 min-w-8 border-zinc-200 px-2 text-xs dark:border-zinc-800"
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
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
                                <div className="mb-4 rounded-full border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-850 dark:bg-zinc-900">
                                    <DollarSign className="h-10 w-10 text-zinc-400" />
                                </div>

                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-350">
                                    No currencies found
                                </p>

                                <p className="mt-1.5 mb-5 max-w-sm text-xs leading-normal text-zinc-500 dark:text-zinc-400">
                                    {search
                                        ? 'No currencies match your search. Try adjusting your search terms.'
                                        : 'There are no currencies in the system. Click below to add the first currency.'}
                                </p>

                                {!search && (
                                    <Button
                                        onClick={() =>
                                            setCreateOpen(true)
                                        }
                                        className="button-press gap-2 bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white hover:from-red-700 hover:to-red-800"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add First Currency
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Currency Dialog */}
                <Dialog
                    open={!!editCurrency}
                    onOpenChange={(open) =>
                        !open && setEditCurrency(null)
                    }
                >
                    <DialogContent className="border border-zinc-150 bg-white dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-2xl">
                        <DialogHeader className="border-b border-zinc-100 pb-4 dark:border-zinc-900">
                            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                                <Pencil className="h-5 w-5 text-amber-500" />
                                Edit Currency
                            </DialogTitle>

                            <DialogDescription className="text-xs">
                                Update the currency details below.
                            </DialogDescription>
                        </DialogHeader>

                        {editCurrency && (
                            <CurrencyFormDialog
                                currency={editCurrency}
                                onSuccess={() =>
                                    setEditCurrency(null)
                                }
                                onCancel={() =>
                                    setEditCurrency(null)
                                }
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}