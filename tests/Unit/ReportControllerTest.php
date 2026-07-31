<?php

namespace Tests\Unit;

use App\Http\Controllers\Fcy\ReportController;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;

class ReportControllerTest extends TestCase
{
    public function test_financial_year_accepts_immutable_carbon_dates(): void
    {
        $controller = new ReportController;
        $method = new \ReflectionMethod($controller, 'financialYear');
        $method->setAccessible(true);

        $result = $method->invoke($controller, CarbonImmutable::parse('2024-07-01'));

        $this->assertSame('2024/2025', $result);
    }
}
