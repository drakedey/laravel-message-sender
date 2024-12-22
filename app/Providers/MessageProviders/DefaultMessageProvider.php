<?php

namespace App\Providers\MessageProviders;

use App\Providers\MessageProviders\Dto\MessageProviderDTO;

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

  public function sendMessage(string $content, int $recipientId): MessageProviderDTO
  {
    $this->initializeConnection();
    return new MessageProviderDTO(true, $recipientId);
  }

  public function sendMultipleMessages(string $content, array $recipientIds): array
  {
    $responses = [];
    foreach ($recipientIds as $recipientId) {
      $response = $this->sendMessage($content, $recipientId);
      $responses[] = $response;
    }

    return $responses;
  }
}