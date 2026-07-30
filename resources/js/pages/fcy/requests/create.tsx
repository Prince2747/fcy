import { Head, Link, useForm, setLayoutProps, router } from '@inertiajs/react';
import { ArrowLeft, Save, Send, UserPlus } from 'lucide-react';
import { useState } from 'react';
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import fcy from '@/routes/fcy';
import type { Currency, Customer, CustomerFormData, FcyRequestFormData, PaymentMethod } from '@/types';
import { type BreadcrumbItem } from '@/types';

interface CreateProps {
    customers: Customer[];
    currencies: Currency[];
    paymentMethods: PaymentMethod[];
    branches: string[];
}

export default function Create({ customers, currencies, paymentMethods, branches }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<FcyRequestFormData>({
        customer_id: '',
        proforma_invoice_number: '',
        proforma_invoice_date: '',
        payment_method_id: '',
        currency_id: '',
        fcy_amount_requested: '',
        total_amount_in_usd: '',
        importing_items: '',
        supplier_country: '',
        maker_notes: '',
    });
    const [customerModalOpen, setCustomerModalOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'FCY Requests', href: '/fcy/requests' },
        { title: 'New Request', href: '/fcy/requests/create' },
    ];

    setLayoutProps({ breadcrumbs });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(fcy.requests.store().url);
    }

    return (
        <>
            <Head title="New FCY Request" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={fcy.requests.index().url}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            New Foreign Currency Request
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            Fill in the details below to create a new FCY request.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        {/* Customer Selection */}
                        <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                            <CardHeader>
                                <CardTitle className="text-base">Customer Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="customer_id">Customer *</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={data.customer_id.toString()}
                                            onValueChange={(value) => setData('customer_id', Number(value))}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select a customer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customers.map((customer) => (
                                                    <SelectItem key={customer.id} value={customer.id.toString()}>
                                                        {customer.importer_name} - {customer.nbe_account_no}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCustomerModalOpen(true)}
                                            className="gap-2 shrink-0"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            New
                                        </Button>
                                    </div>
                                    {errors.customer_id && (
                                        <p className="text-sm text-red-500">{errors.customer_id}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supplier_country">Supplier Country *</Label>
                                    <Input
                                        id="supplier_country"
                                        value={data.supplier_country}
                                        onChange={(e) => setData('supplier_country', e.target.value)}
                                        placeholder="Enter supplier country"
                                    />
                                    {errors.supplier_country && (
                                        <p className="text-sm text-red-500">{errors.supplier_country}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Invoice Details */}
                        <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                            <CardHeader>
                                <CardTitle className="text-base">Proforma Invoice</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="proforma_invoice_number">Proforma Invoice Number *</Label>
                                    <Input
                                        id="proforma_invoice_number"
                                        value={data.proforma_invoice_number}
                                        onChange={(e) => setData('proforma_invoice_number', e.target.value)}
                                        placeholder="Enter invoice number"
                                    />
                                    {errors.proforma_invoice_number && (
                                        <p className="text-sm text-red-500">{errors.proforma_invoice_number}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="proforma_invoice_date">Proforma Invoice Date *</Label>
                                    <Input
                                        id="proforma_invoice_date"
                                        type="date"
                                        value={data.proforma_invoice_date}
                                        onChange={(e) => setData('proforma_invoice_date', e.target.value)}
                                    />
                                    {errors.proforma_invoice_date && (
                                        <p className="text-sm text-red-500">{errors.proforma_invoice_date}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment & Currency */}
                        <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                            <CardHeader>
                                <CardTitle className="text-base">Payment & Currency Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="payment_method_id">Method of Payment *</Label>
                                    <Select
                                        value={data.payment_method_id.toString()}
                                        onValueChange={(value) => setData('payment_method_id', Number(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentMethods.map((method) => (
                                                <SelectItem key={method.id} value={method.id.toString()}>
                                                    {method.code ?? method.name} - {method.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.payment_method_id && (
                                        <p className="text-sm text-red-500">{errors.payment_method_id}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency_id">FCY Currency *</Label>
                                    <Select
                                        value={data.currency_id.toString()}
                                        onValueChange={(value) => setData('currency_id', Number(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((currency) => (
                                                <SelectItem key={currency.id} value={currency.id.toString()}>
                                                    {currency.code} - {currency.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.currency_id && (
                                        <p className="text-sm text-red-500">{errors.currency_id}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fcy_amount_requested">FCY Amount Requested *</Label>
                                    <Input
                                        id="fcy_amount_requested"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.fcy_amount_requested}
                                        onChange={(e) => setData('fcy_amount_requested', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.fcy_amount_requested && (
                                        <p className="text-sm text-red-500">{errors.fcy_amount_requested}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total_amount_in_usd">Total Amount in USD *</Label>
                                    <Input
                                        id="total_amount_in_usd"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.total_amount_in_usd}
                                        onChange={(e) => setData('total_amount_in_usd', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.total_amount_in_usd && (
                                        <p className="text-sm text-red-500">{errors.total_amount_in_usd}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items */}
                        <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                            <CardHeader>
                                <CardTitle className="text-base">Import Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="importing_items">Importing Items *</Label>
                                    <textarea
                                        id="importing_items"
                                        rows={4}
                                        className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                        value={data.importing_items}
                                        onChange={(e) => setData('importing_items', e.target.value)}
                                        placeholder="Describe the items being imported..."
                                    />
                                    {errors.importing_items && (
                                        <p className="text-sm text-red-500">{errors.importing_items}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maker_notes">Notes (Optional)</Label>
                                    <textarea
                                        id="maker_notes"
                                        rows={3}
                                        className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                        value={data.maker_notes}
                                        onChange={(e) => setData('maker_notes', e.target.value)}
                                        placeholder="Any additional notes..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <Link href={fcy.requests.index().url}>
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="gap-2">
                                <Save className="h-4 w-4" />
                                Save as Draft
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Customer Creation Modal */}
            <Dialog open={customerModalOpen} onOpenChange={setCustomerModalOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                            <UserPlus className="h-5 w-5 text-red-500" />
                            Register New Customer
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Register a new customer to select them for this request.
                        </DialogDescription>
                    </DialogHeader>
                    <InlineCustomerForm
                        branches={branches}
                        onSuccess={(newCustomerId) => {
                            setCustomerModalOpen(false);
                            setData('customer_id', newCustomerId);
                            router.reload({ only: ['customers'] });
                        }}
                        onCancel={() => setCustomerModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

function InlineCustomerForm({
    branches,
    onSuccess,
    onCancel,
}: {
    branches: string[];
    onSuccess: (customerId: number) => void;
    onCancel: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm<CustomerFormData>({
        branch: '',
        importer_name: '',
        nbe_account_no: '',
        tin_number: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        fetch(fcy.customers.store().url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(async (response) => {
            const result = await response.json();
            if (result.success && result.customer) {
                reset();
                toast.success(result.message || `Customer '${result.customer.importer_name}' registered successfully.`);
                onSuccess(result.customer.id);
            } else {
                throw new Error('Failed to create customer');
            }
        })
        .catch((error) => {
            console.error('Error creating customer:', error);
            toast.error('Failed to create customer. Please try again.');
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-5 py-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="inline-branch" className="text-xs font-semibold text-zinc-600 dark:text-zinc-350 after:content-['*'] after:ml-0.5 after:text-red-500">
                            Branch
                        </Label>
                        <Select value={data.branch} onValueChange={(value) => setData('branch', value)}>
                            <SelectTrigger id="inline-branch" className={`h-10 bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 ${errors.branch ? 'border-red-500' : ''}`}>
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

                    <div className="space-y-2">
                        <Label htmlFor="inline-name" className="text-xs font-semibold text-zinc-600 dark:text-zinc-350 after:content-['*'] after:ml-0.5 after:text-red-500">
                            Importer Name
                        </Label>
                        <Input
                            id="inline-name"
                            placeholder="Enter official registered name"
                            value={data.importer_name}
                            onChange={(e) => setData('importer_name', e.target.value)}
                            className={`h-10 bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 ${errors.importer_name ? 'border-red-500' : ''}`}
                        />
                        {errors.importer_name && <p className="text-xs text-red-500 font-medium">{errors.importer_name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="inline-nbe" className="text-xs font-semibold text-zinc-600 dark:text-zinc-350 after:content-['*'] after:ml-0.5 after:text-red-500">
                            NBE ACC. NO
                        </Label>
                        <Input
                            id="inline-nbe"
                            placeholder="e.g., NBE-001234"
                            value={data.nbe_account_no}
                            onChange={(e) => setData('nbe_account_no', e.target.value)}
                            className={`h-10 font-mono text-sm bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 ${errors.nbe_account_no ? 'border-red-500' : ''}`}
                        />
                        {errors.nbe_account_no && <p className="text-xs text-red-500 font-medium">{errors.nbe_account_no}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="inline-tin" className="text-xs font-semibold text-zinc-600 dark:text-zinc-350 after:content-['*'] after:ml-0.5 after:text-red-500">
                            TIN Number
                        </Label>
                        <Input
                            id="inline-tin"
                            placeholder="e.g., 1234-5678-9012"
                            value={data.tin_number}
                            onChange={(e) => setData('tin_number', e.target.value)}
                            className={`h-10 font-mono text-sm bg-zinc-50/30 dark:bg-zinc-950 border-zinc-250 dark:border-zinc-800 ${errors.tin_number ? 'border-red-500' : ''}`}
                        />
                        {errors.tin_number && <p className="text-xs text-red-500 font-medium">{errors.tin_number}</p>}
                    </div>
                </div>

                {errors.nbe_account_no?.includes('already') || errors.tin_number?.includes('already') ? (
                    <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-500/[0.04] p-4 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-3">
                        <span className="font-semibold block mb-0.5">Duplicate Registration Detected</span>
                        A customer with this NBE account number or TIN number already exists.
                    </div>
                ) : null}
            </div>

            <DialogFooter className="border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="h-9 border-zinc-200 dark:border-zinc-800">
                    Cancel
                </Button>
                <Button type="submit" disabled={processing} className="h-9 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold">
                    {processing ? 'Registering...' : 'Register Customer'}
                </Button>
            </DialogFooter>
        </form>
    );
}
