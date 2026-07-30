<?php

namespace App\Http\Controllers\Fcy;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\FcyRequest;
use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Display the reports page with filter options.
     */
    public function index(Request $request): Response
    {
        $query = $this->buildQuery($request);

        $requests = $query->paginate(15)->withQueryString();

        return Inertia::render('fcy/reports/index', [
            'requests' => $requests,
            'customers' => Customer::orderBy('importer_name')->get(['id', 'importer_name']),
            'currencies' => Currency::orderBy('code')->get(['id', 'code', 'name']),
            'paymentMethods' => PaymentMethod::orderBy('name')->get(['id', 'name', 'code']),
            'filters' => $request->only(['status', 'customer_id', 'currency_id', 'payment_method_id', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Export filtered requests as CSV or Excel.
     */
    public function export(Request $request): StreamedResponse
    {
        $format = $request->input('format', 'csv');
        $query = $this->buildQuery($request);
        $requests = $query->get();
        $filename = 'fcy-requests-'.now()->format('Y-m-d-His');

        if ($format === 'excel') {
            return $this->exportExcel($requests, $filename);
        }

        return $this->exportCsv($requests, $filename);
    }

    /**
     * Build the filtered query for reports.
     */
    private function buildQuery(Request $request): Builder
    {
        $query = FcyRequest::query()
            ->with(['customer', 'currency', 'paymentMethod'])
            ->latest();

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($customerId = $request->input('customer_id')) {
            $query->where('customer_id', $customerId);
        }

        if ($currencyId = $request->input('currency_id')) {
            $query->where('currency_id', $currencyId);
        }

        if ($paymentMethodId = $request->input('payment_method_id')) {
            $query->where('payment_method_id', $paymentMethodId);
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        return $query;
    }

    /**
     * @param  Collection<int, FcyRequest>  $requests
     */
    private function exportCsv($requests, string $filename): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
        ];

        $callback = function () use ($requests): void {
            $handle = fopen('php://output', 'w');

            // Add BOM for Excel UTF-8 compatibility
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Request Number',
                'Customer Name',
                'Branch',
                'NBE Account No',
                'Proforma Invoice Number',
                'Proforma Invoice Date',
                'Payment Method',
                'Currency',
                'FCY Amount Requested',
                'Total Amount (USD)',
                'Supplier Country',
                'Importing Items',
                'Status',
                'Created At',
            ]);

            foreach ($requests as $req) {
                fputcsv($handle, [
                    $req->request_number,
                    $req->customer?->importer_name ?? 'N/A',
                    $req->customer?->branch ?? 'N/A',
                    $req->customer?->nbe_account_no ?? 'N/A',
                    $req->proforma_invoice_number,
                    $req->proforma_invoice_date instanceof Carbon
                        ? $req->proforma_invoice_date->format('Y-m-d')
                        : $req->proforma_invoice_date,
                    $req->paymentMethod?->code ?? $req->paymentMethod?->name ?? 'N/A',
                    $req->currency?->code ?? 'N/A',
                    $req->fcy_amount_requested,
                    $req->total_amount_in_usd,
                    $req->supplier_country,
                    $req->importing_items,
                    ucfirst(str_replace('_', ' ', $req->status)),
                    $req->created_at?->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * @param  Collection<int, FcyRequest>  $requests
     */
    private function exportExcel($requests, string $filename): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'application/vnd.ms-excel',
            'Content-Disposition' => "attachment; filename=\"{$filename}.xls\"",
        ];

        $callback = function () use ($requests): void {
            $rows = [];

            // Header row
            $rows[] = [
                'Request Number',
                'Customer Name',
                'Branch',
                'NBE Account No',
                'Proforma Invoice Number',
                'Proforma Invoice Date',
                'Payment Method',
                'Currency',
                'FCY Amount Requested',
                'Total Amount (USD)',
                'Supplier Country',
                'Importing Items',
                'Status',
                'Created At',
            ];

            foreach ($requests as $req) {
                $rows[] = [
                    $req->request_number,
                    $req->customer?->importer_name ?? 'N/A',
                    $req->customer?->branch ?? 'N/A',
                    $req->customer?->nbe_account_no ?? 'N/A',
                    $req->proforma_invoice_number,
                    $req->proforma_invoice_date instanceof Carbon
                        ? $req->proforma_invoice_date->format('Y-m-d')
                        : $req->proforma_invoice_date,
                    $req->paymentMethod?->code ?? $req->paymentMethod?->name ?? 'N/A',
                    $req->currency?->code ?? 'N/A',
                    $req->fcy_amount_requested,
                    $req->total_amount_in_usd,
                    $req->supplier_country,
                    $req->importing_items,
                    ucfirst(str_replace('_', ' ', $req->status)),
                    $req->created_at?->format('Y-m-d H:i:s'),
                ];
            }

            echo $this->buildExcelXml($rows);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Build a SpreadsheetML XML document that opens natively in Excel.
     *
     * @param  array<int, array<int, string>>  $rows
     */
    private function buildExcelXml(array $rows): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<?mso-application progid="Excel.Sheet"?>'."\n";
        $xml .= '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"';
        $xml .= ' xmlns:o="urn:schemas-microsoft-com:office:office"';
        $xml .= ' xmlns:x="urn:schemas-microsoft-com:office:excel"';
        $xml .= ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"';
        $xml .= ' xmlns:html="http://www.w3.org/TR/REC-html40">'."\n";

        // Styles
        $xml .= '<Styles>';
        $xml .= '<Style ss:ID="Header"><Font ss:Bold="1"/><Interior ss:Color="#D9D9D9" ss:Pattern="Solid"/></Style>';
        $xml .= '</Styles>'."\n";

        $xml .= '<Worksheet ss:Name="FCY Requests">'."\n";
        $xml .= '<Table>'."\n";

        foreach ($rows as $rowIndex => $row) {
            $xml .= '<Row>';
            foreach ($row as $cell) {
                $style = $rowIndex === 0 ? ' ss:StyleID="Header"' : '';
                $xml .= '<Cell'.$style.'><Data ss:Type="String">'.$this->escapeXml((string) $cell).'</Data></Cell>';
            }
            $xml .= '</Row>'."\n";
        }

        $xml .= '</Table>'."\n";
        $xml .= '</Worksheet>'."\n";
        $xml .= '</Workbook>';

        return $xml;
    }

    private function escapeXml(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
