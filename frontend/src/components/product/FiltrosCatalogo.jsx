import Input from "../ui/Input";

function FiltrosCatalogo({ filtros, setFiltros }) {
  return (
    <div className="mb-4 flex gap-4">
      <Input
        placeholder="Buscar..."
        value={filtros.search}
        onChange={(e) =>
          setFiltros({
            ...filtros,
            search: e.target.value,
          })
        }
      />
    </div>
  );
}

export default FiltrosCatalogo;