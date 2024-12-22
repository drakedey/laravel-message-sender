<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MessageController;
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
    
    Route::get('/messages/search-users', [MessageController::class, 'searchUsers'])->name('messages.search-users');
    Route::get('/messages/search-users-with-providers', [MessageController::class, 'searchUsersWithProvider'])->name('messages.search-users-with-providers');
    
    Route::get('/messages/user-providers', [MessageController::class, 'getUserProviders'])->name('messages.user-providers');
    Route::get('/messages/all-providers', [MessageController::class, 'getAllProviders'])->name('messages.all-providers');

});

require __DIR__ . '/auth.php';
