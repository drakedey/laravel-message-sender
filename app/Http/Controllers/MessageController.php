<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\UserMessage;
use App\Models\MessageProvider;
use App\Providers\MessageProviders\MessageProviderInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function create()
    {
        return Inertia::render('Messages/Create');
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
            'status' => $response->success ? 'SUCCESS' : 'FAILED'
        ]);

        return redirect()->route('messages.create')
            ->with('success', $response->success ? 'Message sent successfully' : 'Failed to send message');
    }

    public function massStore(Request $request) {
        $validated = $request->validate([
            'content' => 'required|string',
            'message_provider_id' => 'required|exists:message_providers,id',
            'recipent_ids' => 'required|array',
            'recipent_ids.*' => 'exists:users,id',
        ]);

        $messageProvider = MessageProvider::find($validated['message_provider_id']);

        $providerClass = $messageProvider->class_name ?? 'DEFAULT';
        $messageProvicerInstance = app()->make($providerClass);

        if (!$messageProvicerInstance instanceof MessageProviderInterface) {
            return redirect()->route('message.create')->with('error','Instance not configured');
        }

        $responses = $messageProvicerInstance->sendMultipleMessages($validated['content'], $validated['recipent_ids']);
        $success = true;
        $message = Message::create([
            'content' => $validated['content'],
            'message_provider_id' => $validated['message_provider_id'],
            'user_id' => auth()->id(),
        ]);
        foreach ($responses as $response) {
            UserMessage::create([
                'user_id' => $response->recipientId,
                'message_id' => $message->id,
                'status' => $response->success ? 'SUCCESS' : 'FAILED'
            ]);

            if ($success && !$response->success) {
                $success = false;
            }
    
        }
        return redirect()->route('messages.create')->with('success', $success ? 'Messages sent successfully' : 'Failed to send messages');
    }
}