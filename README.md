# ServiGo: Aplicación de Gestión Financiera

Bienvenidos al proyecto ServiGo, una aplicación web diseñada para simplificar la gestión de usuarios, cuentas bancarias, servicios y pagos. Este proyecto académico está pensado para estudiantes y principiantes en programación web, ofreciendo una visión práctica del desarrollo full-stack con tecnologías modernas.

Nuestro objetivo principal es crear una herramienta intuitiva que permita a los usuarios organizar sus finanzas personales y el pago de servicios de manera eficiente. ServiGo busca ser un pilar fundamental en la educación de futuros desarrolladores web.

## Tecnologías Utilizadas

El proyecto está construido sobre un stack de JavaScript moderno, utilizando:

-   **Node.js:** Entorno de ejecución para el servidor.
-   **Next.js:** Framework de React para desarrollo full-stack, gestionando tanto el frontend como el backend (API Routes).
-   **React:** Biblioteca para construir la interfaz de usuario.
-   **SQL Server (mssql):** Sistema de gestión de bases de datos para almacenar toda la información de la aplicación.
-   **Tailwind CSS:** Framework de CSS para un diseño rápido y personalizable.

## Librerías Principales

-   `next`: El corazón del framework de la aplicación.
-   `react` y `react-dom`: Para la creación de componentes de interfaz de usuario.
-   `mssql`: Driver de Node.js para conectar y realizar consultas a la base de datos SQL Server.
-   `bcryptjs`: Para el hasheo y la verificación segura de contraseñas.
-   `react-hook-form`: Para la gestión de formularios de manera eficiente y con validaciones.
-   `cookie`: Para la gestión de cookies, fundamental en la autenticación.
-   `eslint`: Para el análisis estático del código y mantenimiento de la calidad.

## Arquitectura y Estructura del Proyecto

ServiGo utiliza una arquitectura monolítica de aplicación web con un enfoque de "backend-for-frontend" gracias a Next.js.

-   **Frontend:** Construido con componentes de React (`.jsx`), se encarga de toda la lógica de la interfaz de usuario. El diseño se gestiona con Tailwind CSS.
-   **Backend:** Implementado a través de las **API Routes** de Next.js. Estas rutas manejan la lógica de negocio, la autenticación y la comunicación con la base de datos.
-   **Base de Datos:** Un script `bd_base.sql` define la estructura inicial de la base de datos en SQL Server. La conexión se gestiona a través del driver `mssql` en el backend.

La estructura de carpetas principal es la siguiente:

```
servigo-app/
├── public/              # Archivos estáticos (imágenes, logos)
├── src/
│   ├── app/             # Núcleo de la aplicación Next.js 13+ (App Router)
│   │   ├── login/       # Página y formulario de inicio de sesión
│   │   ├── register/    # Página y formulario de registro
│   │   ├── profile/     # Página y formulario de perfil de usuario
│   │   ├── cuentas/     # Gestión de cuentas y transferencias
│   │   └── servicios/   # Gestión de servicios y pagos
│   └── lib/             # Lógica reutilizable y de bajo nivel
│       ├── auth.js      # Funciones de autenticación (manejo de sesión, cookies)
│       └── db.js        # Configuración y conexión a la base de datos
├── .gitignore
├── next.config.mjs      # Configuración de Next.js
└── package.json         # Dependencias y scripts del proyecto
```

## Funcionalidades y Procesos

La aplicación permite a los usuarios realizar las siguientes acciones:

1.  **Autenticación de Usuarios:**
    *   **Registro:** Los nuevos usuarios pueden crear una cuenta. La contraseña se almacena de forma segura usando `bcryptjs`.
    *   **Inicio de Sesión:** Los usuarios registrados pueden acceder a la aplicación. El sistema crea una sesión segura utilizando cookies.

2.  **Gestión de Perfil:**
    *   Los usuarios pueden ver y actualizar la información de su perfil.

3.  **Gestión de Cuentas Bancarias:**
    *   Crear nuevas cuentas bancarias asociadas a su perfil.
    *   Editar la información de las cuentas existentes.
    *   Realizar transferencias de saldo entre sus propias cuentas.

4.  **Gestión de Servicios y Pagos:**
    *   Registrar nuevos servicios (ej. luz, agua, internet).
    *   Editar los servicios guardados.
    *   Realizar el pago de los servicios utilizando el saldo de sus cuentas bancarias.