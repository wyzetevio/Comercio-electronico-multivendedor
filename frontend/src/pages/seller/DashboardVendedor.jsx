import { useState, useEffect } from "react";
import { Store, Package, DollarSign, ShoppingBag } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { obtenerProductosTienda } from "../../services/productoService";
import { obtenerSubordenesTienda } from "../../services/ordenService";
import { formatearPrecio } from "../../utils/formatters";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashboardVendedor() {
  const { user } = useAuth();
  const { tienda, loading: storeLoading } = useStore();
  const [stats, setStats] = useState({
    productos: 0,
    ventas: 0,
    totalVendido: 0,
    pendientes: 0,
    ventasPorMes: Array(12).fill(0),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!tienda?.idTienda) {
        setLoading(false);
        return;
      }
      try {
        const [productos, ordenes] = await Promise.all([
          obtenerProductosTienda(tienda.idTienda, true),
          obtenerSubordenesTienda(tienda.idTienda),
        ]);

        const completadas = ordenes.filter(
          (o) => o.estado === "COMPLETADA" || o.estado === "ENTREGADA" || o.estado === "PAGADA",
        );
        const pendientes = ordenes.filter(
          (o) =>
            o.estado === "PENDIENTE" ||
            o.estado === "ENVIADA" ||
            o.estado === "EN_TRANSITO",
        );

        const monthlySales = Array(12).fill(0);
        completadas.forEach((o) => {
          if (o.createdAt) {
            const date = new Date(o.createdAt);
            const month = date.getMonth();
            monthlySales[month] += o.totalVendedor || 0;
          }
        });

        setStats({
          productos: productos.length,
          ventas: completadas.length,
          totalVendido: completadas.reduce(
            (sum, o) => sum + (o.totalVendedor || 0),
            0,
          ),
          pendientes: pendientes.length,
          ventasPorMes: monthlySales,
        });
      } catch {
        setError("Error al cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    if (!storeLoading) fetchStats();
  }, [tienda, storeLoading]);

  if (storeLoading || loading) return <Spinner size="h-12 w-12" />;
  if (error) return <ErrorMessage message={error} />;

  if (!tienda) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">
          Bienvenido, {user?.nombres}
        </h2>
        <p className="mt-2 text-gray-500">
          Aún no has creado tu tienda. Regístrate como vendedor para comenzar.
        </p>
      </div>
    );
  }

  const barData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Tus Ingresos (S/)',
        data: stats.ventasPorMes,
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // Amber-500 para el vendedor
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Bienvenido de nuevo, {user?.nombres} —{" "}
          <span className="font-medium text-amber-600">
            {tienda.nombreTienda}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Productos</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.productos}
              </p>
            </div>
            <Package className="h-8 w-8 text-violet-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ventas completadas</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.ventas}
              </p>
            </div>
            <ShoppingBag className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total vendido</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatearPrecio(stats.totalVendido)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.pendientes}
              </p>
            </div>
            <Store className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Gráfico de Ventas del Vendedor */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Evolución de tus Ingresos (Anual)</h2>
        <div className="h-80 w-full">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}

export default DashboardVendedor;
