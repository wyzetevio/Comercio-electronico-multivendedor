import Boton from "./Boton";

function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">

        {/* Título */}
        {title && (
          <h2 className="mb-4 text-xl font-semibold">
            {title}
          </h2>
        )}

        {/* Contenido */}
        <div className="mb-6">
          {children}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3">

          <Boton
            variant="secondary"
            onClick={onClose}
          >
            {cancelText}
          </Boton>

          {onConfirm && (
            <Boton
              onClick={onConfirm}
            >
              {confirmText}
            </Boton>
          )}

        </div>

      </div>
    </div>
  );
}

export default Modal;