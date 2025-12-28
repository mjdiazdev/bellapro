import React from "react";

const RadioCard = ({
  title,
  subtitle,
  price,
  icon,      // ShippingMethod (izquierda)
  icons,     // PaymentMethod (derecha)
  value,
  selected,
  onChange
}) => {
  return (
    <label
      className={`
        flex items-center justify-between
        w-full cursor-pointer
        rounded-xl border
        bg-[#fcf7fa]
        px-4 py-3
        transition-colors
        ${selected ? "border-pink" : "border-gray-200"}
      `}
    >
      {/* Left */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1">
          {/* Icon a la izquierda si existe */}
          {icon && (
            <span className="text-gray-400 flex items-center mr-1">
              {React.cloneElement(icon, { className: "w-3.5 h-3.5" })}
            </span>
          )}
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        {subtitle && <span className="text-xs text-gray-500 mt-0.5">{subtitle}</span>}
      </div>

      {/* Right */}
      <div className="flex items-center space-x-2">
        {price && <div className="text-sm font-semibold text-gray-900">{price}</div>}

        {/* Icons de PaymentMethod a la derecha */}
        {icons && <div className="flex items-center">{icons}</div>}

        {/* Input para radio controlado */}
        {value !== undefined && (
          <input
            type="radio"
            name="radio-card"
            value={value}
            checked={selected}
            onChange={onChange}
            className="hidden"
          />
        )}
      </div>
    </label>
  );
};

export default RadioCard;
