<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'phone' => ['required', 'string', 'max:20'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            'qualification' => ['required', 'string', 'max:255'],
            'college' => ['nullable', 'string', 'max:255'],
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'phone' => $input['phone'],
            'gender' => $input['gender'],
            'qualification' => $input['qualification'],
            'college' => $input['college'] ?? null,
        ]);

        \App\Jobs\SendNotificationJob::dispatch(
            $user,
            ['mail', 'database'],
            'Welcome to ' . config('app.name'),
            'emails.signup-welcome',
            [
                'name' => $user->name,
                'message' => 'Welcome to our platform! We are glad to have you.',
                'link' => url('/dashboard'),
                'button_text' => 'Go to Dashboard'
            ]
        )->afterCommit();

        return $user;
    }
}
