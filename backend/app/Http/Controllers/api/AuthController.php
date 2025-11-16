<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);


        $user = User::where('email', $request->email)->first();
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }


        // crear token personal
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
        'user' => $user,
        'token' => $token,
        ]);
    }


    public function me(Request $request)
    {
        return response()->json($request->user());
    }


    public function logout(Request $request)
    {
        // Eliminar token actual
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
