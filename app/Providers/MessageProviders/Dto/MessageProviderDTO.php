<?php

 namespace App\Providers\MessageProviders\Dto;

 class MessageProviderDTO
 {
     public function __construct(
      public bool $success,
      public int $recipientId
     ) { }
 }