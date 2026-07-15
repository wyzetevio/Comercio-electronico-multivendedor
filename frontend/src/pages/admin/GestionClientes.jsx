import { useState, useEffect } from "react";
import { Users, Lock, Unlock, Search } from "lucide-react";
import { obtenerClientes, cambiarEstadoCuenta } from "../../services/usuarioService";
import Spinner from "../../components/ui/Spinner";
import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import ErrorMessage from "../../components/common/ErrorMessage";

function GestionClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const cargarClientes = async () => {
        setLoading(true);
        try {
            const data = await obtenerClientes();
            setClientes(data);
        } catch (err) {
            setError("Error al cargar la lista de clientes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const handleToggleEstado = async (idUsuario) => {
        if (!window.confirm("¿Estás seguro de cambiar el estado de este cliente?")) return;
        try {
            await cambiarEstadoCuenta(idUsuario);
            cargarClientes(); // Recargamos para ver el nuevo estado
        } catch (err) {
            alert("Hubo un error al cambiar el estado del cliente.");
        }
    };

    const clientesFiltrados = clientes.filter(
        (c) =>
            c.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (loading) return <Spinner size="h-12 w-12" />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Users className="h-7 w-7 text-red-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
                </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o correo..."
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <Badge type="info">Total: {clientesFiltrados.length} clientes</Badge>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 font-semibold">ID</th>
                                <th className="px-4 py-3 font-semibold">Cliente</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold">Fecha Registro</th>
                                <th className="px-4 py-3 font-semibold">Estado</th>
                                <th className="px-4 py-3 font-semibold text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {clientesFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                        No se encontraron clientes.
                                    </td>
                                </tr>
                            ) : (
                                clientesFiltrados.map((cliente) => (
                                    <tr key={cliente.idUsuario} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900">#{cliente.idUsuario}</td>
                                        <td className="px-4 py-4 font-medium text-gray-900">{cliente.nombres} {cliente.apellidos}</td>
                                        <td className="px-4 py-4">{cliente.email}</td>
                                        <td className="px-4 py-4 text-gray-500">{new Date(cliente.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-4">
                                            <Badge type={cliente.estado ? "success" : "error"}>
                                                {cliente.estado ? "Activo" : "Suspendido"}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <Boton
                                                variant={cliente.estado ? "danger" : "primary"}
                                                onClick={() => handleToggleEstado(cliente.idUsuario)}
                                                className="!px-3 !py-1.5 text-sm"
                                            >
                                                {cliente.estado ? (
                                                    <span className="flex items-center gap-1"><Lock size={14} /> Suspender</span>
                                                ) : (
                                                    <span className="flex items-center gap-1"><Unlock size={14} /> Activar</span>
                                                )}
                                            </Boton>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GestionClientes;
