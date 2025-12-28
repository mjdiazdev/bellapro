import React from "react";

export default function Button({
  children,
  onClick,
  fullWidth = false,
  width,           // nuevo prop opcional
  className = "",
  ...props
}) {
  return (
    <button
      onClick={onClick}
      className={`
        ${fullWidth ? "w-full" : "inline-block"} 
        text-white
        font-sans
        font-semibold
        text-xs
        rounded-full
        shadow-md
        hover:opacity-90
        transition
        mt-6
        ${className}
      `}
      style={{
        background: "linear-gradient(20deg, rgb(255, 112, 179) 0%, rgb(255, 189, 220) 100%)",
        padding: "10px 0",
        willChange: "transform",
        opacity: 1,
        width: width, // si se pasa, se aplica
      }}
      {...props}
    >
      {children}
    </button>
  );
}
