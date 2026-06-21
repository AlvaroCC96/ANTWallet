# 🐜 ANTWallet

Una app financiera gamificada: registra tus cuentas, deudas y gastos hormiga.
Las hormigas atacan tu billetera cada vez que registras un gasto, y las deudas
son jefes con barra de vida que pierden HP cada vez que pagas.

Cada usuario inicia sesión (email/contraseña o Google) y tiene su propio
dashboard, guardado en su cuenta — no en el navegador.

## Stack

- React + TypeScript + Vite
- TailwindCSS (dark mode fijo)
- Framer Motion (animaciones)
- Firebase Authentication (email/contraseña + Google)
- Firebase Firestore (un documento por usuario, sincronizado en tiempo real)

## Requisitos

- Node.js 18+
- Un proyecto de Firebase (gratis, plan Spark es suficiente)

## Configurar Firebase (una sola vez)

### 1. Crear el proyecto

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y
   haz clic en **Agregar proyecto**.
2. Ponle un nombre (ej. `antwallet`) y completa el asistente (puedes
   desactivar Google Analytics, no es necesario).

### 2. Habilitar Authentication

1. En el menú lateral, ve a **Build → Authentication → Get started**.
2. En la pestaña **Sign-in method**, habilita **Google** (activa el toggle,
   elige un correo de soporte y guarda). Es el único proveedor que usa la app.

### 3. Habilitar Firestore

1. En el menú lateral, ve a **Build → Firestore Database → Create database**.
2. Elige **Start in production mode** (ya incluimos las reglas correctas) y
   selecciona la región más cercana.
3. Una vez creada, ve a la pestaña **Rules** y reemplaza el contenido por el
   de [`firestore.rules`](firestore.rules) de este repo. Publica los cambios.

### 4. Registrar la app web y obtener las credenciales

1. En la página principal del proyecto, haz clic en el ícono **`</>`** (Web)
   para agregar una app web.
2. Ponle un nombre (ej. `antwallet-web`) y registra la app. **No** necesitas
   Firebase Hosting.
3. Copia el objeto `firebaseConfig` que te muestra — lo necesitas en el
   siguiente paso.

### 5. Configurar las variables de entorno

Copia `.env.example` a `.env` y completa los valores con los del paso anterior:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

`.env` nunca se sube a git (ya está en `.gitignore`).

### 6. Autorizar el dominio de despliegue

Si vas a publicar en GitHub Pages (u otro dominio), agrégalo en
**Authentication → Settings → Authorized domains**. `localhost` ya viene
autorizado por defecto, así que el desarrollo local funciona sin pasos
adicionales.

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173/ANTWallet/`).

## Build de producción

```bash
npm run build
npm run preview   # para previsualizar el build localmente
```

## Deploy en GitHub Pages

Este proyecto ya viene configurado para GitHub Pages:

- `vite.config.ts` tiene `base: '/ANTWallet/'` (ajusta este valor si tu
  repositorio tiene otro nombre).
- `package.json` incluye los scripts `predeploy` y `deploy` usando `gh-pages`.
- El campo `homepage` en `package.json` debe apuntar a tu usuario de GitHub.

Pasos:

1. Crea un repositorio en GitHub llamado `ANTWallet` (o el nombre que prefieras,
   actualizando `base` en `vite.config.ts` y `homepage` en `package.json` para
   que coincidan).
2. Sube el código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/ANTWallet.git
   git push -u origin main
   ```
3. Reemplaza `<your-github-username>` en el campo `homepage` de `package.json`
   por tu usuario real de GitHub.
4. Agrega el dominio `<tu-usuario>.github.io` en **Authentication → Settings →
   Authorized domains** (ver paso 6 de la configuración de Firebase).
5. Genera el build y publícalo en la rama `gh-pages`:
   ```bash
   npm run deploy
   ```
6. En GitHub, ve a **Settings → Pages** y verifica que la fuente sea la rama
   `gh-pages` (carpeta `/`). El sitio quedará disponible en:
   `https://<tu-usuario>.github.io/ANTWallet/`

