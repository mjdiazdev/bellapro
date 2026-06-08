<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'users:create-admin
                            {email : Email del nuevo usuario admin}
                            {name : Nombre del usuario}
                            {--password= : Contraseña (si no se indica, se pedirá interactivamente)}';

    protected $description = 'Crea un usuario con rol admin';

    public function handle(): int
    {
        $email = $this->argument('email');
        $name  = $this->argument('name');

        if (User::where('email', $email)->exists()) {
            $this->error("Ya existe un usuario con el email: {$email}");
            return self::FAILURE;
        }

        $password = $this->option('password')
            ?? $this->secret('Introduce la contraseña para el nuevo usuario');

        $user = User::create([
            'name'     => $name,
            'email'    => $email,
            'password' => Hash::make($password),
        ]);

        $user->assignRole('admin');

        $this->info("Usuario admin creado correctamente.");
        $this->table(['Campo', 'Valor'], [
            ['Email', $email],
            ['Nombre', $name],
            ['Rol', 'admin'],
        ]);

        return self::SUCCESS;
    }
}
