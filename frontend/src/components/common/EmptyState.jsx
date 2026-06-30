function EmptyState({ message = "No hay datos" }) {
  return (
    <div className="text-center p-10 text-gray-500">
      {message}
    </div>
  );
}

export default EmptyState;