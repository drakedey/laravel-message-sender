<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\MessageProvider;

class ProviderController extends Controller
{
    public function getAllProviders(Request $request) {
        $providers = MessageProvider::all();
        return response()->json($providers);
    }

    public function getUserProviders(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $providers = $user->messageProviders()->get();

        return response()->json($providers);
    }
}
