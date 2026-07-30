import { Head, Link, router, usePage, setLayoutProps } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, XCircle, Send, FileText, Clock, FileCheck, FileX, Building2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FcyRequest, FcyRequestStatus } from '@/types';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import fcy from '@/routes/fcy';

interface ShowProps {
    request: FcyRequest;
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

export default function Show({ request, userRoles }: ShowProps) {
    const { auth } = usePage().props as { auth: { user: { id: number | string; name: string } } };
    const user = auth.user;
    const [notes, setNotes] = useState('');

    const statusKey = request.status && statusConfig[request.status] ? request.status : 'draft';
    const StatusIcon = statusConfig[statusKey].icon;
    const isMaker = String(user.id) === request.maker_id;
    const canEdit = isMaker && (request.status === 'draft' || request.status === 'rejected_by_checker');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'FCY Requests', href: '/fcy/requests' },
        { title: request.request_number, href: `/fcy/requests/${request.id}` },
    ];

    setLayoutProps({ breadcrumbs });

    function canMakerSubmit(): boolean {
        return isMaker && (request.status === 'draft' || request.status === 'rejected_by_checker');
    }

    function canCheckerAct(): boolean {
        return request.status === 'pending_checker' && !isMaker && userRoles.includes('fcychecker');
    }

    function canApproverAct(): boolean {
        return request.status === 'pending_approver' && userRoles.includes('fcyapprover');
    }

    function handleAction(action: string) {
        if (action === 'submit') {
            router.post(fcy.requests.submit(request.id).url, { maker_notes: notes || undefined });
        } else if (action === 'check') {
            router.post(fcy.requests.check(request.id).url, { checker_notes: notes || undefined });
        } else if (action === 'rejectCheck') {
            router.post(fcy.requests.rejectCheck(request.id).url, { checker_notes: notes });
        } else if (action === 'approve') {
            router.post(fcy.requests.approve(request.id).url, { approver_notes: notes || undefined });
        } else if (action === 'reject') {
            router.post(fcy.requests.reject(request.id).url, { approver_notes: notes });
        }
    }

    return (
        <>
            <Head title={request.request_number} />

            <div className="flex flex-col gap-6 p-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={fcy.requests.index().url}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-mono">
                                    {request.request_number}
                                </h1>
                                <Badge className={`inline-flex items-center gap-1.5 font-medium px-2.5 py-1 ${statusConfig[statusKey].color}`}>
                                    <StatusIcon className="h-3.5 w-3.5" />
                                    {statusConfig[statusKey].label}
                                </Badge>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                Created on {new Date(request.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    {canEdit && (
                        <Link href={fcy.requests.edit({ fcyRequest: request.id }).url}>
                            <Button variant="outline" className="gap-2">
                                <Pencil className="h-4 w-4" />
                                Edit Request
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Request Details */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Customer Info */}
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                        <CardHeader>
                            <CardTitle className="text-base">Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <Label className="text-xs text-zinc-500">Importer Name</Label>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">{request.customer?.importer_name}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-zinc-500">Branch</Label>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">{request.customer?.branch}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-zinc-500">NBE Account No</Label>
                                <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300">{request.customer?.nbe_account_no}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-zinc-500">Supplier Country</Label>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">{request.supplier_country}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invoice Info */}
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                        <CardHeader>
                            <CardTitle className="text-base">Proforma Invoice</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <Label className="text-xs text-zinc-500">Invoice Number</Label>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">{request.proforma_invoice_number}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-zinc-500">Invoice Date</Label>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">{new Date(request.proforma_invoice_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-zinc-500">Payment Method</Label>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">{request.payment_method?.code ?? request.payment_method?.name}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Currency & Amount */}
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                        <CardHeader>
                            <CardTitle className="text-base">Currency & Amount</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <Label className="text-xs text-zinc-500">Currency</Label>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">{request.currency?.code} - {request.currency?.name}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-zinc-500">FCY Amount Requested</Label>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">{Number(request.fcy_amount_requested).toLocaleString()} {request.currency?.code}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-zinc-500">Total Amount in USD</Label>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">$ {Number(request.total_amount_in_usd).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                        <CardHeader>
                            <CardTitle className="text-base">Import Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{request.importing_items}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Notes Timeline */}
                <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                    <CardHeader>
                        <CardTitle className="text-base">Activity & Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {request.maker_notes && (
                            <div className="flex gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                                <div className="flex-shrink-0 mt-1">
                                    <FileText className="h-4 w-4 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-zinc-500">Maker Notes</p>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5">{request.maker_notes}</p>
                                </div>
                            </div>
                        )}
                        {request.checker_notes && (
                            <div className="flex gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                                <div className="flex-shrink-0 mt-1">
                                    <FileCheck className="h-4 w-4 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-amber-600">Checker Notes {request.checked_at && `(${new Date(request.checked_at).toLocaleDateString()})`}</p>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5">{request.checker_notes}</p>
                                </div>
                            </div>
                        )}
                        {request.approver_notes && (
                            <div className="flex gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                                <div className="flex-shrink-0 mt-1">
                                    <CheckCircle className="h-4 w-4 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-blue-600">Approver Notes {request.approved_at && `(${new Date(request.approved_at).toLocaleDateString()})`}</p>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5">{request.approver_notes}</p>
                                </div>
                            </div>
                        )}
                        {!request.maker_notes && !request.checker_notes && !request.approver_notes && (
                            <p className="text-sm text-zinc-500 text-center py-4">No notes added yet.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Workflow Actions */}
                {(canMakerSubmit() || canCheckerAct() || canApproverAct()) && (
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                        <CardHeader>
                            <CardTitle className="text-base">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="action_notes">
                                    {canCheckerAct() && 'Checker '}
                                    {canApproverAct() && 'Approver '}
                                    Notes {canCheckerAct() || canApproverAct() ? '(Required for rejection)' : '(Optional)'}
                                </Label>
                                <textarea
                                    id="action_notes"
                                    rows={3}
                                    className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add notes..."
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {canMakerSubmit() && (
                                    <Button onClick={() => handleAction('submit')} className="gap-2">
                                        <Send className="h-4 w-4" />
                                        Submit for Checking
                                    </Button>
                                )}
                                {canCheckerAct() && (
                                    <>
                                        <Button onClick={() => handleAction('check')} variant="default" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                                            <CheckCircle className="h-4 w-4" />
                                            Approve & Forward
                                        </Button>
                                        <Button onClick={() => handleAction('rejectCheck')} variant="destructive" className="gap-2">
                                            <XCircle className="h-4 w-4" />
                                            Reject (Send Back)
                                        </Button>
                                    </>
                                )}
                                {canApproverAct() && (
                                    <>
                                        <Button onClick={() => handleAction('approve')} variant="default" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                                            <CheckCircle className="h-4 w-4" />
                                            Approve
                                        </Button>
                                        <Button onClick={() => handleAction('reject')} variant="destructive" className="gap-2">
                                            <XCircle className="h-4 w-4" />
                                            Reject (Final)
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
