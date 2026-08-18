<?php

namespace Tests\Feature\FCY;

use App\Http\Controllers\Fcy\ReportController;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\FcyRequest;
use App\Models\HrUser;
use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use ReflectionMethod;
use Tests\TestCase;

class ReportExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_build_row_uppercases_all_text_cells(): void
    {
        $customer = new Customer([
            'branch' => 'Addis Ababa Main Branch',
            'importer_name' => 'Abebe Import & Export Co.',
            'nbe_account_no' => 'NBE-1234',
            'tin_number' => '1234-5678',
        ]);

        $paymentMethod = new PaymentMethod(['name' => 'Letter of Credit']);
        $currency = new Currency(['code' => 'usd']);

        $request = new FcyRequest([
            'request_number' => 'GDA-FCY-0000000007',
            'proforma_invoice_number' => 'PI-0001',
            'proforma_invoice_date' => '2024-07-01',
            'fcy_amount_requested' => 12345.6,
            'total_amount_in_usd' => 9876543.21,
            'importing_items' => 'Cement and Steel Products',
            'supplier_country' => 'Turkey',
        ]);
        $request->setRelation('customer', $customer);
        $request->setRelation('paymentMethod', $paymentMethod);
        $request->setRelation('currency', $currency);

        $controller = new ReportController;
        $method = new ReflectionMethod($controller, 'buildRow');
        $method->setAccessible(true);

        $row = $method->invoke($controller, $request, 1);

        // Importer name is the 6th cell (index 5).
        $this->assertSame('ABEBE IMPORT & EXPORT CO.', $row[5]);
        $this->assertSame('ADDIS ABABA MAIN BRANCH', $row[4]);
        $this->assertSame('CEMENT AND STEEL PRODUCTS', $row[14]);
        $this->assertSame('TURKEY', $row[15]);
        $this->assertSame('LETTER OF CREDIT', $row[10]);

        // Monetary amounts (indices 12 and 13) must carry thousands separators.
        $this->assertSame('12,345.60', $row[12]);
        $this->assertSame('9,876,543.21', $row[13]);
        $this->assertSame('1', $row[0], 'Serial number should not be comma-formatted.');

        // Every cell must be entirely uppercase.
        foreach ($row as $cell) {
            $this->assertSame(mb_strtoupper($cell), $cell, "Cell was not uppercased: {$cell}");
        }
    }

    public function test_build_excel_xml_emits_amounts_as_numeric_cells(): void
    {
        $controller = new ReportController;
        $method = new ReflectionMethod($controller, 'buildExcelXml');
        $method->setAccessible(true);

        $header = array_fill(0, 14, 'HEADER');
        $dataRow = array_fill(0, 14, 'X');
        $header[12] = 'FCY AMOUNT REQUESTED';
        $header[13] = 'TOTAL AMOUNT IN USD';
        $dataRow[0] = '1';
        $dataRow[12] = '12,345.60';
        $dataRow[13] = '9,876,543.21';

        $rows = [$header, $dataRow];

        $xml = $method->invoke($controller, $rows);

        // Number format style with thousands separators is present.
        $this->assertStringContainsString('<NumberFormat ss:Format="#,##0.00"/>', $xml);

        // Amount cells are exported as real numbers.
        $this->assertStringContainsString('<Data ss:Type="Number">12345.60</Data>', $xml);
        $this->assertStringContainsString('<Data ss:Type="Number">9876543.21</Data>', $xml);

        // The numeric style is applied to the amount cells.
        $this->assertStringContainsString('<Cell ss:StyleID="Number"><Data ss:Type="Number">12345.60</Data>', $xml);

        // Non-numeric data cells remain plain strings.
        $this->assertStringContainsString('<Cell><Data ss:Type="String">X</Data></Cell>', $xml);
    }

    public function test_build_totals_row_sums_both_amount_columns(): void
    {
        $first = new FcyRequest([
            'fcy_amount_requested' => 100.25,
            'total_amount_in_usd' => 1000.50,
        ]);

        $second = new FcyRequest([
            'fcy_amount_requested' => 200.75,
            'total_amount_in_usd' => 2000.50,
        ]);

        $controller = new ReportController;
        $method = new ReflectionMethod($controller, 'buildTotalsRow');
        $method->setAccessible(true);

        $row = $method->invoke($controller, new Collection([$first, $second]));

        $this->assertCount(17, $row);
        $this->assertSame('TOTAL', $row[0]);
        $this->assertSame('301.00', $row[12]);
        $this->assertSame('3,001.00', $row[13]);
        $this->assertSame('', $row[1]);
        $this->assertSame('', $row[14]);
    }

    public function test_build_excel_xml_renders_totals_row_as_bold(): void
    {
        $controller = new ReportController;
        $method = new ReflectionMethod($controller, 'buildExcelXml');
        $method->setAccessible(true);

        $header = array_fill(0, 17, 'HEADER');
        $header[12] = 'FCY AMOUNT REQUESTED';
        $header[13] = 'TOTAL AMOUNT IN USD';

        $dataRow = array_fill(0, 17, '');
        $dataRow[0] = '1';
        $dataRow[12] = '12,345.60';
        $dataRow[13] = '9,876,543.21';

        $totalsRow = array_fill(0, 17, '');
        $totalsRow[0] = 'TOTAL';
        $totalsRow[12] = '13,000.00';
        $totalsRow[13] = '9,876,543.21';

        $xml = $method->invoke($controller, [$header, $dataRow, $totalsRow]);

        $this->assertStringContainsString('<Style ss:ID="Bold"><Font ss:Bold="1"/></Style>', $xml);
        $this->assertStringContainsString('<Style ss:ID="BoldNumber"><Font ss:Bold="1"/><NumberFormat ss:Format="#,##0.00"/></Style>', $xml);

        // The totals label and empty totals cells are bold.
        $this->assertStringContainsString('<Cell ss:StyleID="Bold"><Data ss:Type="String">TOTAL</Data></Cell>', $xml);

        // The totals row amount cells are bold numeric cells.
        $this->assertStringContainsString('<Cell ss:StyleID="BoldNumber"><Data ss:Type="Number">13000.00</Data></Cell>', $xml);
        $this->assertStringContainsString('<Cell ss:StyleID="BoldNumber"><Data ss:Type="Number">9876543.21</Data></Cell>', $xml);

        // Regular data rows keep their existing styling.
        $this->assertStringContainsString('<Cell ss:StyleID="Number"><Data ss:Type="Number">12345.60</Data></Cell>', $xml);
    }

    public function test_export_csv_includes_totals_row(): void
    {
        $user = new HrUser([
            'id' => 999,
            'userId' => 'test.user',
            'username' => 'test.user',
            'firstname' => 'Test',
            'lastname' => 'User',
        ]);

        FcyRequest::factory()->create([
            'request_number' => 'GDA-FCY-0000000001',
            'fcy_amount_requested' => 100.25,
            'total_amount_in_usd' => 1000.50,
        ]);

        FcyRequest::factory()->create([
            'request_number' => 'GDA-FCY-0000000002',
            'fcy_amount_requested' => 200.75,
            'total_amount_in_usd' => 2000.50,
        ]);

        $response = $this->actingAs($user)->get(route('fcy.reports.export', ['format' => 'csv']));

        $response->assertOk();

        ob_start();
        $response->baseResponse->sendContent();
        $csv = ob_get_clean();

        $this->assertStringContainsString('301.00', $csv);
        $this->assertStringContainsString('"3,001.00"', $csv);
    }

    public function test_export_excel_includes_totals_row(): void
    {
        $user = new HrUser([
            'id' => 999,
            'userId' => 'test.user',
            'username' => 'test.user',
            'firstname' => 'Test',
            'lastname' => 'User',
        ]);

        FcyRequest::factory()->create([
            'request_number' => 'GDA-FCY-0000000001',
            'fcy_amount_requested' => 100.25,
            'total_amount_in_usd' => 1000.50,
        ]);

        FcyRequest::factory()->create([
            'request_number' => 'GDA-FCY-0000000002',
            'fcy_amount_requested' => 200.75,
            'total_amount_in_usd' => 2000.50,
        ]);

        $response = $this->actingAs($user)->get(route('fcy.reports.export', ['format' => 'excel']));

        $response->assertOk();

        ob_start();
        $response->baseResponse->sendContent();
        $xml = ob_get_clean();

        $this->assertStringContainsString('<Cell ss:StyleID="Bold"><Data ss:Type="String">TOTAL</Data></Cell>', $xml);
        $this->assertStringContainsString('<Cell ss:StyleID="BoldNumber"><Data ss:Type="Number">301.00</Data></Cell>', $xml);
        $this->assertStringContainsString('<Cell ss:StyleID="BoldNumber"><Data ss:Type="Number">3001.00</Data></Cell>', $xml);
    }
}
