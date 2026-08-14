<?php

namespace App\Http\Controllers\Fcy;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display a paginated listing of the authenticated user's notifications.
     *
     * Returns JSON when requested via XHR (for the bell dropdown),
     * otherwise renders the Inertia page.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $filter = $request->input('filter', 'all');

        $query = $request->user()->notifications()->orderBy('id', 'desc');

        if ($filter === 'unread') {
            $query->whereNull('read_at');
        }

        $notifications = $query->paginate(10)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json([
                'notifications' => $notifications,
            ]);
        }

        return Inertia::render('fcy/notifications/index', [
            'notifications' => $notifications,
            'filter' => $filter,
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return redirect()->back();
    }

    /**
     * Mark all unread notifications as read.
     */
    public function markAllRead(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return redirect()->back();
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'count' => $request->user()->unreadNotifications()->count(),
        ]);
    }
}
