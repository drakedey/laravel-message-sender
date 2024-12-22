<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function searchUsersWithProvider(Request $request) {

        $users = User::join('user_message_providers', 'users.id', '=', 'user_message_providers.user_id')
            ->where('users.id', '!=', auth()->id())
            ->where('users.email', 'like', "%{$request->search}%")
            ->where('user_message_providers.message_provider_id', $request->providerId)
            ->get(['users.id', 'users.name', 'users.email']);

        return response()->json($users);
    }
    public function searchUsers(Request $request)
    {
        $users = User::where('email', 'like', "%{$request->search}%")
            ->where('id', '!=', auth()->id())
            ->limit(5)
            ->get(['id', 'name', 'email']);

        return response()->json($users);
    }
}
