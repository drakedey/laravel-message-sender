<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MessageProvider extends Model
{
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
    
    public function userMessageProviders(): HasMany
    {
        return $this->hasMany(UserMessageProvider::class);
    }
}