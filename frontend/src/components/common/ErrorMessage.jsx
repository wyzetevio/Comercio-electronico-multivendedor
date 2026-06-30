function ErrorMessage({ message }) {
  return (
    <div className="mx-auto rounded-lg bg-red-100 p-4 text-center text-red-700">
      {message}
    </div>
  );
}

export default ErrorMessage;