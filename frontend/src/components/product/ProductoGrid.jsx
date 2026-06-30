import ProductoCard from "./ProductoCard";
import Spinner from "../ui/Spinner";
import EmptyState from "../common/EmptyState";
import ErrorMessage from "../common/ErrorMessage";

function ProductoGrid({ productos = [], loading = false, error = null }) {
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (productos.length === 0) {
    return <EmptyState message="No hay productos disponibles." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {productos.map((producto) => (
        <ProductoCard
          key={producto.idProducto}
          producto={producto}
        />
      ))}
    </div>
  );
}

export default ProductoGrid;