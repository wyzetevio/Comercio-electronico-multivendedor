import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  MapPin,
  Truck,
  ShieldCheck,
  RefreshCw,
  Tag,
  ChevronLeft,
  Plus,
  Edit2,
  Home,
  Briefcase,
  Building,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  ShoppingCart
} from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import Spinner from "../../components/ui/Spinner";
import confetti from "canvas-confetti";
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { realizarCheckout, obtenerDetallesOrden } from "../../services/ordenService";
import { registrarPago, aprobarPago } from "../../services/pagoService";
import { listarDirecciones, guardarDireccion, eliminarDireccion } from "../../services/direccionService";
import { formatearPrecio } from "../../utils/formatters";

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getCartTotal, clearCart, cuponAplicado } = useCart();
  const pdfRef = useRef(null);

  // Estados de control de flujo (Fases del Checkout)
  // Fase 2 = Dirección, Fase 3 = Pago, Fase 4 = Confirmación
  const [fase, setFase] = useState(2);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (fase === 4) {
      triggerConfetti();
    }
  }, [fase]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8B5CF6', '#C084FC', '#FBBF24'] // Violet, Fuchsia, Yellow
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8B5CF6', '#C084FC', '#FBBF24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Datos de Dirección (Fase 2)
  const [direcciones, setDirecciones] = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [tipoEnvio, setTipoEnvio] = useState("ESTANDAR"); // ESTANDAR, EXPRESS, RECOJO
  const [cargandoDirecciones, setCargandoDirecciones] = useState(true);

  // Formulario para Agregar/Editar Dirección
  const [mostrarFormDireccion, setMostrarFormDireccion] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formDireccion, setFormDireccion] = useState({
    etiqueta: "Casa", // Casa, Trabajo, Otro
    departamento: "Lima",
    provincia: "Lima",
    distrito: "",
    direccion: "",
    referencia: "",
  });

  // Datos de Pago (Fase 3)
  const [metodoPago, setMetodoPago] = useState("TARJETA"); // TARJETA, YAPE, PLIN, TRANSFERENCIA
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: "",
    nombre: "",
    expiracion: "",
    cvv: ""
  });

  // Datos post-checkout
  const [ordenCreada, setOrdenCreada] = useState(null);
  const [itemsComprados, setItemsComprados] = useState([]);

  // Novedades Fase 3 Simulada
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [codigoValidacion, setCodigoValidacion] = useState("");
  const [errorValidacion, setErrorValidacion] = useState("");
  const [procesandoPago, setProcesandoPago] = useState(false);

  // Estados generales
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar direcciones del usuario al iniciar
  useEffect(() => {
    if (user && user.idUsuario) {
      cargarDireccionesUsuario();
    }
  }, [user]);

  const cargarDireccionesUsuario = async () => {
    setCargandoDirecciones(true);
    try {
      const data = await listarDirecciones(user.idUsuario);
      setDirecciones(data);
      // Seleccionar predeterminada o la primera por defecto
      if (data.length > 0) {
        const predet = data.find(d => d.esPredeterminada) || data[0];
        setDireccionSeleccionada(predet);
      }
    } catch (err) {
      console.error("Error al cargar direcciones:", err);
      setError("No se pudieron cargar tus direcciones guardadas.");
    } finally {
      setCargandoDirecciones(false);
    }
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="text-center bg-white p-8 rounded-3xl shadow-md max-w-sm border border-gray-100">
          <AlertCircle size={48} className="mx-auto text-violet-500 mb-4 animate-bounce" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Inicia sesión para continuar</h1>
          <p className="text-sm text-gray-400 mb-6">Necesitas identificarte como cliente para realizar tu compra.</p>
          <Boton className="w-full rounded-xl py-3" onClick={() => navigate("/login", { state: { from: "/checkout" } })}>
            Iniciar sesión
          </Boton>
        </div>
      </main>
    );
  }

  if (items.length === 0 && fase !== 4) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] px-6 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-md max-w-md border border-gray-100">
          <ShoppingCart size={48} className="mx-auto text-violet-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
          <p className="text-sm text-gray-400 mb-6">Agrega algunos productos antes de proceder al pago.</p>
          <Boton className="w-full rounded-xl py-3" onClick={() => navigate("/catalogo")}>
            Ir al catálogo
          </Boton>
        </div>
      </main>
    );
  }

  // Cálculos de Totales
  const subtotal = getCartTotal();
  const totalAhorrado = items.reduce((acc, item) => {
    const producto = item.producto || item;
    const precioNormal = (producto.precio || 0) * 1.15;
    const descuento = precioNormal - (producto.precio || 0);
    return acc + (descuento * item.cantidad);
  }, 0);

  const descuentoCupon = cuponAplicado ? (subtotal * (cuponAplicado.descuentoPorcentaje / 100)) : 0;

  // Costo del tipo de envío
  const costoEnvio = tipoEnvio === "EXPRESS" ? 15 : 0;

  const total = subtotal - descuentoCupon + costoEnvio;

  // Lógica de formulario de direcciones
  const handleGuardarDireccion = async (e) => {
    e.preventDefault();
    if (!formDireccion.distrito.trim() || !formDireccion.direccion.trim()) {
      setError("Por favor completa los campos obligatorios (Distrito y Dirección).");
      return;
    }

    try {
      const nuevaDireccion = {
        ...formDireccion,
        idDireccion: editandoId,
        esPredeterminada: direcciones.length === 0, // Predeterminada si es la primera
      };

      const guardada = await guardarDireccion(nuevaDireccion, user.idUsuario);

      // Actualizar lista local
      await cargarDireccionesUsuario();
      setDireccionSeleccionada(guardada);

      // Resetear formulario
      setFormDireccion({
        etiqueta: "Casa",
        departamento: "Lima",
        provincia: "Lima",
        distrito: "",
        direccion: "",
        referencia: "",
      });
      setMostrarFormDireccion(false);
      setEditandoId(null);
      setError("");
    } catch (err) {
      console.error("Error al guardar dirección:", err);
      setError("Ocurrió un error al guardar la dirección.");
    }
  };

  const handleEditarDireccion = (dir) => {
    setFormDireccion({
      etiqueta: dir.etiqueta,
      departamento: dir.departamento,
      provincia: dir.provincia,
      distrito: dir.distrito,
      direccion: dir.direccion,
      referencia: dir.referencia || "",
    });
    setEditandoId(dir.idDireccion);
    setMostrarFormDireccion(true);
  };

  const handleEliminarDireccion = async (id) => {
    if (confirm("¿Estás seguro de eliminar esta dirección?")) {
      try {
        await eliminarDireccion(id);
        await cargarDireccionesUsuario();
      } catch (err) {
        console.error(err);
        setError("Error al eliminar la dirección.");
      }
    }
  };

  // Abrir Modal de Validación de Pago
  const abrirModalValidacion = (e) => {
    if (e) e.preventDefault();
    if (!direccionSeleccionada) {
      setError("Selecciona o agrega una dirección de envío.");
      return;
    }
    setErrorValidacion("");
    setCodigoValidacion("");
    setMostrarModalPago(true);
  };

  // Enviar Checkout (Real - Simulado)
  const handleConfirmarPagoReal = async () => {
    if (!codigoValidacion.trim()) {
      setErrorValidacion("El código es obligatorio para validar el pago.");
      return;
    }

    setProcesandoPago(true);
    setErrorValidacion("");

    try {
      // Simular delay de banco
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 1. Crear la Orden
      const orden = await realizarCheckout(
        user.idUsuario, 
        direccionSeleccionada.idDireccion,
        cuponAplicado?.codigo
      );

      // 2. Registrar el Pago (Se queda como PENDIENTE para que el admin lo apruebe)
      const pago = await registrarPago(orden.idOrden, metodoPago);

      // 3. Obtener detalles reales de la orden y Limpiar carrito
      const detallesReales = await obtenerDetallesOrden(orden.idOrden);
      setItemsComprados(detallesReales);
      await clearCart();
      setOrdenCreada(orden);
      setMostrarModalPago(false);
      setFase(4);
    } catch (err) {
      console.error(err);
      setErrorValidacion(err.response?.data?.message || "Error al procesar el pago. Intente de nuevo.");
    } finally {
      setProcesandoPago(false);
    }
  };

  // Función para generar PDF usando html-to-image (Soporta colores modernos como oklab)
  const generatePDF = async () => {
    const element = pdfRef.current;
    if (!element) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Configuramos para que tenga un fondo blanco puro y renderice bien las fuentes
      const dataUrl = await toPng(element, { 
        quality: 1.0,
        backgroundColor: '#ffffff',
        pixelRatio: 2, // Alta definición
        filter: (node) => {
          // Ignorar las etiquetas <img> para evitar el crasheo por seguridad (CORS [object Event])
          if (node.tagName && node.tagName.toUpperCase() === 'IMG') {
            return false; 
          }
          return true;
        }
      });
      
      // Inicializar documento PDF (A4 en formato vertical)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Dimensiones de A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular aspecto de la imagen capturada para que encaje
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pdfWidth - 20; // 10mm margen por lado
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      // Agregar la imagen al PDF (x=10, y=10)
      pdf.addImage(dataUrl, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Descargar el archivo
      pdf.save(`comprobante_PCH2026_${ordenCreada?.idOrden || '0000'}.pdf`);
      
      setIsGeneratingPDF(false);
    } catch (err) {
      console.error("Error crítico al generar PDF:", err);
      setIsGeneratingPDF(false);
      alert(`Error técnico: ${err.message || err}\n\nUsa Ctrl+P como alternativa.`);
    }
  };

  // Botón principal
  const handleDownloadPDF = () => {
    generatePDF();
  };

  // Componente del Stepper Header
  const renderStepper = () => (
    <div className="mx-auto mb-10 max-w-4xl rounded-2xl bg-white px-8 py-5 shadow-sm border border-gray-100 hidden md:flex items-center justify-between text-sm font-medium print:hidden">
      <div className="flex items-center text-violet-600">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-600 mr-2">✓</span>
        Mi carrito
      </div>
      <div className="h-px w-16 bg-violet-200"></div>

      <div className={`flex items-center ${fase >= 2 ? "text-violet-600" : "text-gray-400"}`}>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full mr-2 ${fase === 2 ? "bg-violet-600 text-white" : fase > 2 ? "bg-violet-100 text-violet-600" : "bg-gray-100 text-gray-500"}`}>
          {fase > 2 ? "✓" : "2"}
        </span>
        Dirección
      </div>
      <div className={`h-px w-16 ${fase >= 3 ? "bg-violet-200" : "bg-gray-200"}`}></div>

      <div className={`flex items-center ${fase >= 3 ? "text-violet-600" : "text-gray-400"}`}>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full mr-2 ${fase === 3 ? "bg-violet-600 text-white" : fase > 3 ? "bg-violet-100 text-violet-600" : "bg-gray-100 text-gray-500"}`}>
          {fase > 3 ? "✓" : "3"}
        </span>
        Pago
      </div>
      <div className={`h-px w-16 ${fase >= 4 ? "bg-violet-200" : "bg-gray-200"}`}></div>

      <div className={`flex items-center ${fase === 4 ? "text-violet-600" : "text-gray-400"}`}>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full mr-2 ${fase === 4 ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-500"}`}>
          4
        </span>
        Confirmación
      </div>
    </div>
  );

  // Icono para la tarjeta de dirección
  const obtenerIconoDireccion = (etiqueta) => {
    if (!etiqueta) return <Building size={18} />;
    switch (etiqueta.toLowerCase()) {
      case "casa":
        return <Home size={18} />;
      case "trabajo":
        return <Briefcase size={18} />;
      default:
        return <Building size={18} />;
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {fase !== 4 && (
          <button
            onClick={() => {
              if (fase === 2) navigate("/carrito");
              if (fase === 3) setFase(2);
            }}
            className="mb-6 inline-flex items-center text-sm font-medium text-gray-400 hover:text-violet-600 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            {fase === 2 ? "Volver al carrito" : "Volver a la dirección"}
          </button>
        )}

        {renderStepper()}

        {error && (
          <div className="mb-6">
            <Alerta message={error} type="error" />
          </div>
        )}

        {fase === 4 ? (
          // ================= FASE 4: CONFIRMACIÓN DE ÉXITO =================
          <div className="mx-auto max-w-3xl space-y-6">

            <div ref={pdfRef} className="space-y-6 p-4 bg-white/50 rounded-3xl">
            {/* Box 1: Cabecera de Éxito */}
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#E8F8F0] text-[#1EC971] relative">
                <CheckCircle2 size={50} />
                <div className="absolute -top-2 -right-2 text-2xl">🎉</div>
              </div>
              <h1 className="text-3xl font-extrabold text-[#1A1F36] mb-2 tracking-tight">¡Pedido confirmado!</h1>
              <p className="text-gray-500 text-sm mb-1">Gracias por tu compra en <strong className="text-violet-700">Pochita Store</strong></p>
              <p className="text-gray-400 text-xs mb-6">Te enviamos un correo de confirmación a <strong>{user.email}</strong></p>

              <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 px-6 py-2.5 rounded-full font-bold text-sm border border-violet-100">
                <Tag size={16} /> Pedido N° PCH-2026-{ordenCreada?.idOrden || "0000"}
              </div>
            </div>

            {/* Box 2: Detalle de tu pedido */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                <ShoppingCart className="text-violet-600" size={20} /> Detalle de tu pedido
              </h3>

              <div className="space-y-4 mb-6">
                {(Array.isArray(itemsComprados) ? itemsComprados : []).map((item, idx) => {
                  const producto = item.producto || item;

                  // Extraer imagen (los productos nuevos guardan sus imagenes en un array)
                  const imgUrl = (producto.imagenes && producto.imagenes.length > 0)
                    ? producto.imagenes[0].url
                    : (producto.imagenPrincipal || "https://placehold.co/400?text=No+Image");

                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-white p-1 border overflow-hidden flex-shrink-0">
                          <img src={imgUrl} alt={producto.nombre} className="h-full w-full object-cover rounded-lg" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm leading-tight">{producto.nombre || "Producto"}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{producto.marca || producto.categoria?.nombre || "Tienda"} • x{item.cantidad}</p>
                          <p className="text-[10px] text-violet-600 font-semibold mt-1 bg-violet-50 inline-block px-2 py-0.5 rounded">Vendido por Pochita Store</p>
                        </div>
                      </div>
                      <div className="font-extrabold text-gray-900">
                        {formatearPrecio((item.precioUnitario || producto.precio || 0) * item.cantidad)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">
                    {formatearPrecio((Array.isArray(itemsComprados) ? itemsComprados : []).reduce((acc, item) => acc + ((item.precioUnitario || (item.producto || item).precio || 0) * item.cantidad), 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="font-bold text-green-500">{costoEnvio === 0 ? "Gratis" : formatearPrecio(costoEnvio)}</span>
                </div>
                {ordenCreada?.descuento > 0 && (
                  <div className="flex justify-between text-violet-600">
                    <span>Descuento cupón ({ordenCreada.codigoCupon})</span>
                    <span className="font-bold">-{formatearPrecio(ordenCreada.descuento)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-4 mt-2">
                  <span className="font-extrabold text-gray-900 text-lg">Total pagado</span>
                  <span className="font-black text-violet-700 text-xl">
                    {formatearPrecio(ordenCreada?.total || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 3: Dirección y Tiempo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">Dirección de entrega</h4>
                  <p className="font-semibold text-gray-700 text-xs">{user.nombres}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{direccionSeleccionada?.direccion}</p>
                  <p className="text-gray-500 text-xs">{direccionSeleccionada?.distrito}, {direccionSeleccionada?.departamento}</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">Tiempo estimado</h4>
                  <p className="font-semibold text-gray-700 text-xs">{tipoEnvio === "EXPRESS" ? "Envío express" : "Envío estándar"}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Entrega estimada:</p>
                  <p className="font-bold text-violet-700 text-xs mt-0.5">Lun 14 — Mié 16 de Julio</p>
                </div>
              </div>
            </div>
            </div> {/* Fin de ref pdf */}

            {/* Box 4: Estado del pedido (Stepper vertical) - Oculto al imprimir */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 print:hidden">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-sm">
                <ShieldCheck className="text-violet-600" size={18} /> Estado del pedido
              </h3>

              <div className="relative pl-4 space-y-6">
                <div className="absolute left-6 top-4 bottom-4 w-px bg-gray-200"></div>

                <div className="relative flex items-start gap-4">
                  <div className="h-5 w-5 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 z-10 shadow-md">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-violet-700 text-sm">Pedido confirmado</h4>
                    <p className="text-xs text-gray-400">Hoy, 13 Jul - 3:45 PM</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="h-5 w-5 rounded-full bg-white border-2 border-gray-300 text-gray-300 flex items-center justify-center shrink-0 z-10">
                    <span className="text-[10px] font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-500 text-sm">En preparación</h4>
                    <p className="text-xs text-gray-400">Estimado: Hoy, 13 Jul</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="h-5 w-5 rounded-full bg-white border-2 border-gray-300 text-gray-300 flex items-center justify-center shrink-0 z-10">
                    <span className="text-[10px] font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-500 text-sm">En camino</h4>
                    <p className="text-xs text-gray-400">Estimado: Lun, 14 Jul</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="h-5 w-5 rounded-full bg-white border-2 border-gray-300 text-gray-300 flex items-center justify-center shrink-0 z-10">
                    <span className="text-[10px] font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-500 text-sm">Entregado</h4>
                    <p className="text-xs text-gray-400">Estimado: Mar, 15 Jul</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones - Oculto al imprimir */}
            <div className="flex flex-col md:flex-row gap-4 pt-6 print:hidden">
              <button 
                onClick={handleDownloadPDF} 
                className={`flex-1 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 px-4 font-bold hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 text-sm sm:text-base`}
              >
                {isGeneratingPDF ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Descargar PDF
                  </>
                )}
              </button>
              
              <button 
                onClick={() => navigate("/mis-pedidos", { state: { expandOrderId: ordenCreada?.idOrden } })}
                className="flex-1 rounded-2xl border-2 border-violet-100 bg-violet-50/50 text-violet-700 py-3.5 px-4 font-bold hover:bg-violet-100 hover:border-violet-200 transition-colors flex justify-center items-center gap-2 text-sm sm:text-base"
              >
                <MapPin size={20} /> 
                Rastrear envío
              </button>
              
              <button 
                onClick={() => navigate("/")} 
                className="flex-1 rounded-2xl border-2 border-gray-100 bg-white text-gray-700 py-3.5 px-4 font-bold hover:bg-gray-50 hover:border-gray-200 transition-colors flex justify-center items-center gap-2 text-sm sm:text-base"
              >
                <ShoppingCart size={20} /> 
                Volver a tienda
              </button>
            </div>
          </div>
        ) : (
          // ================= FASES ACTIVAS (2 & 3): GRID LATERAL RESUMEN =================
          <div className="grid gap-6 lg:grid-cols-3 items-start">

            {/* PANEL IZQUIERDO: FORMULARIO SEGÚN FASE */}
            <div className="lg:col-span-2 space-y-6">

              {fase === 2 && (
                // ================= FASE 2: DIRECCIÓN DE ENTREGA =================
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-[#1A1F36] tracking-tight mb-2">Dirección de entrega</h1>
                    <p className="text-sm text-gray-400">Selecciona o agrega la ubicación donde enviaremos tus productos.</p>
                  </div>

                  {/* Lista de Direcciones */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Mis direcciones guardadas</h3>

                    {cargandoDirecciones ? (
                      <div className="flex justify-center p-8"><Spinner /></div>
                    ) : direcciones.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-400">
                        No tienes direcciones guardadas. Agrega una nueva abajo.
                      </div>
                    ) : (
                      direcciones.map((dir) => {
                        const isSelected = direccionSeleccionada?.idDireccion === dir.idDireccion;
                        return (
                          <div
                            key={dir.idDireccion}
                            onClick={() => setDireccionSeleccionada(dir)}
                            className={`flex cursor-pointer items-start justify-between rounded-3xl bg-white p-6 shadow-sm transition-all border ${isSelected ? "border-violet-500 ring-2 ring-violet-500/10" : "border-gray-100 hover:border-gray-200"}`}
                          >
                            <div className="flex gap-4">
                              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isSelected ? "bg-violet-100 text-violet-600" : "bg-gray-50 text-gray-500"}`}>
                                {obtenerIconoDireccion(dir.etiqueta)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-gray-900">{dir.etiqueta}</span>
                                  {dir.esPredeterminada && (
                                    <span className="rounded bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-600">Predeterminada</span>
                                  )}
                                </div>
                                <p className="text-sm font-semibold text-gray-700">{user.nombres}</p>
                                <p className="text-sm text-gray-500">{dir.direccion}, {dir.distrito}, {dir.provincia}</p>
                                {dir.referencia && <p className="text-xs text-gray-400 mt-1">Ref: {dir.referencia}</p>}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditarDireccion(dir);
                                }}
                                className="text-gray-400 hover:text-violet-600 transition-colors p-1"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEliminarDireccion(dir.idDireccion);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                              <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${isSelected ? "border-violet-600 bg-violet-600 text-white" : "border-gray-300"}`}>
                                {isSelected && <div className="h-2 w-2 rounded-full bg-white"></div>}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Formulario / Botón de agregar dirección */}
                  {mostrarFormDireccion ? (
                    <form onSubmit={handleGuardarDireccion} className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
                      <div className="flex items-center justify-between border-b pb-3 mb-2">
                        <h3 className="font-bold text-gray-900">{editandoId ? "Editar Dirección" : "Agregar Nueva Dirección"}</h3>
                        <button
                          type="button"
                          onClick={() => {
                            setMostrarFormDireccion(false);
                            setEditandoId(null);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Etiqueta</label>
                          <select
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-violet-500 bg-white"
                            value={formDireccion.etiqueta}
                            onChange={(e) => setFormDireccion({ ...formDireccion, etiqueta: e.target.value })}
                          >
                            <option value="Casa">Casa</option>
                            <option value="Trabajo">Trabajo</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Distrito *</label>
                          <Input
                            placeholder="Ej: San Isidro"
                            value={formDireccion.distrito}
                            onChange={(e) => setFormDireccion({ ...formDireccion, distrito: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dirección Completa *</label>
                        <Input
                          placeholder="Ej: Av. Javier Prado 1234, Apt 5B"
                          value={formDireccion.direccion}
                          onChange={(e) => setFormDireccion({ ...formDireccion, direccion: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Referencia (Opcional)</label>
                        <Input
                          placeholder="Ej: Frente al parque"
                          value={formDireccion.referencia}
                          onChange={(e) => setFormDireccion({ ...formDireccion, referencia: e.target.value })}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setMostrarFormDireccion(false);
                            setEditandoId(null);
                          }}
                          className="rounded-xl border px-5 py-2.5 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <Boton type="submit" className="rounded-xl px-6 py-2.5 font-semibold">
                          Guardar dirección
                        </Boton>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setMostrarFormDireccion(true)}
                      className="w-full rounded-2xl border border-dashed border-violet-300 p-4 text-center font-bold text-violet-600 hover:bg-violet-50 transition-colors flex justify-center items-center gap-2"
                    >
                      <Plus size={18} /> Agregar nueva dirección
                    </button>
                  )}

                  {/* Tipo de Entrega */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Tipo de entrega</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* Estándar */}
                      <div
                        onClick={() => setTipoEnvio("ESTANDAR")}
                        className={`flex cursor-pointer items-start justify-between rounded-3xl bg-white p-5 shadow-sm border ${tipoEnvio === "ESTANDAR" ? "border-violet-500 ring-2 ring-violet-500/10" : "border-gray-100 hover:border-gray-200"}`}
                      >
                        <div>
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-500 mb-3">
                            <Truck size={18} />
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm">Envío estándar</h4>
                          <p className="text-xs text-gray-400 mt-0.5">3-5 días hábiles</p>
                          <p className="text-sm font-extrabold text-green-600 mt-2">Gratis</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${tipoEnvio === "ESTANDAR" ? "border-violet-600 bg-violet-600 text-white" : "border-gray-300"}`}>
                          {tipoEnvio === "ESTANDAR" && <div className="h-2 w-2 rounded-full bg-white"></div>}
                        </div>
                      </div>

                      {/* Express */}
                      <div
                        onClick={() => setTipoEnvio("EXPRESS")}
                        className={`flex cursor-pointer items-start justify-between rounded-3xl bg-white p-5 shadow-sm border ${tipoEnvio === "EXPRESS" ? "border-violet-500 ring-2 ring-violet-500/10" : "border-gray-100 hover:border-gray-200"}`}
                      >
                        <div>
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-500 mb-3">
                            <Tag size={18} />
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm">Envío express</h4>
                          <p className="text-xs text-gray-400 mt-0.5">1-2 días hábiles</p>
                          <p className="text-sm font-extrabold text-violet-700 mt-2">+S/ 15</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${tipoEnvio === "EXPRESS" ? "border-violet-600 bg-violet-600 text-white" : "border-gray-300"}`}>
                          {tipoEnvio === "EXPRESS" && <div className="h-2 w-2 rounded-full bg-white"></div>}
                        </div>
                      </div>

                      {/* Recojo en Tienda */}
                      <div
                        onClick={() => setTipoEnvio("RECOJO")}
                        className={`flex cursor-pointer items-start justify-between rounded-3xl bg-white p-5 shadow-sm border ${tipoEnvio === "RECOJO" ? "border-violet-500 ring-2 ring-violet-500/10" : "border-gray-100 hover:border-gray-200"}`}
                      >
                        <div>
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-500 mb-3">
                            <Building size={18} />
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm">Recojo en tienda</h4>
                          <p className="text-xs text-gray-400 mt-0.5">Disponible hoy</p>
                          <p className="text-sm font-extrabold text-green-600 mt-2">Gratis</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${tipoEnvio === "RECOJO" ? "border-violet-600 bg-violet-600 text-white" : "border-gray-300"}`}>
                          {tipoEnvio === "RECOJO" && <div className="h-2 w-2 rounded-full bg-white"></div>}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Acciones principales */}
                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={() => navigate("/carrito")}
                      className="rounded-xl border px-8 py-3.5 font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      Volver
                    </button>
                    <Boton
                      disabled={!direccionSeleccionada}
                      onClick={() => setFase(3)}
                      className="flex-1 rounded-xl py-3.5 font-bold flex justify-center items-center gap-2"
                    >
                      Continuar al pago <ChevronLeft size={18} className="rotate-180" />
                    </Boton>
                  </div>
                </div>
              )}

              {fase === 3 && (
                // ================= FASE 3: MÉTODO DE PAGO =================
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-[#1A1F36] tracking-tight mb-2">Método de pago</h1>
                    <p className="text-sm text-gray-400">Selecciona cómo deseas abonar el total de tu orden.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { value: "TARJETA", label: "Tarjeta", icon: <CreditCard size={18} /> },
                      { value: "YAPE", label: "Yape", icon: <span className="font-black text-xs">YP</span> },
                      { value: "PLIN", label: "Plin", icon: <span className="font-black text-xs">PL</span> },
                      { value: "TRANSFERENCIA", label: "Banco", icon: <Building size={18} /> },
                    ].map((mp) => (
                      <div
                        key={mp.value}
                        onClick={() => setMetodoPago(mp.value)}
                        className={`flex flex-col items-center justify-center cursor-pointer rounded-2xl bg-white p-4 shadow-sm border transition-all ${metodoPago === mp.value ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-100 hover:border-gray-200 text-gray-600"}`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full mb-2 ${metodoPago === mp.value ? "bg-violet-100" : "bg-gray-50"}`}>
                          {mp.icon}
                        </div>
                        <span className="text-xs font-bold">{mp.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Formulario o detalles según método de pago */}
                  <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">

                    {metodoPago === "TARJETA" && (
                      <div className="space-y-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          <CreditCard className="text-violet-600" size={20} /> Datos de tu tarjeta
                        </h3>

                        {/* Tarjeta Visual */}
                        <div className="relative w-full max-w-sm mx-auto h-48 md:h-56 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-800 p-6 text-white shadow-xl overflow-hidden">
                          <div className="absolute top-0 right-0 p-6 opacity-20">
                            <CreditCard size={120} className="-rotate-12" />
                          </div>
                          <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                              <div className="w-12 h-8 bg-yellow-400 rounded-md opacity-90"></div>
                              <span className="font-bold text-xl italic tracking-wider">VISA</span>
                            </div>
                            <div className="text-2xl md:text-3xl font-mono tracking-widest shadow-sm">
                              {datosTarjeta.numero || "•••• •••• •••• ••••"}
                            </div>
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-xs opacity-70 uppercase tracking-widest mb-1">Titular</p>
                                <p className="font-bold uppercase tracking-wide truncate max-w-[180px]">
                                  {datosTarjeta.nombre || "NOMBRE APELLIDO"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs opacity-70 uppercase tracking-widest mb-1">Vence</p>
                                <p className="font-bold tracking-wider">{datosTarjeta.expiracion || "MM/AA"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-4 pt-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número de Tarjeta</label>
                            <Input
                              placeholder="0000 0000 0000 0000"
                              value={datosTarjeta.numero}
                              onChange={(e) => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del titular</label>
                            <Input
                              placeholder="CARLOS MENDOZA"
                              value={datosTarjeta.nombre}
                              onChange={(e) => setDatosTarjeta({ ...datosTarjeta, nombre: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha de vencimiento</label>
                              <Input
                                placeholder="MM/AA"
                                value={datosTarjeta.expiracion}
                                onChange={(e) => setDatosTarjeta({ ...datosTarjeta, expiracion: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                              <Input
                                placeholder="•••"
                                type="password"
                                value={datosTarjeta.cvv}
                                onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="guardar_tarjeta" className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4" />
                            <label htmlFor="guardar_tarjeta" className="text-sm text-gray-600">Guardar tarjeta para próximas compras</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {(metodoPago === "YAPE" || metodoPago === "PLIN") && (
                      <div className="space-y-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          <span className="font-black text-violet-600">{metodoPago === "YAPE" ? "YP" : "PL"}</span> Paga con {metodoPago === "YAPE" ? "Yape" : "Plin"}
                        </h3>

                        <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                          {/* QR Izquierda */}
                          <div className="shrink-0">
                            <div className="h-48 w-48 rounded-3xl bg-white border-2 border-dashed border-violet-200 flex flex-col items-center justify-center p-4">
                              <div className="w-24 h-24 bg-violet-100 rounded-xl mb-3 flex items-center justify-center">
                                <span className="font-bold text-violet-500 text-xl">QR</span>
                              </div>
                              <p className="font-bold text-gray-700 text-sm">QR de pago</p>
                            </div>
                          </div>

                          {/* Instrucciones Derecha */}
                          <div className="flex-1 space-y-4 w-full">
                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white font-bold text-sm shrink-0">1</div>
                              <p className="text-sm text-gray-700">Abre tu app de <strong>{metodoPago === "YAPE" ? "Yape" : "Plin"}</strong> en tu celular</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white font-bold text-sm shrink-0">2</div>
                              <p className="text-sm text-gray-700">Escanea el código QR con la cámara de la app</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white font-bold text-sm shrink-0">3</div>
                              <p className="text-sm text-gray-700">Confirma el pago y listo ✓</p>
                            </div>

                            <div className="mt-4 flex items-start gap-2 bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-700 text-xs">
                              <AlertCircle size={16} className="shrink-0 mt-0.5" />
                              <p>El QR expira en <strong>10 minutos</strong>. No cierres esta página.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {metodoPago === "TRANSFERENCIA" && (
                      <div className="space-y-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          <Building className="text-violet-600" size={20} /> Datos de transferencia
                        </h3>

                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">BCP</h4>
                            <p className="text-sm text-gray-600 mb-1">Cuenta: <span className="font-mono font-bold text-gray-900">191-12345678-0-90</span></p>
                            <p className="text-sm text-gray-600">CCI: <span className="font-mono font-bold text-gray-900">002 191 00 12345678 90</span></p>
                          </div>

                          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">Interbank</h4>
                            <p className="text-sm text-gray-600 mb-1">Cuenta: <span className="font-mono font-bold text-gray-900">200-3098765432</span></p>
                            <p className="text-sm text-gray-600">CCI: <span className="font-mono font-bold text-gray-900">003 200 00 3098765432 10</span></p>
                          </div>

                          <div className="mt-4 flex items-center gap-2 bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-700 text-xs">
                            <AlertCircle size={16} className="shrink-0" />
                            <p>Envía tu comprobante a <strong>pagos@pochitastore.pe</strong> para confirmar tu pedido.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Barra de Seguridad y Acciones */}
                  <div className="space-y-6 pt-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 text-xs text-green-600 font-semibold">
                      <div className="flex items-center gap-1.5"><ShieldCheck size={16} /> Conexión SSL segura</div>
                      <div className="flex items-center gap-1.5"><ShieldCheck size={16} /> Datos protegidos</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 size={16} /> Pago verificado</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setFase(2)}
                        className="rounded-xl border border-gray-200 bg-white px-8 py-3.5 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Volver
                      </button>
                      <Boton
                        onClick={abrirModalValidacion}
                        className="flex-1 rounded-xl py-3.5 font-bold flex justify-center items-center gap-2"
                      >
                        <ShieldCheck size={18} /> Pagar ahora — {formatearPrecio(total)}
                      </Boton>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* PANEL DERECHO: RESUMEN DE COMPRA */}
            <div className="lg:col-span-1 space-y-6">

              {/* Resumen */}
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <CreditCard className="text-violet-600" size={20} />
                  Resumen de compra
                </div>

                <div className="space-y-4 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Subtotal ({items.length} prod.)</span>
                    <span className="font-semibold text-gray-900">{formatearPrecio(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-gray-500"><Truck size={14} /> Envío</span>
                    <span className={`font-bold ${costoEnvio === 0 ? "text-green-500" : "text-gray-900"}`}>
                      {costoEnvio === 0 ? "Gratis" : formatearPrecio(costoEnvio)}
                    </span>
                  </div>
                  {cuponAplicado && (
                    <div className="flex items-center justify-between text-red-500 font-semibold">
                      <span>Descuento ({cuponAplicado.descuentoPorcentaje}%)</span>
                      <span>-{formatearPrecio(descuentoCupon)}</span>
                    </div>
                  )}
                </div>

                <div className="mb-6 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 text-sm">
                  <span className="font-bold text-green-700">Total ahorrado</span>
                  <span className="font-bold text-green-700">{formatearPrecio(totalAhorrado)}</span>
                </div>

                <div className="mb-6 flex items-end justify-between border-t border-gray-100 pt-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="block text-2xl font-extrabold text-violet-700">{formatearPrecio(total)}</span>
                    <span className="text-xs text-gray-400">Impuestos incluidos</span>
                  </div>
                </div>

                {/* Beneficios */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <ShieldCheck size={16} className="text-violet-300" /> Compra 100% protegida
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <RefreshCw size={16} className="text-violet-300" /> Devolución gratis 30 días
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Tag size={16} className="text-violet-300" /> Datos encriptados SSL
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* MODAL DE VALIDACIÓN SIMULADA */}
      {mostrarModalPago && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setMostrarModalPago(false)}
              disabled={procesandoPago}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600 mb-2">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Validación de seguridad</h3>
              <p className="text-sm text-gray-500">
                {metodoPago === "TARJETA"
                  ? "Ingresa el código SMS de 4 dígitos que enviamos a tu celular para aprobar la compra."
                  : `Ingresa el N° de Operación del voucher de ${metodoPago} para verificar la transacción.`}
              </p>

              <div className="pt-2">
                <Input
                  placeholder={metodoPago === "TARJETA" ? "Ej: 4812" : "Ej: 03948120"}
                  value={codigoValidacion}
                  onChange={(e) => setCodigoValidacion(e.target.value)}
                  disabled={procesandoPago}
                  className="text-center font-mono text-lg tracking-widest"
                />
              </div>

              {errorValidacion && <p className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded-lg">{errorValidacion}</p>}

              <div className="pt-4">
                <Boton
                  onClick={handleConfirmarPagoReal}
                  disabled={procesandoPago || !codigoValidacion.trim()}
                  className="w-full rounded-xl py-3.5 font-bold flex justify-center items-center gap-2"
                >
                  {procesandoPago ? <Spinner size="h-5 w-5" /> : "Verificar y Pagar"}
                </Boton>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-semibold mt-2 uppercase tracking-wider">
                <ShieldCheck size={12} /> Entorno seguro simulado
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

export default Checkout;
