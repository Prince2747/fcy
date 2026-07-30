<?php

namespace App\Http\Controllers\Fcy;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Workunit;
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

        $customers = $query->paginate(10)->withQueryString();

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
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'branch' => ['required', 'string', 'max:255'],
            'importer_name' => ['required', 'string', 'max:255'],
            'nbe_account_no' => ['required', 'string', 'max:255', 'unique:customers,nbe_account_no'],
            'tin_number' => ['required', 'string', 'max:255', 'unique:customers,tin_number'],
        ]);

        $customer = Customer::create([
            ...$validated,
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
    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validate([
            'branch' => ['required', 'string', 'max:255'],
            'importer_name' => ['required', 'string', 'max:255'],
            'nbe_account_no' => ['required', 'string', 'max:255', 'unique:customers,nbe_account_no,'.$customer->id],
            'tin_number' => ['required', 'string', 'max:255', 'unique:customers,tin_number,'.$customer->id],
        ]);

        $customer->update($validated);

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
