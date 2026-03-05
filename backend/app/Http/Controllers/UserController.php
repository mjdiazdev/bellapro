<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();

        // Agregar campo 'role' manualmente
        $users->each(function ($u) {
            $u->role = $u->roles->first()->id ?? null;
        });

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->syncRoles([$validated['role']]);

        return response()->json($user);
    }

    public function show(User $user)
    {
        $user->load('roles'); // cargar roles realacionados

        // Agregamos campo 'role' para tu frontend
        $user->role = $user->roles->first()->id ?? null;

        return response()->json($user);
    }


    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'password' => 'nullable|min:6',
            'role' => 'required'
        ]);
        $password = $validated['password'] ?? null;

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $password ? Hash::make($password) : $user->password,
            'role' => $validated['role'],
        ]);

        $user->syncRoles([$validated['role']]);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }

    /**
     * Filtrar usuarios por un nombre de rol específico.
     */
    public function getUsersByRole($roleName)
    {
        // Usamos el scope 'role' que proporciona Spatie para filtrar
        $users = User::role($roleName)->get();

        // Mantenemos tu lógica de adjuntar el ID del rol para el frontend
        $users->each(function ($u) {
            $u->role = $u->roles->first()->id ?? null;
        });

        return response()->json([
            'status' => 'success',
            'data'   => $users
        ]);
    }
}
