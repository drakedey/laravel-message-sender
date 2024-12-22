<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Models\UserMessage;
use App\Models\MessageProvider;
use App\Providers\MessageProviders\MessageProviderInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Providers\MessageProviders\DefaultMessageProvider;

class MessageController extends Controller
{
    public function create()
    {
        return Inertia::render('Messages/Create');
    }

    public function searchUsers(Request $request)
    {
        $users = User::where('email', 'like', "%{$request->search}%")
            ->where('id', '!=', auth()->id())
            ->limit(5)
            ->get(['id', 'name', 'email']);

        return response()->json($users);
    }

    public function getUserProviders(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $providers = $user->messageProviders()->get();

        return response()->json($providers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'message_provider_id' => 'required|exists:message_providers,id',
            'recipient_id' => 'required|exists:users,id',
        ]);

        $messageProvider = MessageProvider::find($validated['message_provider_id']);

        $providerClass = $messageProvider->class_name ?? 'DEFAULT';
        $messageProvicerInstance = app()->make($providerClass);

        if (!$messageProvicerInstance instanceof MessageProviderInterface) {
            return redirect()->route('message.create')->with('error','Instance not configured');
        }
        
        $response = $messageProvicerInstance->sendMessage($validated['content'], $validated['recipient_id']); 
        $message = Message::create([
            'content' => $validated['content'],
            'message_provider_id' => $validated['message_provider_id'],
            'user_id' => auth()->id(),
        ]);

        UserMessage::create([
            'user_id' => $validated['recipient_id'],
            'message_id' => $message->id,
            'status' => $response['success'] ? 'SUCCESS' : 'FAILED'
        ]);

        return redirect()->route('messages.create')
            ->with('success', 'Message sent successfully!');
    }
}