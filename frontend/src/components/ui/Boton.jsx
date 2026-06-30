function Boton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600";

  const styles = {
    primary: "bg-violet-600 text-white hover:bg-violet-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Boton;