> Nota: las variables `VITE_FIREBASE_*` se incrustan en el build en tiempo de
> compilación. Si usas CI/CD (ej. GitHub Actions) en vez de `npm run deploy`
> local, debes definirlas ahí como secrets antes de correr `npm run build`.

## Autenticación

- **Solo login con Google (SSO)**: un clic, sin contraseñas que administrar.
  No hay registro por email/contraseña — toda cuenta válida es una cuenta de
  Google.
- **Cada usuario ve solo sus datos**: la data se guarda en Firestore en
  `users/{uid}`, y las reglas de seguridad (`firestore.rules`) impiden que un
  usuario lea o escriba el documento de otro.

> En la consola de Firebase, en **Authentication → Sign-in method**, puedes
> deshabilitar el proveedor **Email/Password** si lo habías activado antes —
> ya no se usa y así queda bloqueado también a nivel de Firebase, no solo en
> el frontend.

## Control de acceso (admin)

ANTWallet no es pública: solo entran las cuentas que tú autorizas.

- El correo definido en `src/config/admin.ts` (`ADMIN_EMAIL`) es el
  **administrador** y siempre tiene acceso, además de una pestaña **Admin**
  exclusiva.
- Cualquier otra cuenta de Google que inicie sesión queda bloqueada en una
  pantalla de "Acceso pendiente" hasta que el admin la active.
- Desde la pestaña **Admin**, agrega el correo de la persona (ej. el de
  Pamela), y aparecerá en la lista con un switch **Activo/Inactivo** y un
  botón para eliminarlo. El cambio aplica de inmediato (es en tiempo real).
- La restricción real ocurre en `firestore.rules` (colección
  `allowedUsers`), no solo en el código del navegador — aunque alguien
  modifique el frontend, Firestore rechaza la lectura/escritura si su correo
  no está en la lista con `active: true`.

Si cambias el correo admin, actualiza **ambos** lugares: `src/config/admin.ts`
y la función `isAdmin()` en `firestore.rules` (y vuelve a publicar las reglas
en la consola de Firebase).

## Funcionalidades

- **Dashboard**: activos, deudas, patrimonio neto, vida de la billetera, Reina
  Hormiga del mes y jefe de deuda principal.
- **Cuentas**: agrega múltiples cuentas bancarias, efectivo, billeteras
  digitales, etc. Puedes editar el saldo (sumar/restar, ej. depósito de
  sueldo) desde el ícono de lápiz en cada cuenta.
- **Deudas como jefes**: cada deuda tiene una barra de vida basada en
  `remainingAmount / totalAmount`. Registra pagos para atacarlas; al llegar a
  0 se muestra la animación de "Jefe derrotado".
- **Gastos hormiga**: registra gastos por categoría con animación de hormiga
  cruzando la pantalla, toasts divertidos y shake de billetera si el gasto es
  ≥ $20.000.
- **Reina Hormiga**: categoría con mayor gasto del mes, con frase divertida.
- **Hormiguero**: visualización de hormigas según el gasto mensual (1 hormiga
  por cada $10.000, máximo 30).
- **Logros**: 6 logros calculados automáticamente según tu actividad.
- **Exportar / Importar**: exporta gastos a CSV, exporta/importa un backup
  completo en JSON.
- **Datos demo**: botón para cargar datos de ejemplo y botón para limpiar
  todos los datos (afecta solo tu cuenta).

## Estructura

```
src/
  components/        UI: formularios, listas, dashboard, gamificación
  components/auth/    pantallas de login/registro y verificación de correo
  store/               AuthContext (Firebase Auth), AppContext (Firestore), FxContext (efectos)
  lib/                 inicialización de Firebase
  utils/               currency, calculations, csv, dates, authErrors
  types/               modelos de datos
  data/                categorías de gasto y datos demo
firestore.rules         reglas de seguridad (cada usuario solo accede a su propio documento)
```
