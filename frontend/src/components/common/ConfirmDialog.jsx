import Boton from "../ui/Boton";

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <p className="mb-4">{message}</p>

      <div className="flex gap-2 justify-end">
        <Boton variant="secondary" onClick={onCancel}>
          Cancelar
        </Boton>

        <Boton variant="danger" onClick={onConfirm}>
          Confirmar
        </Boton>
      </div>
    </div>
  );
}

export default ConfirmDialog;