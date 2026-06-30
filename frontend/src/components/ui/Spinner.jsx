function Spinner({ size = "h-8 w-8" }) {
  return (
    <div className="flex justify-center p-6">
      <div className={`${size} animate-spin rounded-full border-4 border-violet-500 border-t-transparent`}></div>
    </div>
  );
}

export default Spinner;