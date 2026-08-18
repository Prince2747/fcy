<?php

namespace Tests\Feature\FCY;

use App\Models\FcyRequest;
use App\Models\HrUser;
use Illuminate\Database\Query\Grammars\SQLiteGrammar as QueryGrammar;
use Illuminate\Database\Schema\Grammars\SQLiteGrammar as SchemaGrammar;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class FcyRequestShowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Point the external HR connection at an in-memory SQLite database so the
        // test does not depend on the live SQL Server instance used in production.
        Config::set('database.connections.hr', [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
            'foreign_key_constraints' => false,
        ]);

        DB::purge('hr');

        // The HR models use dotted table names (e.g. "Gadaa-Hr1.dbo.users"). SQL Server
        // requires those to be treated as schema-qualified, but SQLite treats the whole
        // dotted string as a single quoted identifier. Override the connection grammars
        // so the name is not split on "." during the test.
        $connection = DB::connection('hr');
        $connection->setQueryGrammar($this->unsplitQueryGrammar());
        $connection->setSchemaGrammar($this->unsplitSchemaGrammar());

        Schema::connection('hr')->create('Gadaa-Hr1.dbo.users', function ($table) {
            $table->id();
            $table->string('username');
            $table->string('password');
            $table->string('firstname');
            $table->string('middlename');
            $table->string('lastname');
            $table->string('email')->nullable();
            $table->string('remember_token')->nullable();
            $table->timestamps();
        });

        Schema::connection('hr')->create('Gadaa-Hr1.dbo.roles', function ($table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::connection('hr')->create('Gadaa-Hr1.dbo.users_roles', function ($table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('role_id');
        });
    }

    public function test_show_page_renders_maker_checker_and_approver_names(): void
    {
        $actor = HrUser::factory()->create();
        $maker = HrUser::factory()->create();
        $checker = HrUser::factory()->create();
        $approver = HrUser::factory()->create();

        $this->actingAs($actor);

        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker->id,
            'checker_id' => (string) $checker->id,
            'approver_id' => (string) $approver->id,
            'checked_at' => now()->subDay(),
            'approved_at' => now(),
            'status' => FcyRequest::STATUS_APPROVED,
        ]);

        $response = $this->get(route('fcy.requests.show', $request));

        $response->assertOk();

        $response->assertInertia(fn ($page) => $page
            ->where('maker', $maker->name)
            ->where('checker', $checker->name)
            ->where('approver', $approver->name));
    }

    public function test_show_page_renders_null_names_when_no_approval_occurred(): void
    {
        $actor = HrUser::factory()->create();

        $this->actingAs($actor);

        $request = FcyRequest::factory()->create([
            'maker_id' => '999999',
            'checker_id' => null,
            'approver_id' => null,
            'status' => FcyRequest::STATUS_DRAFT,
        ]);

        $response = $this->get(route('fcy.requests.show', $request));

        $response->assertOk();

        $response->assertInertia(fn ($page) => $page
            ->where('maker', null)
            ->where('checker', null)
            ->where('approver', null));
    }

    private function unsplitQueryGrammar(): QueryGrammar
    {
        return new class extends QueryGrammar
        {
            public function wrapTable($table, $prefix = null): string
            {
                if ($this->isExpression($table)) {
                    return $this->getValue($table);
                }

                if (! is_null($prefix)) {
                    return $this->wrap($this->tablePrefix.$table, $prefix);
                }

                return $this->wrapValue($this->tablePrefix.$table);
            }
        };
    }

    private function unsplitSchemaGrammar(): SchemaGrammar
    {
        return new class extends SchemaGrammar
        {
            public function wrapTable($table, $prefix = null): string
            {
                if ($this->isExpression($table)) {
                    return $this->getValue($table);
                }

                if (! is_null($prefix)) {
                    return $this->wrap($this->tablePrefix.$table, $prefix);
                }

                return $this->wrapValue($this->tablePrefix.$table);
            }
        };
    }
}