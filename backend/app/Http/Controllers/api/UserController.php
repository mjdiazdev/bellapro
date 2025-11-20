<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // LISTAR USUARIOS
    public function index()
    {
        return User::with('roles')->get();
    }

    // CREAR USUARIO
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'required|string|exists:roles,name',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'data' => $user->load('roles')
        ], 201);
    }

    // MOSTRAR USUARIO
    public function show($id)
    {
        return User::with('roles')->findOrFail($id);
    }

    // EDITAR USUARIO
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'  => 'sometimes|string',
            'email' => "sometimes|email|unique:users,email,$id",
            'role'  => 'sometimes|string|exists:roles,name',
        ]);

        $user->update($request->only('name', 'email'));

        if ($request->filled('role')) {
            $user->syncRoles([$request->role]);
        }

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'data' => $user->load('roles')
        ]);
    }

    // ELIMINAR USUARIO
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }

    // ASIGNAR ROL A USUARIO
    public function assignRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name'
        ]);

        $user = User::findOrFail($id);

        $user->syncRoles([$request->role]);

        return response()->json([
            'message' => 'Rol asignado correctamente',
            'roles' => $user->roles
        ]);
    }
}
