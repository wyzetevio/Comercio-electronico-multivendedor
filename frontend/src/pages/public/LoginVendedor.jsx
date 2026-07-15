import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Store, TrendingUp, Shield, Headphones, ShoppingBag, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/authService";

function LoginVendedor() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginService({ email, password });

      // Verificamos estrictamente el rol
      if (response.rol !== "VENDEDOR") {
        setError("Acceso denegado. Esta puerta es exclusiva para vendedores.");
        setLoading(false);
        return;
      }

      login(response);
      navigate("/vendedor");
    } catch (err) {
      setError(
        err.response?.data?.message || "Credenciales incorrectas. Intente de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] text-gray-100 font-sans selection:bg-fuchsia-500/30">

      {/* NAVBAR PERSONALIZADO */}
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-800/50 bg-[#0f0c29]/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-fuchsia-400 hover:text-fuchsia-300 transition group">
          <div className="bg-fuchsia-500/10 p-2 rounded-lg group-hover:bg-fuchsia-500/20 transition">
            <Store size={22} className="text-fuchsia-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Pochita Store</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:inline-block">¿No tienes cuenta?</span>
          <Link
            to="/register/vendedor"
            className="px-5 py-2 text-sm font-medium bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg transition shadow-[0_0_15px_rgba(192,38,211,0.4)]"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* COLUMNA IZQUIERDA: HERO TEXT */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-gray-300 tracking-wider">PORTAL EXCLUSIVO DE VENDEDORES</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                Bienvenido al <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">Centro de Ventas</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                Accede a tu panel de vendedor en <span className="text-white font-medium">Pochita Store</span> y gestiona tus productos, pedidos e inventario desde un solo lugar. Más de <span className="text-fuchsia-400 font-semibold">50,000 clientes activos</span> te están esperando.
              </p>
            </div>

            {/* TAGS DE VENTAJA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                <TrendingUp size={18} className="text-fuchsia-400" />
                <span className="text-sm text-gray-300">Analíticas en tiempo real</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                <Shield size={18} className="text-fuchsia-400" />
                <span className="text-sm text-gray-300">Pagos 100% seguros</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                <ShoppingBag size={18} className="text-fuchsia-400" />
                <span className="text-sm text-gray-300">Gestión de pedidos fácil</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                <Headphones size={18} className="text-fuchsia-400" />
                <span className="text-sm text-gray-300">Soporte dedicado</span>
              </div>
            </div>

            {/* ESTADÍSTICAS */}
            <div className="flex items-center gap-10 pt-4">
              <div>
                <p className="text-3xl font-bold text-white">50K+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Clientes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">12K+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Vendedores</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">98%</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Satisfacción</p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO */}
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <div className="bg-[#1a1638]/60 backdrop-blur-xl border border-fuchsia-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

              <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-600/20 rounded-full blur-3xl"></div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 p-3 rounded-xl shadow-lg">
                    <Store size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Iniciar Sesión</h2>
                    <p className="text-sm text-gray-400">Panel de Vendedor — Pochita Store</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vendedor@ejemplo.com"
                        className="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-medium py-3.5 rounded-xl transition shadow-[0_4px_14px_0_rgba(192,38,211,0.39)] hover:shadow-[0_6px_20px_rgba(192,38,211,0.23)] disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? "Ingresando..." : "Ingresar al Panel"}
                    {!loading && <span className="text-lg">›</span>}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-800/60 text-center">
                  <p className="text-sm text-gray-500 mb-4">¿Eres nuevo?</p>
                  <Link
                    to="/register/vendedor"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white transition"
                  >
                    <Store size={16} />
                    <span>Crear cuenta de vendedor</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SECCIÓN: ¿POR QUÉ VENDER EN POCHITA STORE? */}
      <section className="border-t border-gray-800/60 bg-black/20 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Por qué vender en <span className="text-fuchsia-400">Pochita Store?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Somos la plataforma líder en comercio digital. Sin comisiones escondidas, con las mejores herramientas del mercado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1a1638]/40 border border-gray-800 rounded-2xl p-8 hover:bg-[#1a1638]/60 hover:border-fuchsia-500/30 transition duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-500/20">
                <TrendingUp size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Crece con nosotros</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Accede a miles de clientes activos diariamente. Nuestras herramientas de analytics te ayudan a optimizar tus ventas en tiempo real.
              </p>
            </div>

            <div className="bg-[#1a1638]/40 border border-gray-800 rounded-2xl p-8 hover:bg-[#1a1638]/60 hover:border-fuchsia-500/30 transition duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-fuchsia-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Seguridad garantizada</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Procesamos pagos con encriptación de extremo a extremo. Tu dinero y el de tus clientes siempre están protegidos.
              </p>
            </div>

            <div className="bg-[#1a1638]/40 border border-gray-800 rounded-2xl p-8 hover:bg-[#1a1638]/60 hover:border-fuchsia-500/30 transition duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                <Headphones size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Soporte dedicado</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nuestro equipo está disponible las 24 horas, los 7 días de la semana para ayudarte a crecer tu negocio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="border-t border-gray-800/80 bg-black/40 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Pochita Store. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-300 cursor-pointer transition">Privacidad</span>
            <span className="hover:text-gray-300 cursor-pointer transition">Términos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginVendedor;
