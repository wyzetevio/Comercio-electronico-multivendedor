import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Tag, ShieldCheck, Truck, Heart, Eye, EyeOff } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import { registrarCliente } from "../../services/usuarioService";
import {
  esRequerido,
  validarEmail,
  validarPassword,
  confirmarPassword,
  validarNombre,
} from "../../utils/validators";

function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: "",
    email: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
    aceptaTerminos: true
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  // States for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (campo) => (e) => {
    // Si es un checkbox, leemos checked, si no, value
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [campo]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!esRequerido(form.nombres) || !validarNombre(form.nombres)) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!validarEmail(form.email)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }
    if (!validarPassword(form.password)) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!confirmarPassword(form.password, form.confirmarPassword)) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!form.aceptaTerminos) {
      setError("Debe aceptar los Términos y Condiciones.");
      return;
    }
    setLoading(true);
    try {
      await registrarCliente({
        nombres: form.nombres,
        apellidos: "",
        email: form.email,
        password: form.password,
      });

      setSuccess("Registro exitoso. Redirigiendo al inicio de sesión...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Error al registrar. Intente de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-transparent">
      <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-violet-100">
        
        {/* Lado Izquierdo: Beneficios y Marketing */}
        <div className="lg:w-[45%] bg-gradient-to-br from-violet-50 to-fuchsia-50 p-10 flex flex-col justify-center items-center text-center hidden lg:flex relative overflow-hidden">
          {/* Elementos decorativos (círculos difuminados) */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

          {/* Contenido */}
          <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
            {/* Ícono grande o ilustración simulada */}
            <div className="w-32 h-32 bg-violet-600 rounded-3xl shadow-xl flex items-center justify-center mb-8 transform -rotate-12 hover:rotate-0 transition-transform duration-500 relative">
               <span className="text-6xl text-white font-extrabold">P</span>
               {/* Badge decorativo */}
               <div className="absolute -bottom-3 -right-3 bg-red-400 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                 <Heart size={20} className="text-white" fill="currentColor" />
               </div>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Únete a Pochita Store
            </h2>
            <p className="text-gray-600 mb-8 text-sm">
              Crea tu cuenta y disfruta de todos los beneficios que tenemos para ti.
            </p>

            <div className="space-y-5 text-left w-full">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <Tag size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Ofertas exclusivas</h4>
                  <p className="text-xs text-gray-500">Solo para miembros</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Compra 100% segura</h4>
                  <p className="text-xs text-gray-500">y protegida</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Envíos rápidos</h4>
                  <p className="text-xs text-gray-500">a todo el país</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Guarda tus favoritos</h4>
                  <p className="text-xs text-gray-500">y mucho más</p>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="font-bold text-violet-600 hover:underline">
                  Inicia sesión →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="lg:w-[55%] p-8 md:p-12">
          <div className="mb-8 text-center">
            <div className="mx-auto h-16 w-16 bg-violet-50 rounded-full flex items-center justify-center mb-4">
               <UserPlus className="h-8 w-8 text-violet-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Crear cuenta
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Completa tus datos para comenzar a comprar
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Alerta message={error} type="error" />
            </div>
          )}
          {success && (
            <div className="mb-6">
              <Alerta message={success} type="success" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Nombres completos
              </label>
              <Input
                placeholder="Ej: Juan Carlos Pérez"
                value={form.nombres}
                onChange={handleChange("nombres")}
                className="py-2.5 px-4 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="Ej: juan@email.com"
                value={form.email}
                onChange={handleChange("email")}
                className="py-2.5 px-4 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>

            {/* Teléfono Mock */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Teléfono <span className="font-normal text-gray-400">(opcional)</span>
              </label>
              <Input
                type="tel"
                placeholder="Ej: 987 654 321"
                value={form.telefono}
                onChange={handleChange("telefono")}
                className="py-2.5 px-4 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={form.password}
                    onChange={handleChange("password")}
                    className="py-2.5 px-4 bg-gray-50 border-gray-200 focus:bg-white pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={form.confirmarPassword}
                    onChange={handleChange("confirmarPassword")}
                    className="py-2.5 px-4 bg-gray-50 border-gray-200 focus:bg-white pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox Términos */}
            <div className="flex items-start mt-2">
              <div className="flex items-center h-5">
                <input
                  id="terminos"
                  type="checkbox"
                  checked={form.aceptaTerminos}
                  onChange={handleChange("aceptaTerminos")}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-violet-300 cursor-pointer"
                />
              </div>
              <label htmlFor="terminos" className="ml-2 text-sm font-medium text-gray-600 cursor-pointer">
                Acepto los <a href="#" className="text-violet-600 hover:underline">Términos y Condiciones</a> y la <a href="#" className="text-violet-600 hover:underline">Política de Privacidad</a>
              </label>
            </div>

            <Boton type="submit" disabled={loading} className="w-full py-3 mt-4 text-base shadow-lg shadow-violet-200">
              {loading ? "Registrando..." : "Crear cuenta"}
            </Boton>
          </form>



          <div className="mt-8 text-center text-sm text-gray-500 lg:hidden">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="font-bold text-violet-600 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Registro;
