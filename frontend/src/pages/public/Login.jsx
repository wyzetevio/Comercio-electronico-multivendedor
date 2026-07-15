import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldCheck, Shield, Truck, RotateCcw, Zap } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from || "/";

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Easter Egg: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate("/admin-secure/login");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

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

      // Validamos estrictamente que sea un CLIENTE
      if (response.rol !== "CLIENTE") {
        setError("Acceso denegado. Exclusivo para clientes.");
        setLoading(false);
        return;
      }

      login(response);
      navigate(from);
    } catch (err) {
      setError(
        err.response?.data?.message || "Credenciales incorrectas. Intente de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 lg:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Side: Marketing Info (visible only on lg screens) */}
        <div className="hidden lg:flex w-full lg:w-1/2 flex-col space-y-8 text-left">
          {/* Logo */}
          <div className="flex items-center space-x-3 text-violet-600">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 shadow-sm">
              <LogIn className="h-6 w-6 text-violet-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              PochitaStore
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-600">
              Bienvenido de vuelta
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Tu tienda <br />
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                favorita te espera
              </span>
            </h1>
            <p className="max-w-md text-base text-gray-600">
              Miles de productos, los mejores precios y envíos rápidos a todo el país. Inicia sesión y descubre ofertas exclusivas.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-violet-100">
            <div>
              <p className="text-2xl font-bold text-gray-900">12K+</p>
              <p className="text-xs text-gray-500">Clientes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">50K+</p>
              <p className="text-xs text-gray-500">Productos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 flex items-center">
                4.9<span className="text-amber-400 text-lg ml-1">★</span>
              </p>
              <p className="text-xs text-gray-500">Calificación</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50/70 border border-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
              <Shield className="h-3.5 w-3.5" /> Pago Seguro
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50/70 border border-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
              <Truck className="h-3.5 w-3.5" /> Envío Gratis
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50/70 border border-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
              <RotateCcw className="h-3.5 w-3.5" /> Devoluciones
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50/70 border border-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
              <Zap className="h-3.5 w-3.5" /> Entrega Rápida
            </span>
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl border border-violet-100 bg-white/60 p-5 backdrop-blur-sm shadow-sm space-y-3">
            <p className="text-sm italic text-gray-600">
              "La mejor tienda online que encontré. Precios increíbles y atención al cliente de primera."
            </p>
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                M
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">María G.</p>
                <p className="text-[10px] text-gray-500">Lima, Perú · ★★★★★</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          {/* Mobile Logo (hidden on lg) */}
          <div className="flex lg:hidden justify-center items-center space-x-2 mb-6 text-violet-600">
            <LogIn className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight text-gray-900">
              PochitaStore
            </span>
          </div>

          <div className="w-full rounded-3xl bg-white p-8 shadow-xl shadow-violet-100/30 border border-violet-50/50 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-violet-200/50 hover:-translate-y-1">
            {/* Header Accent Pill */}
            <div className="mb-6 flex justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Acceso Seguro
              </span>
            </div>

            {/* Header Titles */}
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Iniciar Sesión
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-violet-600 hover:text-violet-700 transition"
                >
                  Regístrate gratis
                </Link>
              </p>
            </div>



            {/* Error Message */}
            {error && (
              <div className="mb-4">
                <Alerta message={error} type="error" />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 pr-4 py-3 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-violet-500/25 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 py-3 rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-violet-500/25 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>



              {/* Submit */}
              <Boton
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 active:scale-[0.98]"
              >
                {loading ? (
                  "Ingresando..."
                ) : (
                  <>
                    Ingresar a mi cuenta
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </Boton>
            </form>

            {/* SSL Footer */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-gray-400 text-center">
              <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
              <span>Conexión cifrada SSL 256-bit · Tu información está segura</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;

