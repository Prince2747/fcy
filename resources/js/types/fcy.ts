export type Customer = {
    id: number;
    branch: string;
    importer_name: string;
    nbe_account_no: string;
    tin_number: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
};

export type CustomerFormData = {
    branch: string;
    importer_name: string;
    nbe_account_no: string;
    tin_number: string;
};

export type Currency = {
    id: number;
    code: string;
    name: string;
    symbol: string | null;
};

export type PaymentMethod = {
    id: number;
    name: string;
    code: string | null;
};

export type FcyRequest = {
    id: number;
    request_number: string;
    customer_id: number;
    customer: Customer | null;
    proforma_invoice_number: string;
    proforma_invoice_date: string;
    payment_method_id: number;
    payment_method: PaymentMethod | null;
    currency_id: number;
    currency: Currency | null;
    fcy_amount_requested: string | number;
    total_amount_in_usd: string | number;
    importing_items: string;
    supplier_country: string;
    status: FcyRequestStatus;
    maker_id: string;
    checker_id: string | null;
    approver_id: string | null;
    maker_notes: string | null;
    checker_notes: string | null;
    approver_notes: string | null;
    checked_at: string | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
};

export type FcyRequestStatus =
    | 'draft'
    | 'pending_checker'
    | 'pending_approver'
    | 'approved'
    | 'rejected_by_checker'
    | 'rejected_by_approver';

export type FcyRequestFormData = {
    customer_id: number | '';
    proforma_invoice_number: string;
    proforma_invoice_date: string;
    payment_method_id: number | '';
    currency_id: number | '';
    fcy_amount_requested: string;
    total_amount_in_usd: string;
    importing_items: string;
    supplier_country: string;
    maker_notes: string;
};

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type NotificationData = {
    type: NotificationType;
    title: string;
    message: string;
    request_id: number;
    request_number: string;
};

export type AppNotification = {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
    updated_at: string;
};
