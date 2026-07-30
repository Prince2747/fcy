<?php

namespace App\Http\Controllers\Fcy;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFcyRequest;
use App\Http\Requests\UpdateFcyRequest;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\FcyRequest;
use App\Models\PaymentMethod;
use App\Models\Workunit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

trait AuthorizesRequests
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
}

class FcyRequestController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = FcyRequest::query()
            ->with(['customer', 'currency', 'paymentMethod'])
            ->latest();

        if ($user->hasRole('fcymaker') && ! $user->hasRole('fcychecker') && ! $user->hasRole('fcyapprover')) {
            $query->where('maker_id', $user->id);
        }

        $requests = $query->paginate(15);

        $requestStats = [
            'total' => FcyRequest::count(),
            'pendingChecker' => FcyRequest::where('status', FcyRequest::STATUS_PENDING_CHECKER)->count(),
            'pendingApprover' => FcyRequest::where('status', FcyRequest::STATUS_PENDING_APPROVER)->count(),
            'approved' => FcyRequest::where('status', FcyRequest::STATUS_APPROVED)->count(),
        ];

        return Inertia::render('fcy/requests/index', [
            'requests' => $requests,
            'requestStats' => $requestStats,
            'userRoles' => $user->getFcyRoles(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('fcy/requests/create', [
            'customers' => Customer::orderBy('importer_name')->get(),
            'currencies' => Currency::orderBy('code')->get(),
            'paymentMethods' => PaymentMethod::orderBy('name')->get(),
            'branches' => $this->getBranches(),
        ]);
    }

    public function store(StoreFcyRequest $request): RedirectResponse
    {
        $user = $request->user();

        $fcyRequest = FcyRequest::create([
            ...$request->validated(),
            'request_number' => FcyRequest::generateRequestNumber(),
            'status' => FcyRequest::STATUS_DRAFT,
            'maker_id' => (string) $user->id,
        ]);

        return redirect()->route('fcy.requests.show', $fcyRequest)
            ->with('success', 'FCY request created successfully.');
    }

    public function show(Request $request, FcyRequest $fcyRequest): Response
    {
        $fcyRequest->load(['customer', 'currency', 'paymentMethod']);

        return Inertia::render('fcy/requests/show', [
            'request' => $fcyRequest,
            'userRoles' => $request->user()->getFcyRoles(),
        ]);
    }

    public function edit(FcyRequest $fcyRequest): Response
    {
        $this->authorize('update', $fcyRequest);

        return Inertia::render('fcy/requests/edit', [
            'request' => $fcyRequest->load(['customer', 'currency', 'paymentMethod']),
            'customers' => Customer::orderBy('importer_name')->get(),
            'currencies' => Currency::orderBy('code')->get(),
            'paymentMethods' => PaymentMethod::orderBy('name')->get(),
            'branches' => $this->getBranches(),
        ]);
    }

    /**
     * @return list<string>
     */
    private function getBranches(): array
    {
        return Workunit::query()
            ->where('prefix', 'branch')
            ->whereNotNull('name')
            ->orderBy('name')
            ->pluck('name')
            ->values()
            ->toArray();
    }

    public function update(UpdateFcyRequest $request, FcyRequest $fcyRequest): RedirectResponse
    {
        $this->authorize('update', $fcyRequest);

        $fcyRequest->update($request->validated());

        return redirect()->route('fcy.requests.show', $fcyRequest)
            ->with('success', 'FCY request updated successfully.');
    }

    public function submit(Request $request, FcyRequest $fcyRequest): RedirectResponse
    {
        $this->authorize('submit', $fcyRequest);

        $fcyRequest->update([
            'status' => FcyRequest::STATUS_PENDING_CHECKER,
            'maker_notes' => $request->input('maker_notes', $fcyRequest->maker_notes),
        ]);

        return redirect()->route('fcy.requests.show', $fcyRequest)
            ->with('success', 'Request submitted for checker review.');
    }

    public function check(Request $request, FcyRequest $fcyRequest): RedirectResponse
    {
        $this->authorize('check', $fcyRequest);

        $request->validate([
            'checker_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $fcyRequest->update([
            'status' => FcyRequest::STATUS_PENDING_APPROVER,
            'checker_id' => (string) $request->user()->id,
            'checker_notes' => $request->input('checker_notes'),
            'checked_at' => now(),
        ]);

        return redirect()->route('fcy.requests.show', $fcyRequest)
            ->with('success', 'Request checked and forwarded to approver.');
    }

    public function rejectCheck(Request $request, FcyRequest $fcyRequest): RedirectResponse
    {
        $this->authorize('rejectCheck', $fcyRequest);

        $validated = $request->validate([
            'checker_notes' => ['required', 'string', 'max:2000'],
        ]);

        $fcyRequest->update([
            'status' => FcyRequest::STATUS_REJECTED_BY_CHECKER,
            'checker_id' => (string) $request->user()->id,
            'checker_notes' => $validated['checker_notes'],
            'checked_at' => now(),
        ]);

        return redirect()->route('fcy.requests.show', $fcyRequest)
            ->with('success', 'Request rejected and sent back to maker for corrections.');
    }

    public function approve(Request $request, FcyRequest $fcyRequest): RedirectResponse
    {
        $this->authorize('approve', $fcyRequest);

        $request->validate([
            'approver_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $fcyRequest->update([
            'status' => FcyRequest::STATUS_APPROVED,
            'approver_id' => (string) $request->user()->id,
            'approver_notes' => $request->input('approver_notes'),
            'approved_at' => now(),
        ]);

        return redirect()->route('fcy.requests.show', $fcyRequest)
            ->with('success', 'Request approved successfully.');
    }

    public function reject(Request $request, FcyRequest $fcyRequest): RedirectResponse
    {
        $this->authorize('reject', $fcyRequest);

        $validated = $request->validate([
            'approver_notes' => ['required', 'string', 'max:2000'],
        ]);

        $fcyRequest->update([
            'status' => FcyRequest::STATUS_REJECTED_BY_APPROVER,
            'approver_id' => (string) $request->user()->id,
            'approver_notes' => $validated['approver_notes'],
            'approved_at' => now(),
        ]);

        return redirect()->route('fcy.requests.show', $fcyRequest)
            ->with('success', 'Request rejected by approver.');
    }
}
