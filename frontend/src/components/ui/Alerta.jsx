function Alerta({ message, type = "error" }) {
  const styles = {
    error: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className={`p-3 rounded-lg ${styles[type]}`}>
      {message}
    </div>
  );
}

export default Alerta;