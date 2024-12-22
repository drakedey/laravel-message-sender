<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessageProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $providers = [
            ['name' => 'Telegram'],
            ['name' => 'Slack'],
            ['name' => 'Discord'],
            ['name' => 'Whatsapp']
        ];

        DB::table('message_providers')->insert($providers);
    }
}
