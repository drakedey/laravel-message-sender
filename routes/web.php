<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/messages/create', [MessageController::class, 'create'])->name('messages.create');
    Route::post('/messages-massive', [MessageController::class, 'massStore'])->name('messages.massStore');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');

    Route::get('/users/search-users', [UserController::class, 'searchUsers'])->name('users.search-users');
    Route::get('/users/search-users-with-providers', [UserController::class, 'searchUsersWithProvider'])->name('users.search-users-with-providers');

    Route::get('/providers/user-providers', [ProviderController::class, 'getUserProviders'])->name('providers.user-providers');
    Route::get('/providers/all-providers', [ProviderController::class, 'getAllProviders'])->name('providers.all-providers');

});

require __DIR__ . '/auth.php';
