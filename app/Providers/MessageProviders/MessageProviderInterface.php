<?php

namespace App\Providers\MessageProviders;

use App\Providers\MessageProviders\Dto\MessageProviderDTO;

interface MessageProviderInterface
{
    public function initializeConnection();
    public function sendMessage(string $content, int $recipientId): MessageProviderDTO;
    public function sendMultipleMessages(string $content, array $recipientIds): array;
}