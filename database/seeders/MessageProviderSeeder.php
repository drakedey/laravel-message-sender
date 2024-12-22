<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessageProviderSeeder extends Seeder
{
    /**∫
     * Run the database seeds.
     */
    public function run(): void
    {
        $providers = [
            ['name' => 'Telegram', 'class_key' => 'DEFAULT'],
            ['name' => 'Slack', 'class_key' => 'DEFAULT'],
            ['name' => 'Discord', 'class_key' => 'DEFAULT'],
            ['name' => 'Whatsapp', 'class_key' => 'DEFAULT']
        ];

        DB::table('message_providers')->insert($providers);
    }
}
