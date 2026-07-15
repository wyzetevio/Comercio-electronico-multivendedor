import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store,
  TrendingUp,
  HeadphonesIcon,
  CreditCard,
  ChevronRight,
  Truck,
  ShieldCheck,
  Award,
  BookOpen
} from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import { useAuth } from "../../context/AuthContext";
import { registrarCliente, convertirEnVendedor } from "../../services/usuarioService";
import { login as loginService } from "../../services/authService";
import { crearTienda } from "../../services/tiendaService";
import { esRequerido, validarNombre, validarTelefono, validarDescripcion } from "../../utils/validators";

function RegistroVendedor() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Formulario unificado para usuarios no autenticados
  const [registroForm, setRegistroForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
  });

  // Formulario para la tienda
  const [tiendaForm, setTiendaForm] = useState({
    nombreTienda: "",
    descripcion: "",
    direccion: "",
    telefonoContacto: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegistroChange = (campo) => (e) => {
    setRegistroForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleTiendaChange = (campo) => (e) => {
    setTiendaForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 1. Validaciones de la Tienda (Comunes para todos)
    if (!esRequerido(tiendaForm.nombreTienda) || !validarNombre(tiendaForm.nombreTienda)) {
      setError("El nombre de la tienda debe tener al menos 3 caracteres.");
      return;
    }
    if (!esRequerido(tiendaForm.descripcion) || !validarDescripcion(tiendaForm.descripcion)) {
      setError("La descripción de la tienda debe tener al menos 10 caracteres.");
      return;
    }
    if (tiendaForm.telefonoContacto && !validarTelefono(tiendaForm.telefonoContacto)) {
      setError("El teléfono de contacto debe tener exactamente 9 dígitos.");
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        // --- CASO A: REGISTRO DIRECTO DESDE CERO ---
        // Validaciones del Usuario
        if (!esRequerido(registroForm.nombres) || registroForm.nombres.trim().length < 2) {
          setError("El nombre es obligatorio y debe ser válido.");
          setLoading(false);
          return;
        }
        if (!esRequerido(registroForm.apellidos) || registroForm.apellidos.trim().length < 2) {
          setError("El apellido es obligatorio.");
          setLoading(false);
          return;
        }
        if (!esRequerido(registroForm.email) || !registroForm.email.includes("@")) {
          setError("Por favor ingresa un correo electrónico válido.");
          setLoading(false);
          return;
        }
        if (!registroForm.password || registroForm.password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres.");
          setLoading(false);
          return;
        }

        // a. Registrar el usuario directamente con Rol VENDEDOR
        const nuevoUsuario = await registrarCliente({
          nombres: registroForm.nombres,
          apellidos: registroForm.apellidos,
          email: registroForm.email,
          password: registroForm.password,
          rol: "VENDEDOR"
        });

        // b. Iniciar sesión automáticamente
        const authData = await loginService({
          email: registroForm.email,
          password: registroForm.password
        });
        login(authData);

        // c. Crear la Tienda usando el idUsuario directamente
        await crearTienda(authData.idUsuario, {
          nombreTienda: tiendaForm.nombreTienda,
          descripcion: tiendaForm.descripcion,
          direccion: tiendaForm.direccion || undefined,
          telefonoContacto: tiendaForm.telefonoContacto || undefined,
        });

      } else {
        // --- CASO B: EL USUARIO YA TIENE SESIÓN (CLIENTE UPGRADE A VENDEDOR) ---
        // Aquí SÍ necesitamos convertirlo primero porque antes era CLIENTE
        await convertirEnVendedor(user.idUsuario);

        await crearTienda(user.idUsuario, {
          nombreTienda: tiendaForm.nombreTienda,
          descripcion: tiendaForm.descripcion,
          direccion: tiendaForm.direccion || undefined,
          telefonoContacto: tiendaForm.telefonoContacto || undefined,
        });

        // Actualizar el estado de la sesión local para cambiar a VENDEDOR
        login({
          ...user,
          rol: "VENDEDOR",
        });
      }

      setSuccess("¡Tu perfil de vendedor y tienda han sido creados con éxito! Redirigiendo...");

      // Esperamos 2 segundos y forzamos una recarga o redirección limpia
      setTimeout(() => {
        navigate("/vendedor");
        window.location.reload(); // Recarga para asegurar que StoreContext lea la tienda fresca
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message || "Ocurrió un error durante el registro. Por favor intente de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("formulario-registro");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. SECCIÓN HERO (Conservada de Pochita Store) */}
      <section className="relative overflow-hidden bg-[#0f172a] text-white py-24 lg:py-32">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-violet-600/30 blur-[80px]"></div>
        <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <Store className="mx-auto h-16 w-16 text-violet-400 mb-6" />
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl mb-6">
            Lleva tu negocio al <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">siguiente nivel</span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Únete a nuestra plataforma líder y llega a miles de clientes activos cada día. Sin costos ocultos, con las mejores herramientas del mercado.
          </p>
          <Boton
            onClick={scrollToForm}
            className="rounded-full bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 text-lg shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 mx-auto"
          >
            Empezar a vender ahora <ChevronRight size={20} />
          </Boton>
        </div>
      </section>

      {/* 2. SECCIÓN DIFERENCIADORES (Estilo Saga Falabella) */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
              - ¿Qué nos diferencia de otros canales? -
            </h2>
            <p className="mt-3 text-gray-500">
              Ofrecemos el respaldo, la flexibilidad y la tecnología que tu negocio merece.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-violet-100 rounded-full flex items-center justify-center mb-4 text-violet-600">
                <Truck size={30} />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Envíos simplificados</h3>
              <p className="text-xs text-gray-500 max-w-[180px]">Logística inteligente y entregas rápidas a todo el país.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-fuchsia-100 rounded-full flex items-center justify-center mb-4 text-fuchsia-600">
                <ShieldCheck size={30} />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Pagos seguros</h3>
              <p className="text-xs text-gray-500 max-w-[180px]">Liquidaciones semanales automáticas y transparentes.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                <TrendingUp size={30} />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Mayor visibilidad</h3>
              <p className="text-xs text-gray-500 max-w-[180px]">Exposición diaria ante miles de compradores listos.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                <Store size={30} />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Control absoluto</h3>
              <p className="text-xs text-gray-500 max-w-[180px]">Gestiona tu catálogo, inventario y ventas con total autonomía.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN POTENCIAL (Estilo Saga Falabella) */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">
              En Pochita Store creemos en tu potencial
            </h2>
            <p className="mt-4 text-gray-600">
              Te impulsamos a construir tu propio éxito a través de un ecosistema digital robusto.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="h-10 w-10 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center mb-4">
                <Award size={20} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Acceso a promociones</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Participa en campañas comerciales exclusivas para multiplicar tus ventas semanales.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="h-10 w-10 bg-fuchsia-50 text-fuchsia-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={20} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Plan de ventas</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Estrategias a tu medida con proyecciones y sugerencias para expandir tu catálogo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <CreditCard size={20} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Atractivas comisiones</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Las comisiones más competitivas del mercado, optimizando la rentabilidad de tu negocio.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <BookOpen size={20} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Capacitación y asesoría</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Recibe tutoriales y atención personalizada para que aprendas a digitalizar tu stock rápido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN FORMULARIO (Sección interactiva inteligente) */}
      <section id="formulario-registro" className="py-24 bg-white">
        <div className="mx-auto max-w-xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Abre tu tienda hoy</h2>
            <p className="mt-3 text-gray-600">Completa tus datos y empieza a vender en minutos.</p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            {user && user.rol === "VENDEDOR" ? (
              // --- CASO C: YA ES VENDEDOR ---
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Store size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ya eres vendedor</h3>
                <p className="mt-2 text-gray-500 text-sm mb-6">
                  Tu tienda ya está activa. Puedes gestionar tus productos y ventas desde tu panel.
                </p>
                <Boton className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate("/vendedor")}>
                  Ir al panel de vendedor
                </Boton>
              </div>
            ) : (
              // --- CASO A y B: FORMULARIO DE REGISTRO / UPGRADE ---
              <>
                {error && <div className="mb-6"><Alerta message={error} type="error" /></div>}
                {success && <div className="mb-6"><Alerta message={success} type="success" /></div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* SECCIÓN 1: DATOS PERSONALES (Solo se muestra a usuarios sin sesión) */}
                  {!user && (
                    <div className="space-y-4 border-b border-gray-100 pb-6">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-violet-600 mb-2">
                        1. Datos Personales
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">Nombres *</label>
                          <Input
                            placeholder="Ej. Juan"
                            value={registroForm.nombres}
                            onChange={handleRegistroChange("nombres")}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">Apellidos *</label>
                          <Input
                            placeholder="Ej. Pérez"
                            value={registroForm.apellidos}
                            onChange={handleRegistroChange("apellidos")}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Correo Electrónico *</label>
                        <Input
                          type="email"
                          placeholder="juan@ejemplo.com"
                          value={registroForm.email}
                          onChange={handleRegistroChange("email")}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Contraseña *</label>
                        <Input
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={registroForm.password}
                          onChange={handleRegistroChange("password")}
                        />
                      </div>
                    </div>
                  )}

                  {/* SECCIÓN 2: DATOS DE LA TIENDA */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-violet-600 mb-2">
                      {user ? "1. Configuración de tu Tienda" : "2. Datos de tu Tienda"}
                    </h4>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Nombre de la Tienda *</label>
                      <Input
                        placeholder="Ej. Mi Tienda Tecnológica"
                        value={tiendaForm.nombreTienda}
                        onChange={handleTiendaChange("nombreTienda")}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Descripción de tu Tienda *</label>
                      <textarea
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                        rows={3}
                        placeholder="Describe los productos que vas a ofrecer..."
                        value={tiendaForm.descripcion}
                        onChange={handleTiendaChange("descripcion")}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Dirección (Opcional)</label>
                        <Input
                          placeholder="Ej. Av. Larco 123"
                          value={tiendaForm.direccion}
                          onChange={handleTiendaChange("direccion")}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Teléfono (Opcional)</label>
                        <Input
                          type="tel"
                          placeholder="999888777"
                          value={tiendaForm.telefonoContacto}
                          onChange={handleTiendaChange("telefonoContacto")}
                        />
                      </div>
                    </div>
                  </div>

                  <Boton
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-4 shadow-lg shadow-violet-200 text-base"
                  >
                    {loading ? "Procesando registro..." : "Crear mi perfil y tienda"}
                  </Boton>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default RegistroVendedor;
