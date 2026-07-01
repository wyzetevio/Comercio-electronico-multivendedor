import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  Store,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { obtenerVendedores } from "../../services/vendedorService";
import { obtenerProductos } from "../../services/productoService";
function DashboardAdmin() {
  const [stats, setStats] = useState({
    vendedores: 0,
    productos: 0,
    pendientes: 0,
    suspendidos: 0,
    verificado: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vendedores, productos] = await Promise.all([
          obtenerVendedores(),
          obtenerProductos(),
        ]);

        setStats({
          vendedores: vendedores.length,
          productos: productos.length,
          pendientes: vendedores.filter(
            (v) => !v.verificado && !v.suspendido,
          ).length,
          suspendidos: vendedores.filter((v) => v.suspendido).length,
          verificado: vendedores.filter((v) => v.verificado).length,
        });
      } catch {
        setError("Error al cargar estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Spinner size="h-12 w-12" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-7 w-7 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-800">
          Panel de Administración
        </h1>
      </div>

      <p className="text-gray-500">
        Bienvenido al panel de administración. Gestiona usuarios, productos y
        liquidaciones.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Vendedores</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.vendedores}
              </p>
            </div>
            <Store className="h-8 w-8 text-violet-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Productos</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.productos}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendientes de verificar</p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.pendientes}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Suspendidos</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.suspendidos}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Accesos directos
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h3 className="font-semibold text-amber-800">Moderación</h3>
            <p className="mt-1 text-sm text-amber-600">
              Revisa y modera productos y vendedores pendientes.
            </p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="font-semibold text-green-800">Liquidaciones</h3>
            <p className="mt-1 text-sm text-green-600">
              Gestiona los pagos pendientes a vendedores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
