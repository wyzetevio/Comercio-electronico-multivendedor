function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Marca */}
        <div>
          <h2 className="text-xl font-bold text-violet-400">
            Pochita Store
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            Tu marketplace de confianza para productos originales.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-2">Enlaces</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>Inicio</li>
            <li>Productos</li>
            <li>Carrito</li>
            <li>Mi cuenta</li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-semibold mb-2">Contacto</h3>
          <p className="text-sm text-gray-300">
            soporte@pochitastore.com
          </p>
          <p className="text-sm text-gray-300">
            Lima, Perú
          </p>
        </div>

      </div>

      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-700">
        © {new Date().getFullYear()} Pochita Store. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;