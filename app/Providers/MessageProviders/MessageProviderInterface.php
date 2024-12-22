<?php

namespace App\Providers\MessageProviders;

interface MessageProviderInterface
{
    public function initializeConnection();
    public function sendMessage(string $content, int $recipientId): array;
    public function sendMultipleMessages(string $content, array $recipientIds): array;
}