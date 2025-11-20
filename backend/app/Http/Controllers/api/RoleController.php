<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    // Listar roles disponibles
    public function index()
    {
        return response()->json([
            'roles' => Role::all()
        ]);
    }
    // Crear nuevo rol
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name'
        ]);

        $role = Role::create([
            'name' => $request->name
        ]);

        return response()->json([
            'message' => 'Rol creado',
            'role' => $role
        ], 201);
    }


    // Ver detalles del rol
    public function show(Role $role)
    {
        return response()->json($role);
    }

    // Editar rol
    public function update(Role $role, Request $request)
    {
        $role->update($request->all());
        return response()->json(['message' => 'Role actualizado correctamente']);
    }

    // Eliminar rol
    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['message' => 'Role eliminado correctamente']);
    }
}
