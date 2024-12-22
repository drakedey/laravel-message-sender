<?php

namespace App\Providers\MessageProviders;

class DefaultMessageProvider implements MessageProviderInterface
{
  private $initialized = false;
public function initializeConnection()
  {
    if ($this->initialized) {
      return;
    }
    $this->initialized = true;
  }

  public function sendMessage(string $content, int $recipientId): array
  {
    $this->initializeConnection();
    return [
      'success' => true
    ];
  }

  public function sendMultipleMessages(string $content, array $recipientIds): array
  {
    $this->initializeConnection();
    return [
      'success' => true
    ];
  }
}