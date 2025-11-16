<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
class RoleSeeder extends Seeder
{
    public function run()
    {
        // Crear roles
        Role::firstOrCreate(['name' => 'Super usuario']);
        Role::firstOrCreate(['name' => 'Administrador']);


        // Crear un superusuario
        $user = User::firstOrCreate(
            ['email' => 'super@bellapro.local'],
            [
                'name' => 'Super Usuario',
                'password' => bcrypt('password123'),
            ]
        );
        $user->assignRole('Super usuario');
    }
}
