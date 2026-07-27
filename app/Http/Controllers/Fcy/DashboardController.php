<?php

namespace App\Http\Controllers\Fcy;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\FcyRequest;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = request()->user();

        $customerStats = [
            'total' => Customer::count(),
            'active' => Customer::where('status', 'active')->count(),
            'newThisMonth' => Customer::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        $requestStats = [
            'total' => FcyRequest::count(),
            'pendingChecker' => FcyRequest::where('status', FcyRequest::STATUS_PENDING_CHECKER)->count(),
            'pendingApprover' => FcyRequest::where('status', FcyRequest::STATUS_PENDING_APPROVER)->count(),
            'approved' => FcyRequest::where('status', FcyRequest::STATUS_APPROVED)->count(),
            'draft' => FcyRequest::where('status', FcyRequest::STATUS_DRAFT)->count(),
            'rejectedByChecker' => FcyRequest::where('status', FcyRequest::STATUS_REJECTED_BY_CHECKER)->count(),
            'rejectedByApprover' => FcyRequest::where('status', FcyRequest::STATUS_REJECTED_BY_APPROVER)->count(),
            'myPending' => FcyRequest::where('maker_id', $user->id)
                ->where('status', FcyRequest::STATUS_PENDING_CHECKER)
                ->count(),
        ];

        $recentCustomers = Customer::latest()
            ->take(5)
            ->get();

        $recentRequests = FcyRequest::with(['customer', 'currency', 'paymentMethod'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('fcy/dashboard', [
            'stats' => $customerStats,
            'requestStats' => $requestStats,
            'recentCustomers' => $recentCustomers,
            'recentRequests' => $recentRequests,
            'userRoles' => $user->getFcyRoles(),
        ]);
    }
}
