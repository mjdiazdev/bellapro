import React from "react";
import { ReactComponent as Logo } from "../../../assets/logo.svg";

const LoginForm = ({ email, setEmail, password, setPassword, error, submit, isLoading }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm">
        
        {/* BellaPro Branding */}
        <div className="flex items-center justify-start pb-8 border-gray-100">
          <div className="flex items-center space-x-1">
            {/* Logo de BellaPro*/}
            <Logo className="h-8" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mb-8">¡Bienvenido de vuelta!</h2>

        {/* Alerta de Error integrada en el diseño */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-sm border border-red-100 italic">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={submit}>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Usuario o Correo"
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl focus:border-pink outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl focus:border-pink outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón con el Gradiente de tu Configuración */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 text-white font-bold rounded-pill shadow-primary-btn transition-all active:scale-95 flex items-center justify-center ${
              isLoading ? "opacity-50 cursor-not-allowed bg-gray-500" : "bg-primary-gradient hover:bg-primary-gradient-hover"
            }`}
          >
            {isLoading ? "Validando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;