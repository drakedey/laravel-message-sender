<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Message extends Model
{
    protected $fillable = ['content', 'user_id', 'message_provider_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messageProvider(): BelongsTo
    {
        return $this->belongsTo(MessageProvider::class);
    }

    public function userMessages(): HasMany
    {
        return $this->hasMany(UserMessage::class);
    }

    public function messageFiles(): HasOne
    {
        return $this->hasOne(MessageFile::class);
    }
}