<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\MessageProvider;
use App\Models\UserMessageProvider;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserProviderConfigurationSeeder extends Seeder
{
    public function run(): void
    {
        $providers = MessageProvider::all();
        
        for ($i = 1; $i <= 10; $i++) {
            $user = User::create([
                'name' => "Test User {$i}",
                'email' => "test{$i}@example.com",
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);

            $numberOfProviders = rand(1, 3);
            $selectedProviders = $providers->random($numberOfProviders);

            foreach ($selectedProviders as $provider) {
                UserMessageProvider::create([
                    'user_id' => $user->id,
                    'message_provider_id' => $provider->id,
                ]);
            }
        }
    }
}
