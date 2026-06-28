# Comercio-electronico-multivendedor

🌿 1. ASIGNACIÓN DE RAMAS EN GIT
Para trabajar en paralelo sin generar conflictos en el código, cada integrante trabajará en su propia rama de características (feature), naciendo siempre desde la rama común develop:

🔑 JUAN: feature/front-security-auth (Encargado del desarrollo del Enrutamiento, Seguridad, Rutas Protegidas y los Contextos globales).

🗂️ JESÚS: feature/front-marketplace-components (Encargado del desarrollo de todos los componentes globales, contenedores y elementos UI reutilizables).

⚙️ PIERO: feature/front-services-integration (Encargado del desarrollo de toda la lógica de servicios de consumo de APIs y utilidades/configuraciones generales).

🧪 CÉSAR: feature/front-pages-views (Encargado del desarrollo de todas las vistas/páginas completas y su respectiva maquetación con Tailwind CSS).

📁 2. ESTRUCTURA COMPLETA DEL PROYECTO (React + Vite + Tailwind)
Esta estructura divide las responsabilidades del equipo de forma limpia. Se incluye la persistencia híbrida del carrito (localStorage/BD) y el soporte para todos los módulos del backend (productos, categorías, tiendas, envíos y liquidaciones).

```text
marketplace-frontend/
├── src/
│   ├── assets/             # Recursos visuales estáticos (logos, banners, iconos)
│   │
│   ├── components/         # COMPONENTES GLOBALES REUTILIZABLES [DESARROLLA: JESÚS]
│   │   ├── ui/             # Elementos atómicos de interfaz
│   │   │   ├── Boton.jsx   # Botón estandarizado con variantes de color
│   │   │   ├── Input.jsx   # Input de formularios con soporte para errores
│   │   │   ├── Modal.jsx   # Ventana emergente flotante reutilizable
│   │   │   ├── Spinner.jsx # Rueda de carga para estados de espera (loading)
│   │   │   ├── Badge.jsx   # Etiquetas de estado de colores (PAGADO, ENTREGADO, etc.)
│   │   │   └── Alerta.jsx  # Toast de alertas y mensajes instantáneos
│   │   │
│   │   ├── layout/         # Contenedores estructurales
│   │   │   ├── Navbar.jsx  # Cabecera dinámica según Rol + contador de carrito
│   │   │   ├── Footer.jsx  # Pie de página con el link oculto para vendedores
│   │   │   ├── SidebarVendedor.jsx # Barra lateral del panel de vendedor
│   │   │   └── SidebarAdmin.jsx    # Barra lateral del panel de administrador
│   │   │
│   │   ├── product/        # Componentes de listado de catálogo
│   │   │   ├── ProductoCard.jsx # Tarjeta de producto para el catálogo
│   │   │   ├── ProductoGrid.jsx # Rejilla auto-ajustable para productos
│   │   │   └── FiltrosCatalogo.jsx # Sidebar con filtros de precio y categorías
│   │   │
│   │   └── cart/           # Componentes internos del carrito
│   │       ├── CartItem.jsx # Tarjeta de producto dentro de la bolsa
│   │       └── CartSummary.jsx # Desglose de precios y totales
│   │
│   ├── context/            # CAPAS DE ESTADO GLOBAL [DESARROLLA: JUAN]
│   │   ├── AuthContext.jsx # Seguridad del usuario (JWT + rol + idUsuario en localStorage)
│   │   ├── CartContext.jsx # Estado global del carrito de compras (sincronizado con BD/local)
│   │   └── StoreContext.jsx # Estado global de la tienda activa del Vendedor
│   │
│   ├── hooks/              # HOOKS DE ACCESO RÁPIDO [DESARROLLA: JUAN]
│   │   ├── useAuth.js      # Hook para consumir el estado del usuario
│   │   ├── useCart.js      # Hook para consumir el estado del carrito
│   │   └── useStore.js     # Hook para consumir el estado de la tienda activa
│   │
│   ├── routes/             # CONFIGURACIÓN DE ENRUTAMIENTO [DESARROLLA: JUAN]
│   │   ├── AppRoutes.jsx   # Switch de URLs públicas y privadas (incluye Easter Egg de admin)
│   │   └── ProtectedRoute.jsx # Filtros y candados de acceso basados en roles
│   │
│   ├── services/           # CONEXIÓN CON APIS DEL BACKEND [DESARROLLA: PIERO]
│   │   ├── authService.js  # Endpoints de Login y Registro de usuarios
│   │   ├── carritoService.js # Sincronización del carrito en base de datos
│   │   ├── categoriaService.js # Carga y gestión de categorías de productos
│   │   ├── productoService.js # Filtros, búsquedas y CRUD del catálogo de productos
│   │   ├── tiendaService.js # Gestión y alta de tiendas de vendedores
│   │   ├── ordenService.js # Creación de pedidos y pasarela de checkout
│   │   ├── pagoService.js  # Registro, aprobación y reembolso de transacciones
│   │   ├── envioService.js # Actualizaciones de tracking y estados de entrega
│   │   ├── liquidacionService.js # Gestión de pagos acumulados y comisiones
│   │   ├── usuarioService.js # Perfiles, direcciones y desactivación de cuentas
│   │   └── vendedorService.js # Moderación y estados de vendedores por el Admin
│   │
│   ├── pages/              # VISTAS/PANTALLAS COMPLETAS [DESARROLLA: CÉSAR]
│   │   ├── public/         # Vistas públicas para cualquier visitante
│   │   │   ├── Home.jsx             # Catálogo general de productos
│   │   │   ├── DetalleProducto.jsx  # Ficha del producto y agregar al carro
│   │   │   ├── Login.jsx            # Pantalla de Login unificada (con soporte Easter Egg)
│   │   │   ├── Registro.jsx         # Registro de clientes compradores
│   │   │   ├── RegistroVendedor.jsx # Landing informativa de socios + formulario
│   │   │   └── AdminLogin.jsx       # Login oculto exclusivo de administración
│   │   │
│   │   ├── customer/       # Vistas exclusivas de Clientes
│   │   │   ├── Carrito.jsx # Bolsa de compras detallada
│   │   │   ├── Checkout.jsx # Formulario de envío y selección de pago
│   │   │   ├── MisPedidos.jsx # Historial de compras individuales
│   │   │   └── Perfil.jsx   # Actualización de datos de perfil
│   │   │
│   │   ├── seller/         # Vistas del Dashboard del Vendedor
│   │   │   ├── DashboardVendedor.jsx # Ventas, comisiones y saldos
│   │   │   ├── CrearTienda.jsx       # Formulario obligatorio inicial de tienda
│   │   │   ├── GestionProductos.jsx  # CRUD de inventario del comercio
│   │   │   ├── GestionPedidos.jsx    # Control de pedidos y despacho de envíos
│   │   │   └── LiquidacionesVendedor.jsx # Depósitos de saldo solicitados a administración
│   │   │
│   │   └── admin/          # Vistas del Dashboard del Administrador
│   │       ├── DashboardAdmin.jsx    # Monitoreo global de ingresos y comisiones
│   │       ├── ModeracionTiendas.jsx # Panel para habilitar/suspender comercios
│   │       ├── GestionCategorias.jsx # CRUD de categorías en el sistema
│   │       └── LiquidacionesAdmin.jsx# Procesamiento de pagos a vendedores
│   │
│   ├── utils/              # UTILERÍAS GLOBALES [DESARROLLA: PIERO]
│   │   ├── api.js          # Configuración base de Axios con interceptor de JWT
│   │   ├── formatters.js   # Formato estandarizado de monedas y fechas
│   │   └── validators.js   # Validaciones de contraseñas, correos y teléfonos
│   │
│   ├── App.css             # Estilos globales y reset
│   ├── App.jsx             # Componente raíz con el árbol de proveedores
│   ├── index.css           # Inyección de las directivas base de Tailwind
│   └── main.jsx            # Punto de entrada de React + Vite
```
│
├── vite.config.js          # Configuración del servidor de desarrollo con Proxy hacia el puerto 8080 (Spring Boot)
├── tailwind.config.js      # Declaración de temas, fuentes y extensiones de diseño de Tailwind
└── package.json            # Registro de dependencias y scripts del proyecto

