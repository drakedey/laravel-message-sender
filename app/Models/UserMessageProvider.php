<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMessageProvider extends Model
{
    protected $fillable = ['user_id', 'message_provider_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messageProvider(): BelongsTo
    {
        return $this->belongsTo(MessageProvider::class);
    }
}