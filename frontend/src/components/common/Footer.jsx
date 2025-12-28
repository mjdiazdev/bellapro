import React from 'react';
import { ReactComponent as Logo } from "../../assets/logo.svg";
import {
  ArrowUpRight,
  X, // Icono para Twitter/X
  Linkedin, // Icono para LinkedIn
  Instagram, // Icono para Instagram
} from 'lucide-react';

// Componente individual para los enlaces de redes sociales
const SocialLink = ({ icon: Icon, name, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex justify-between items-center py-2.5 border-b border-gray-100 transition duration-150 hover:text-pink"
  >
    <div className="flex items-center text-sm font-medium">
      <Icon className="h-4 w-4 mr-2" />
      <span>{name}</span>
    </div>
    <ArrowUpRight className="h-4 w-4 text-gray-400" />
  </a>
);

const App = () => {
  // Datos de las redes sociales
  const socialLinks = [
    { name: 'twitter', icon: X, href: 'https://twitter.com/bellapro' },
    { name: 'linkedin', icon: Linkedin, href: 'https://linkedin.com/company/bellapro' },
    { name: 'instagram', icon: Instagram, href: 'https://instagram.com/bellapro' },
  ];

  return (
    // Contenedor principal con fondo rosa claro
    <footer className="bg-pink-50 p-12 lg:px-24 xl:px-32 text-gray-700 font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/*
          GRID DE 4 COLUMNAS.
          Columna 1: Logo (md:col-span-2)
          Columna 2: Contacto/Social (md:col-span-2).
          Ambos contenedores de columna están alineados a la izquierda.
        */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Columna 1: Logo y Slogan (50% de ancho) */}
          <div className="md:col-span-2">
            {/* Logo 'BELLA PRO' */}
            <div className="flex items-center space-x-1 mb-2">
              <Logo className="h-8" />
            </div>
            {/* Slogan */}
            <p className="text-sm text-gray-600 mt-1">Your design and dev partner</p>
          </div>

          {/* Columna 2: Wrapper para Contacto y Redes Sociales (50% de ancho) */}
          <div className="md:col-span-2 flex flex-col">
            
            {/* Contacto (Alineado a la izquierda por defecto) */}
            {/* DERECHA */}
            <div className="flex flex-col items-start md:items-end">

              {/* CONTACTO */}
              <div className="mb-10 text-right">
                <p className="text-sm text-gray-600">Atención al cliente</p>
                <a
                  href="mailto:info@bellapro.com"
                  className="text-lg font-semibold text-gray-800 hover:text-pink"
                >
                  info@bellapro.com
                </a>
              </div>

              {/* REDES */}
              <div className="w-full max-w-[220px]">
                {socialLinks.map((link) => (
                  <SocialLink key={link.name} {...link} />
                ))}
              </div>

            </div>

          </div>
        </div>
        
        {/* Sección de Copyright y Legal */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row md:justify-between text-xs text-gray-600 space-y-2 md:space-y-0">
          <div className="space-y-1">
            <p>©{new Date().getFullYear()} BellaPro.</p>
            <p>Todos los derechos reservados.</p>
            <p className="mt-1">Diseñado por TLC</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default App;