⚙️ 3. REGLAS DE AUTENTICACIÓN Y REGISTRO (Por Rol)
Para emular el comportamiento de grandes plataformas de comercio electrónico como Ripley o Saga Falabella, la gestión de accesos opera de manera asimétrica para proteger las credenciales administrativas.

🛒 El Cliente Comprador
Registro: Entra libremente a la pantalla pública Registro.jsx desde el botón superior de la web.

Login: Se autentica en la pantalla común Login.jsx.

Comportamiento: Si sus credenciales corresponden a un usuario común, el sistema levanta su sesión en el contexto global con el rol correspondiente y le permite continuar su navegación comercial.

🏪 El Vendedor (Socio de Negocio)
El Enlace de Entrada: No se mezcla con el cliente. En el componente Footer.jsx se ubica un enlace discreto en la parte inferior que dice "Vende con Nosotros".

Registro: Al presionar el enlace, el sistema lo redirecciona a la ruta pública pero especializada /vendedor/registro (RegistroVendedor.jsx). Al enviar los datos, el frontend fuerza el rol correspondiente hacia la API.

Flujo Automatizado: Al culminar el registro con éxito, el sistema lo loguea inmediatamente en segundo plano y, en lugar de mandarlo al catálogo general, lo redirige de forma forzada a CrearTienda.jsx. Una vez que guarda el nombre y rubro de su comercio, se le habilita la entrada a su panel de control.

