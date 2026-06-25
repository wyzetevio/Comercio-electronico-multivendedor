# Comercio-electronico-multivendedor

🌿 1. ASIGNACIÓN DE RAMAS EN GIT
Para trabajar en paralelo sin generar conflictos en el código, cada integrante trabajará en su propia rama de características (feature), naciendo siempre desde la rama común develop:

🔑 JUAN: feature/front-security-auth (Encargado de la seguridad, interceptor de tokens, contexto global y rutas protegidas).

🗂️ JESÚS: feature/front-marketplace-models (Encargado de los componentes globales del layout, Navbar, Footer y tarjetas de productos).

⚙️ PIERO: feature/front-controllers-integration (Encargado de la lógica de servicios de consumo de API y conectar los formularios con el Backend).

🧪 CÉSAR: feature/front-forms-views (Encargado de la maquetación visual limpia de todas las pantallas y formularios usando Tailwind).

📁 2. ESTRUCTURA COMPLETA DEL PROYECTO (React + Vite + Tailwind)
Esta estructura incluye la separación total del acceso administrativo (Opción B), permitiendo que el Administrador cuente con su propia pantalla de login oculta del público general.


marketplace-frontend/
├── src/
│   ├── assets/             # Logos corporativos y recursos visuales del Marketplace
│   │
│   ├── components/         # COMPONENTES GLOBALES REUTILIZABLES [JESÚS]
│   │   ├── Navbar.jsx      # Menú inteligente (Muestra botones dinámicos solo para CLIENTE y VENDEDOR)
│   │   ├── Footer.jsx      # Pie de página (Contiene el enlace oculto para registro de socios/vendedores)
│   │   ├── ProductoCard.jsx# Tarjetas visuales de catálogo diseñadas con Tailwind
│   │   └── Boton.jsx       # Componente de botón estandarizado para la aplicación
│   │
│   ├── context/            # CAPA DE SEGURIDAD GLOBAL [JUAN]
│   │   └── AuthContext.jsx # Estado global del usuario: guarda el JWT en localStorage y expone el Rol activo
│   │
│   ├── routes/             # ENRUTAMIENTO Y ACCESOS [JUAN]
│   │   ├── AppRoutes.jsx   # Mapeo general de rutas (Incluye la URL secreta del Admin)
│   │   └── ProtectedRoute.jsx # Filtro/Candado de rutas que rebota usuarios no autorizados de los Dashboards
│   │
│   ├── services/           # CONEXIÓN CON LAS APIS DEL BACKEND [PIERO]
│   │   ├── api.js          # Configuración de Axios con Interceptor para adjuntar el Header Authorization Bearer
│   │   ├── authService.js  # Servicios de autenticación general (Login público, Login Admin y Registros)
│   │   ├── tiendaService.js# Consumo de endpoints para el registro y datos de tiendas
│   │   └── productoService.js# Operaciones CRUD para el inventario de productos
│   │
│   ├── pages/              # VISTAS COMPLETAS (CÉSAR maqueta con Tailwind / PIERO conecta estados)
│   │   ├── Home.jsx              # Catálogo principal público de productos [JESÚS / PIERO]
│   │   ├── Carrito.jsx           # Bolsa de compras interactiva para clientes [JESÚS / PIERO]
│   │   ├── Login.jsx             # 🛒 LOGIN PÚBLICO: Exclusivo para Clientes y Vendedores [CÉSAR / PIERO]
│   │   ├── Registro.jsx          # Formulario público de registro para el CLIENTE comprador [CÉSAR / PIERO]
│   │   ├── RegistroVendedor.jsx  # 🏪 REGISTRO SOCIOS: Formulario exclusivo para el Vendedor [CÉSAR / PIERO]
│   │   ├── CrearTienda.jsx       # Formulario obligatorio de configuración inicial de tienda [CÉSAR / PIERO]
│   │   ├── DashboardVendedor.jsx # Panel privado de gestión comercial del VENDEDOR [CÉSAR / PIERO]
│   │   ├── AdminLogin.jsx        # 👑 LOGIN SECRETO: Acceso exclusivo para el ADMINISTRADOR [CÉSAR / PIERO]
│   │   └── DashboardAdmin.jsx    # Panel privado de supervisión global del ADMINISTRADOR [CÉSAR / PIERO]
│   │
│   ├── App.jsx             # Componente raíz encapsulado en el AuthContext
│   ├── index.css           # Inyección de las directivas base de Tailwind CSS
│   └── main.jsx            # Punto de entrada de React
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