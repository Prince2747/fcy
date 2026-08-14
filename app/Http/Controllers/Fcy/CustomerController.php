<?php

namespace App\Http\Controllers\Fcy;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\Workunit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index(Request $request): Response
    {
        $query = Customer::query();

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('importer_name', 'like', "%{$search}%")
                    ->orWhere('nbe_account_no', 'like', "%{$search}%")
                    ->orWhere('tin_number', 'like', "%{$search}%");
            });
        }

        // Filter by branch
        if ($branch = $request->input('branch')) {
            $query->where('branch', $branch);
        }

        // Filter by status
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Order by latest first
        $query->latest();

        $customers = $query->paginate(5)->withQueryString();

        // Get branches from HR workunits table
        $branches = Workunit::query()
            ->where('prefix', 'branch')
            ->whereNotNull('name')
            ->orderBy('name')
            ->pluck('name')
            ->values()
            ->toArray();

        return Inertia::render('fcy/customers/index', [
            'customers' => $customers,
            'branches' => $branches,
            'filters' => $request->only(['search', 'branch', 'status']),
        ]);
    }

    /**
     * Store a newly created customer.
     */
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = Customer::create([
            ...$request->validated(),
            'status' => 'active',
        ]);

        // Return JSON response for modal submission (no navigation)
        return response()->json([
            'success' => true,
            'customer' => $customer,
            'message' => "Customer '{$customer->importer_name}' registered successfully.",
        ]);
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer): Response
    {
        return Inertia::render('fcy/customers/show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified customer.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $customer->update($request->validated());

        return redirect()->route('fcy.customers.index')
            ->with('success', "Customer '{$customer->importer_name}' updated successfully.");
    }

    /**
     * Deactivate the specified customer.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->update(['status' => 'inactive']);

        return redirect()->route('fcy.customers.index')
            ->with('success', "Customer '{$customer->importer_name}' deactivated successfully.");
    }

    /**
     * Activate the specified customer.
     */
    public function activate(Customer $customer): RedirectResponse
    {
        $customer->update(['status' => 'active']);

        return redirect()->route('fcy.customers.index')
            ->with('success', "Customer '{$customer->importer_name}' activated successfully.");
    }
}
