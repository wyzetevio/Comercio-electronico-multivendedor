import { Link } from "react-router-dom";
import { Store, Shield, Phone, Mail, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-10 print:hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Marca y Acerca de */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition">
            <Store size={28} />
            <h2 className="text-2xl font-bold tracking-tight">Pochita Store</h2>
          </Link>
          <p className="text-sm leading-relaxed text-gray-400">
            Tu marketplace de confianza. Encuentra los mejores productos originales de múltiples vendedores verificados en un solo lugar seguro.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
            <Shield size={16} className="text-violet-500" />
            <span>Compras 100% protegidas</span>
          </div>
        </div>

        {/* Enlaces de Cliente */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Para Clientes</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-violet-400 transition-colors duration-200">Inicio</Link>
            </li>
            <li>
              <Link to="/?categoria=Tecnología" className="hover:text-violet-400 transition-colors duration-200">Explorar Tecnología</Link>
            </li>
            <li>
              <Link to="/carrito" className="hover:text-violet-400 transition-colors duration-200">Mi Carrito de Compras</Link>
            </li>
            <li>
              <Link to="/perfil" className="hover:text-violet-400 transition-colors duration-200">Mi Cuenta</Link>
            </li>
          </ul>
        </div>

        {/* Únete a nosotros */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Empresa</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <span className="hover:text-violet-400 cursor-pointer transition-colors duration-200">Sobre nosotros</span>
            </li>
            <li>
              <span className="hover:text-violet-400 cursor-pointer transition-colors duration-200">Políticas de privacidad</span>
            </li>
            <li>
              <span className="hover:text-violet-400 cursor-pointer transition-colors duration-200">Términos y condiciones</span>
            </li>
            <li className="pt-2 border-t border-gray-800">
              <Link to="/register/vendedor" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors duration-200 font-medium mb-2">
                Vende con nosotros <span className="text-xs px-2 py-0.5 bg-violet-900/50 rounded-full text-violet-200 border border-violet-800">¡Nuevo!</span>
              </Link>
            </li>
            <li>
              {/* Enlace sigiloso al portal de vendedores */}
              <Link to="/vendedor/login" className="text-gray-500 hover:text-gray-400 transition-colors duration-200 text-xs">
                Para vendedores
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contacto</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Mail size={18} className="text-gray-500 mt-0.5" />
              <span>soporte@pochitastore.com</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={18} className="text-gray-500 mt-0.5" />
              <span>+51 987 654 321</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-500 mt-0.5" />
              <span>Av. Empresarial 123, <br />Lima, Perú</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright inferior */}
      <div className="border-t border-gray-800 bg-[#0b1121]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Pochita Store. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-gray-300">Facebook</span>
            <span className="cursor-pointer hover:text-gray-300">Instagram</span>
            <span className="cursor-pointer hover:text-gray-300">Twitter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;