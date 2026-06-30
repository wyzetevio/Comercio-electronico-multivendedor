function Badge({
  children,
  variant = "primary",
  className = "",
}) {
  const base =
    "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold";

  const styles = {
    primary: "bg-violet-100 text-violet-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;