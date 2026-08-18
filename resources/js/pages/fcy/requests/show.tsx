
import { Head, Link, router, usePage, setLayoutProps } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Send,
    FileText,
    Clock,
    FileCheck,
    FileX,
    Pencil,
    Printer,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import fcy from '@/routes/fcy';
import type { FcyRequest, FcyRequestStatus, BreadcrumbItem } from '@/types';

interface ShowProps {
    request: FcyRequest;
    maker: string | null;
    checker: string | null;
    approver: string | null;
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
        color: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20',
    },
    pending_checker: {
        label: 'Pending Checker',
        icon: Clock,
        color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    },
    pending_approver: {
        label: 'Pending Approver',
        icon: Clock,
        color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    },
    approved: {
        label: 'Approved',
        icon: CheckCircle,
        color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    },
    rejected_by_checker: {
        label: 'Rejected by Checker',
        icon: FileX,
        color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    },
    rejected_by_approver: {
        label: 'Rejected by Approver',
        icon: XCircle,
        color: 'bg-red-700/10 text-red-800 dark:text-red-500 border-red-700/20',
    },
};

export default function Show({
    request,
    maker,
    checker,
    approver,
    userRoles,
}: ShowProps) {
    const { auth } = usePage().props as {
        auth: {
            user: {
                id: number | string;
                name: string;
            };
        };
    };

    const user = auth.user;
    const [notes, setNotes] = useState('');

    const statusKey =
        request.status && statusConfig[request.status]
            ? request.status
            : 'draft';

    const StatusIcon = statusConfig[statusKey].icon;

    const isMaker = String(user.id) === request.maker_id;

    const canEdit =
        isMaker &&
        (request.status === 'draft' ||
            request.status === 'rejected_by_checker');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'FCY Requests',
            href: '/fcy/requests',
        },
        {
            title: request.request_number,
            href: `/fcy/requests/${request.id}`,
        },
    ];

    setLayoutProps({ breadcrumbs });

    function canMakerSubmit(): boolean {
        return (
            isMaker &&
            (request.status === 'draft' ||
                request.status === 'rejected_by_checker')
        );
    }

    function canCheckerAct(): boolean {
        return (
            request.status === 'pending_checker' &&
            !isMaker &&
            userRoles.includes('fcychecker')
        );
    }

    function canApproverAct(): boolean {
        return (
            request.status === 'pending_approver' &&
            userRoles.includes('fcyapprover')
        );
    }

    function handleAction(action: string) {
        if (action === 'submit') {
            router.post(
                fcy.requests.submit(request.id).url,
                {
                    maker_notes: notes || undefined,
                }
            );
        } else if (action === 'check') {
            router.post(
                fcy.requests.check(request.id).url,
                {
                    checker_notes: notes || undefined,
                }
            );
        } else if (action === 'rejectCheck') {
            router.post(
                fcy.requests.rejectCheck(request.id).url,
                {
                    checker_notes: notes,
                }
            );
        } else if (action === 'approve') {
            router.post(
                fcy.requests.approve(request.id).url,
                {
                    approver_notes: notes || undefined,
                }
            );
        } else if (action === 'reject') {
            router.post(
                fcy.requests.reject(request.id).url,
                {
                    approver_notes: notes,
                }
            );
        }
    }

    return (
        <>
            <Head title={request.request_number} />

            <div className="print-area flex flex-col gap-4 p-5">
                {/* Bank Letterhead */}
                <div className="flex items-center justify-between gap-4 border-b border-zinc-200/80 pb-3 dark:border-zinc-800/80">
                    <div className="flex min-w-0 items-center gap-3">
                        <img
                            src="/mainlogo.png"
                            alt="Bank Logo"
                            className="h-12 w-auto shrink-0 object-contain"
                        />
                        <div className="min-w-0">
                            <p className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                                International Banking Service Department
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Foreign Currency (FCY) Request
                            </p>
                        </div>
                    </div>

                    <p className="hidden text-right text-xs text-zinc-500 dark:text-zinc-400 md:block">
                        {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <Link
                            href={fcy.requests.index().url}
                            className="print:hidden"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate font-mono text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                    {request.request_number}
                                </h1>

                                <Badge
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium ${statusConfig[statusKey].color}`}
                                >
                                    <StatusIcon className="h-3 w-3" />
                                    {statusConfig[statusKey].label}
                                </Badge>
                            </div>

                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Created on{' '}
                                {new Date(
                                    request.created_at
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="print:hidden flex items-center gap-2">
                        {canEdit && (
                            <Link
                                href={
                                    fcy.requests.edit({
                                        fcyRequest: request.id,
                                    }).url
                                }
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5 px-3"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit Request
                                </Button>
                            </Link>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 px-3"
                            onClick={() => window.print()}
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print
                        </Button>
                    </div>
                </div>

                {/* Request Details */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Customer Information */}
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                        <CardHeader className="px-4 py-3">
                            <CardTitle className="text-sm font-semibold">
                                Customer Information
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2.5 px-4 pb-4">
                            <div>
                                <Label className="text-[11px] text-zinc-500">
                                    Importer Name
                                </Label>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                    {request.customer?.importer_name}
                                </p>
                            </div>

                            <div>
                                <Label className="text-[11px] text-zinc-500">
                                    Branch
                                </Label>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                    {request.customer?.branch}
                                </p>
                            </div>

                            <div>
                                <Label className="text-[11px] text-zinc-500">
                                    NBE Account No
                                </Label>
                                <p className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                                    {request.customer?.nbe_account_no}
                                </p>
                            </div>

                            <div>
                                <Label className="text-[11px] text-zinc-500">
                                    Supplier Country
                                </Label>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                    {request.supplier_country}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Proforma Invoice */}
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                        <CardHeader className="px-4 py-3">
                            <CardTitle className="text-sm font-semibold">
                                Proforma Invoice
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2.5 px-4 pb-4">
                            <div>
                                <Label className="text-[11px] text-zinc-500">
                                    Invoice Number
                                </Label>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                    {request.proforma_invoice_number}
                                </p>
                            </div>

                            <div>
                                <Label className="text-[11px] text-zinc-500">
                                    Invoice Date
                                </Label>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                    {new Date(
                                        request.proforma_invoice_date
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <Label className="text-[11px] text-zinc-500">
                                    Payment Method
                                </Label>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                    {request.payment_method?.code ??
                                        request.payment_method?.name}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Currency & Amount */}
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                        <CardHeader className="px-4 py-3">
                            <CardTitle className="text-sm font-semibold">
                                Currency & Amount
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2.5 px-4 pb-4">
                            <div>
                                <Label className="text-[11px] text-zinc-500">
                                    Currency
                                </Label>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                    {request.currency?.code} -{' '}
                                    {request.currency?.name}
                                </p>
                            </div>

                            <div>
                                <Label className="text-[11px] text-zinc-500">
                                    FCY Amount Requested
                                </Label>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                    {Number(
                                        request.fcy_amount_requested
                                    ).toLocaleString()}{' '}
                                    {request.currency?.code}
                                </p>
                            </div>

                            <div>
                                <Label className="text-[11px] text-zinc-500">
                                    Total Amount in USD
                                </Label>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                    ${' '}
                                    {Number(
                                        request.total_amount_in_usd
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Import Items */}
                    <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                        <CardHeader className="px-4 py-3">
                            <CardTitle className="text-sm font-semibold">
                                Import Items
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 pb-4">
                            <p className="whitespace-pre-wrap text-sm leading-5 text-zinc-700 dark:text-zinc-300">
                                {request.importing_items}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Activity & Notes */}
                <Card className="print:hidden border border-zinc-200/80 dark:border-zinc-800/80">
                    <CardHeader className="px-4 py-3">
                        <CardTitle className="text-sm font-semibold">
                            Activity & Notes
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2 px-4 pb-4">
                        {request.maker_notes && (
                            <div className="flex gap-2.5 rounded-md border border-zinc-100 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/30">
                                <div className="mt-0.5 shrink-0">
                                    <FileText className="h-4 w-4 text-zinc-400" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold text-zinc-500">
                                        Maker Notes
                                    </p>

                                    <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">
                                        {request.maker_notes}
                                    </p>
                                </div>
                            </div>
                        )}

                        {request.checker_notes && (
                            <div className="flex gap-2.5 rounded-md border border-amber-100 bg-amber-50 p-2.5 dark:border-amber-900/30 dark:bg-amber-950/20">
                                <div className="mt-0.5 shrink-0">
                                    <FileCheck className="h-4 w-4 text-amber-500" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold text-amber-600">
                                        Checker Notes{' '}
                                        {request.checked_at &&
                                            `(${new Date(
                                                request.checked_at
                                            ).toLocaleDateString()})`}
                                    </p>

                                    <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">
                                        {request.checker_notes}
                                    </p>
                                </div>
                            </div>
                        )}

                        {request.approver_notes && (
                            <div className="flex gap-2.5 rounded-md border border-blue-100 bg-blue-50 p-2.5 dark:border-blue-900/30 dark:bg-blue-950/20">
                                <div className="mt-0.5 shrink-0">
                                    <CheckCircle className="h-4 w-4 text-blue-500" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold text-blue-600">
                                        Approver Notes{' '}
                                        {request.approved_at &&
                                            `(${new Date(
                                                request.approved_at
                                            ).toLocaleDateString()})`}
                                    </p>

                                    <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">
                                        {request.approver_notes}
                                    </p>
                                </div>
                            </div>
                        )}

                        {!request.maker_notes &&
                            !request.checker_notes &&
                            !request.approver_notes && (
                                <p className="py-3 text-center text-sm text-zinc-500">
                                    No notes added yet.
                                </p>
                            )}
                    </CardContent>
                </Card>

                {/* Signatures / Approval */}
                <Card className="border border-zinc-200/80 dark:border-zinc-800/80">
                    <CardHeader className="px-4 py-3">
                        <CardTitle className="text-sm font-semibold">
                            Signatures / Approval
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="px-4 pb-4">
                        <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-2 last:border-b-0 dark:border-zinc-800">
                            <div className="min-w-0">
                                <Label className="text-[11px] text-zinc-500">
                                    Prepared By (Maker)
                                </Label>
                                <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">
                                    {maker ?? '—'}
                                </p>
                            </div>
                            <p className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                                {new Date(request.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-2 last:border-b-0 dark:border-zinc-800">
                            <div className="min-w-0">
                                <Label className="text-[11px] text-zinc-500">
                                    Checked By
                                </Label>
                                <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">
                                    {checker ?? '—'}
                                </p>
                            </div>
                            <p className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                                {request.checked_at
                                    ? new Date(
                                          request.checked_at
                                      ).toLocaleDateString()
                                    : 'Pending'}
                            </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-b border-zinc-100 py-2 last:border-b-0 dark:border-zinc-800">
                            <div className="min-w-0">
                                <Label className="text-[11px] text-zinc-500">
                                    Authorized By (Approver)
                                </Label>
                                <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">
                                    {approver ?? '—'}
                                </p>
                            </div>
                            <p className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                                {request.approved_at
                                    ? new Date(
                                          request.approved_at
                                      ).toLocaleDateString()
                                    : 'Pending'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Workflow Actions */}
                {(canMakerSubmit() ||
                    canCheckerAct() ||
                    canApproverAct()) && (
                    <Card className="print:hidden border border-zinc-200/80 dark:border-zinc-800/80">
                        <CardHeader className="px-4 py-3">
                            <CardTitle className="text-sm font-semibold">
                                Actions
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 px-4 pb-4">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="action_notes"
                                    className="text-xs"
                                >
                                    {canCheckerAct() && 'Checker '}
                                    {canApproverAct() && 'Approver '}
                                    Notes{' '}
                                    {canCheckerAct() || canApproverAct()
                                        ? '(Required for rejection)'
                                        : '(Optional)'}
                                </Label>

                                <textarea
                                    id="action_notes"
                                    rows={2}
                                    className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                    value={notes}
                                    onChange={(e) =>
                                        setNotes(e.target.value)
                                    }
                                    placeholder="Add notes..."
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {canMakerSubmit() && (
                                    <Button
                                        onClick={() =>
                                            handleAction('submit')
                                        }
                                        size="sm"
                                        className="h-8 gap-1.5 px-3"
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        Submit for Checking
                                    </Button>
                                )}

                                {canCheckerAct() && (
                                    <>
                                        <Button
                                            onClick={() =>
                                                handleAction('check')
                                            }
                                            variant="default"
                                            size="sm"
                                            className="h-8 gap-1.5 bg-emerald-600 px-3 hover:bg-emerald-700"
                                        >
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            Approve & Forward
                                        </Button>

                                        <Button
                                            onClick={() =>
                                                handleAction('rejectCheck')
                                            }
                                            variant="destructive"
                                            size="sm"
                                            className="h-8 gap-1.5 px-3"
                                        >
                                            <XCircle className="h-3.5 w-3.5" />
                                            Reject (Send Back)
                                        </Button>
                                    </>
                                )}

                                {canApproverAct() && (
                                    <>
                                        <Button
                                            onClick={() =>
                                                handleAction('approve')
                                            }
                                            variant="default"
                                            size="sm"
                                            className="h-8 gap-1.5 bg-emerald-600 px-3 hover:bg-emerald-700"
                                        >
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            Approve
                                        </Button>

                                        <Button
                                            onClick={() =>
                                                handleAction('reject')
                                            }
                                            variant="destructive"
                                            size="sm"
                                            className="h-8 gap-1.5 px-3"
                                        >
                                            <XCircle className="h-3.5 w-3.5" />
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
