<?php

namespace App\Http\Controllers\Fcy;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\FcyRequest;
use App\Models\PaymentMethod;
use Carbon\CarbonInterface;
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
     * Build the row data for export from a single FcyRequest.
     *
     * @return list<string>
     */
    private function buildRow(FcyRequest $req, int $serialNumber): array
    {
        return [
            (string) $serialNumber,
            $req->request_number,
            $this->financialYear($req->created_at),
            $req->created_at?->format('Y-m-d') ?? 'N/A',
            $req->customer?->branch ?? 'N/A',
            $req->customer?->importer_name ?? 'N/A',
            $req->customer?->nbe_account_no ?? 'N/A',
            $req->customer?->tin_number ?? 'N/A',
            $req->proforma_invoice_number,
            $req->proforma_invoice_date instanceof Carbon
                ? $req->proforma_invoice_date->format('Y-m-d')
                : (string) $req->proforma_invoice_date,
            $req->paymentMethod?->name ?? 'N/A',
            $req->currency?->code ?? 'N/A',
            (string) $req->fcy_amount_requested,
            (string) $req->total_amount_in_usd,
            $req->importing_items,
            $req->supplier_country,
            $req->approved_at?->format('Y-m-d') ?? 'N/A',
        ];
    }

    /**
     * Get the export column headers.
     *
     * @return list<string>
     */
    private function exportHeaders(): array
    {
        return [
            'S.NO.',
            'FOREIGN CURRENCY REQUEST QUEUE NUMBER',
            'FINANCIAL YEAR',
            'APPLICATION DATE',
            'BRANCH OF THE IMPORTER',
            'NAME OF THE IMPORTER',
            'NBE ACC.NO',
            'TIN NUMBER',
            'PROFORMA INVOICE NUMBER',
            'PROFORMA INVOICE DATE',
            'METHOD OF PAYMENT',
            'FCY TYPE',
            'FCY AMOUNT REQUESTED',
            'TOTAL AMOUNT IN USD',
            'IMPORTING ITEMS',
            'SUPPLIER COUNTRY',
            'APPROVAL DATE',
        ];
    }

    /**
     * Calculate the Ethiopian financial year (July 1 – June 30).
     * Returns a string like "2024/2025".
     */
    private function financialYear(?CarbonInterface $date): string
    {
        if ($date === null) {
            return 'N/A';
        }

        $year = (int) $date->year;
        $month = (int) $date->month;

        // Ethiopian financial year starts July (month 7)
        if ($month >= 7) {
            return "{$year}/".($year + 1);
        }

        return ($year - 1)."/{$year}";
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

            fputcsv($handle, $this->exportHeaders());

            $serialNumber = 1;
            foreach ($requests as $req) {
                fputcsv($handle, $this->buildRow($req, $serialNumber));
                $serialNumber++;
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
            $rows[] = $this->exportHeaders();

            $serialNumber = 1;
            foreach ($requests as $req) {
                $rows[] = $this->buildRow($req, $serialNumber);
                $serialNumber++;
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
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}
