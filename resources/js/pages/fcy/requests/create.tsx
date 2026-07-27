import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import fcy from '@/routes/fcy';
import type { Currency, Customer, FcyRequestFormData, PaymentMethod } from '@/types';
import { type BreadcrumbItem } from '@/types';

interface CreateProps {
    customers: Customer[];
    currencies: Currency[];
    paymentMethods: PaymentMethod[];
}

export default function Create({ customers, currencies, paymentMethods }: CreateProps) {
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

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'FCY Requests', href: '/fcy/requests' },
        { title: 'New Request', href: '/fcy/requests/create' },
    ];

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
                                    <Select
                                        value={data.customer_id.toString()}
                                        onValueChange={(value) => setData('customer_id', Number(value))}
                                    >
                                        <SelectTrigger>
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
        </>
    );
}
