<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageFile extends Model
{
    protected $fillable = [
        'file_name',
        'file_content',
        'file_type',
        'message_id',
    ];
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }
}
