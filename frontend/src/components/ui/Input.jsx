function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  ...props
}) {
  const base =
    "w-full rounded-lg border px-3 py-2 outline-none focus:border-violet-500";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${base} ${className}`}
      {...props}
    />
  );
}

export default Input;