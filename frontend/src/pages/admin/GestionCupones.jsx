import { useState, useEffect } from "react";
import { Ticket, Plus, Trash2, Power, PowerOff } from "lucide-react";
import { obtenerCupones, crearCupon, alternarEstadoCupon, eliminarCupon } from "../../services/cuponService";
import Spinner from "../../components/ui/Spinner";
import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import ErrorMessage from "../../components/common/ErrorMessage";

function GestionCupones() {
    const [cupones, setCupones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nuevoCupon, setNuevoCupon] = useState({ codigo: "", descuentoPorcentaje: "", fechaExpiracion: "" });
    const [creando, setCreando] = useState(false);

    const cargarCupones = async () => {
        setLoading(true);
        try {
            const data = await obtenerCupones();
            setCupones(data);
        } catch (err) {
            setError("Error al cargar los cupones.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCupones();
    }, []);

    const handleCrear = async (e) => {
        e.preventDefault();
        if (!nuevoCupon.codigo || !nuevoCupon.descuentoPorcentaje) {
            alert("El código y el descuento son obligatorios.");
            return;
        }
        setCreando(true);
        try {
            const cuponParaGuardar = {
                codigo: nuevoCupon.codigo.toUpperCase(),
                descuentoPorcentaje: parseFloat(nuevoCupon.descuentoPorcentaje),
                fechaExpiracion: nuevoCupon.fechaExpiracion ? nuevoCupon.fechaExpiracion + "T23:59:59" : null,
            };
            await crearCupon(cuponParaGuardar);
            setNuevoCupon({ codigo: "", descuentoPorcentaje: "", fechaExpiracion: "" });
            cargarCupones();
        } catch (err) {
            alert("Error al crear el cupón. Tal vez el código ya existe.");
        } finally {
            setCreando(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await alternarEstadoCupon(id);
            cargarCupones();
        } catch (err) {
            alert("Error al cambiar estado.");
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este cupón?")) return;
        try {
            await eliminarCupon(id);
            cargarCupones();
        } catch (err) {
            alert("Error al eliminar.");
        }
    };

    if (loading) return <Spinner size="h-12 w-12" />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Ticket className="h-7 w-7 text-red-600" />
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Cupones</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Formulario de creación */}
                <div className="md:col-span-1 min-w-0">
                    <form onSubmit={handleCrear} className="rounded-xl bg-white p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Crear Nuevo Cupón</h2>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Código</label>
                            <input type="text" placeholder="EJ: VERANO20" className="w-full rounded-lg border border-gray-300 p-2.5 uppercase focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={nuevoCupon.codigo} onChange={(e) => setNuevoCupon({ ...nuevoCupon, codigo: e.target.value })} required />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Descuento (%)</label>
                            <input type="number" min="1" max="100" placeholder="15" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={nuevoCupon.descuentoPorcentaje} onChange={(e) => setNuevoCupon({ ...nuevoCupon, descuentoPorcentaje: e.target.value })} required />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Fecha Expiración (Opcional)</label>
                            <input type="date" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" value={nuevoCupon.fechaExpiracion} onChange={(e) => setNuevoCupon({ ...nuevoCupon, fechaExpiracion: e.target.value })} />
                        </div>

                        <Boton type="submit" disabled={creando} className="w-full flex justify-center gap-2">
                            <Plus size={18} /> {creando ? "Creando..." : "Crear Cupón"}
                        </Boton>
                    </form>
                </div>

                {/* Tabla de cupones */}
                <div className="md:col-span-2 min-w-0">
                    <div className="rounded-xl bg-white p-6 shadow-sm overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Código</th>
                                    <th className="px-4 py-3 font-semibold">Descuento</th>
                                    <th className="px-4 py-3 font-semibold">Expira en</th>
                                    <th className="px-4 py-3 font-semibold">Estado</th>
                                    <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cupones.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No hay cupones registrados.</td>
                                    </tr>
                                ) : (
                                    cupones.map((cupon) => (
                                        <tr key={cupon.idCupon} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-4 font-bold text-red-600">{cupon.codigo}</td>
                                            <td className="px-4 py-4 font-medium text-gray-900">{cupon.descuentoPorcentaje}%</td>
                                            <td className="px-4 py-4 text-gray-500">{cupon.fechaExpiracion ? new Date(cupon.fechaExpiracion).toLocaleDateString() : "Sin caducidad"}</td>
                                            <td className="px-4 py-4">
                                                <Badge type={cupon.activo ? "success" : "error"}>{cupon.activo ? "Activo" : "Inactivo"}</Badge>
                                            </td>
                                            <td className="px-4 py-4 flex justify-end gap-2">
                                                <button onClick={() => handleToggle(cupon.idCupon)} className={`p-2 rounded-lg transition-colors ${cupon.activo ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"}`} title={cupon.activo ? "Desactivar" : "Activar"}>
                                                    {cupon.activo ? <PowerOff size={18} /> : <Power size={18} />}
                                                </button>
                                                <button onClick={() => handleEliminar(cupon.idCupon)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GestionCupones;
