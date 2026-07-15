import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  Store,
  DollarSign,
  PackageCheck,
  Package
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { obtenerEstadisticasAdmin } from "../../services/reporteService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function DashboardAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await obtenerEstadisticasAdmin();
        setStats(data);
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
  if (!stats) return null;

  const barData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Ingresos por Mes (S/)',
        data: stats.ventasPorMes,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false, text: 'Ventas Anuales' },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const doughnutData = {
    labels: Object.keys(stats.ventasPorCategoria),
    datasets: [
      {
        label: '% Ventas',
        data: Object.values(stats.ventasPorCategoria),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Panel de Administración
          </h1>
        </div>
      </div>

      <p className="text-gray-500">
        Bienvenido al panel central. Aquí tienes el resumen financiero y operativo de tu Marketplace.
      </p>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Ingresos Totales</p>
            <p className="text-3xl font-bold text-gray-900">S/ {stats.ingresosTotales.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Órdenes Exitosas</p>
            <p className="text-3xl font-bold text-gray-900">{stats.ordenesExitosas} <span className="text-sm font-normal text-gray-400">/ {stats.totalOrdenes}</span></p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <PackageCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Clientes Registrados</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalClientes}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <Users className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Vendedores</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalVendedores}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Store className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm border border-gray-100 min-w-0">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Evolución de Ingresos</h2>
          <div className="h-80 w-full">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Ventas por Categoría</h2>
          <div className="h-64 w-full flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Distribución de popularidad de las principales categorías.
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
