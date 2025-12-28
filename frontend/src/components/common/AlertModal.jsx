import "../../assets/css/AlertModal.css";

export default function AlertModal({ open, type = "success", message, onClose }) {
  if (!open) return null;

  const colors = {
    success: {
      bg: "#d1fae5",
      border: "#E83388",
      icon: "✔",
      title: "¡Éxito!",
    },
    error: {
      bg: "#fee2e2",
      border: "#ef4444",
      icon: "✖",
      title: "Error",
    },
    warning: {
      bg: "#fef3c7",
      border: "#f59e0b",
      icon: "⚠",
      title: "Advertencia",
    },
    info: {
      bg: "#dbeafe",
      border: "#3b82f6",
      icon: "ℹ",
      title: "Información",
    },
  };

  const style = colors[type] || colors.info;

  return (
    <div className="alert-overlay">
      <div className="alert-modal" style={{ borderLeftColor: style.border }}>
        <div className="alert-icon" style={{ color: style.border }}>
          {style.icon}
        </div>

        <h3 className="alert-title" style={{ color: style.border }}>
          {style.title}
        </h3>

        <p className="alert-message">{message}</p>

        <button
          className="alert-btn"
          style={{ backgroundColor: style.border }}
          onClick={onClose}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