Login: Una vez registrado, puede iniciar sesión de forma unificada desde la pantalla pública Login.jsx.

👑 El Administrador (Sistema Cerrado - Opción B)
Registro: El rol de administrador no posee un formulario de registro abierto al público en internet bajo ningún concepto. El administrador inicial se inicializa directamente por base de datos o herramientas técnicas de pruebas (Postman). Los administradores subsiguientes se registran únicamente de manera interna: el administrador principal inicia sesión, accede a una pestaña segura de personal dentro de su dashboard, y registra las credenciales de un nuevo colega.

Login Oculto (AdminLogin.jsx): No existe ningún botón visible en la interfaz pública que guíe hacia esta pantalla. El personal accede digitando manualmente una ruta técnica secreta configurada en el enrutador de React (por ejemplo: http://localhost:5173/admin-secure/login).

Seguridad Cruzada: Si un administrador intenta colocar sus credenciales en el login público (Login.jsx), el frontend interceptará la respuesta exitosa del backend y lo bloqueará mostrando un mensaje de advertencia: "Portal no autorizado para administradores. Use el acceso privado". Esto evita que se utilicen cuentas de alta jerarquía en accesos convencionales.

🛡️ 4. CONTROL DE ACCESOS Y NIVELES DE DASHBOARD
La seguridad del enrutamiento frontend dependerá del componente de control de accesos que analizará el token JWT guardado:

El Cliente: No dispone de ningún panel de administración. Su interfaz es puramente de interacción como consumidor. Navega por el catálogo, gestiona el carrito de compras y ejecuta la pasarela de pagos.

El Vendedor (DashboardVendedor.jsx): Es un entorno completamente aislado y protegido. El vendedor tiene acceso exclusivo a las métricas de su propio comercio. Su funcionalidad se limita a realizar operaciones CRUD sobre su propio catálogo de productos, modificar su stock disponible y revisar su historial individual de ingresos. Tiene prohibido por código visualizar datos de otras tiendas competidoras.

El Administrador (DashboardAdmin.jsx): Representa la oficina central de la plataforma. Este panel no duplica visualmente la vista del vendedor, sino que se enfoca en la supervisión macro del negocio: visualización de volumen de transacciones de todo el sitio, control de comisiones generadas, listado de usuarios activos y la capacidad de moderar, suspender o aprobar tiendas y productos que infrinjan los términos del marketplace.

🔄 5. FLUJO DE INTERACCIÓN GENERAL DEL SISTEMA (Caso de Uso Real)
Para visualizar cómo interactúan las tres capas de usuarios de forma simultánea en la plataforma una vez que esté todo construido, el flujo cíclico del negocio opera de la siguiente manera:

La Preparación del Negocio (Capa Vendedor): Un emprendedor accede mediante el enlace del pie de página, se registra como socio y da de alta su espacio comercial. Desde su DashboardVendedor.jsx, añade un producto (por ejemplo, una polera, ingresando precio, descripción y un stock inicial de 20 unidades). El producto queda guardado en la base de datos vinculado a su tienda.

La Supervisión (Capa Administrador): El administrador del marketplace ingresa por su ruta privada en /admin-secure/login a su panel de control. En su lista de novedades, visualiza que se ha creado una nueva tienda y un nuevo producto. El sistema le permite verificar que todo esté en orden con las políticas de la empresa.

El Flujo Comercial (Capa Cliente): Un usuario anónimo ingresa a la página web (Home.jsx). Como el catálogo es totalmente público, el cliente puede ver la polera que el vendedor acaba de subir, con su respectivo stock disponible. El cliente decide agregar la polera a su carrito de compras.

El Quiebre de Seguridad: Al revisar la bolsa en Carrito.jsx y pulsar el botón "Proceder al Pago", el enrutador frontend evalúa el estado de autenticación. Al notar que es un visitante anónimo, detiene el proceso y lo envía a la pantalla de inicio de sesión pública. El cliente se registra rápidamente como comprador y completa la transacción.

El Cierre del Ciclo: Al procesarse el pago con éxito, el backend altera los registros y el sistema reacciona en cadena:

El stock de la polera en el catálogo baja automáticamente de 20 a 19 unidades (visible para cualquier cliente en el Home.jsx).

Al vendedor se le actualiza en tiempo real su panel de control (DashboardVendedor.jsx) mostrando una nueva venta completada y sumando el saldo a sus ganancias del mes.

Al administrador se le añade en su panel global (DashboardAdmin.jsx) la notificación de la transacción y se calcula automáticamente la comisión respectiva que le corresponde a la plataforma por haber conectado a ambos usuarios.


ASI FUNCIONARA MI SISTEMA POR AHORA.