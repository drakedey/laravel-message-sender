<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMessage extends Model
{
    protected $fillable = ['user_id', 'message_id', 'status', 'received_at'];

    protected $casts = [
        'received_at' => 'datetime',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }
}