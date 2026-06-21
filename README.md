# 🐜 ANTWallet

**Tu billetera está bajo asedio.**

ANTWallet es una app de finanzas personales que convierte el seguimiento de
gastos en un mini-juego: cada gasto pequeño e impulsivo ("gasto hormiga" —
café, delivery, compras de último minuto) es un ataque a tu billetera, y cada
deuda es un jefe con barra de vida que vas derrotando a medida que pagas.

Nada de planillas aburridas ni dashboards genéricos. Si vas a llevar tus
finanzas, que al menos se sienta como ganar una partida.

## ✨ Por qué existe

La mayoría de apps de finanzas personales son correctas pero aburridas — y
aburrido es lo opuesto a sostenible. ANTWallet apuesta por la gamificación: ver
literalmente cómo tu "vida de billetera" baja cuando gastas de más, o cómo un
jefe de deuda pierde HP con cada pago, da una retroalimentación inmediata que
una tabla de Excel nunca va a dar.

## 🎮 Funcionalidades

- **Dashboard**: activos, deudas, patrimonio neto, vida de la billetera, Reina
  Hormiga del mes (la categoría que más te gastó) y tu jefe de deuda
  principal.
- **Cuentas**: múltiples cuentas bancarias, efectivo, billeteras digitales —
  con edición rápida de saldo (depósitos, ajustes) sin tener que borrar y
  recrear la cuenta.
- **Deudas como jefes finales**: barra de vida proporcional a lo que falta por
  pagar. Cada pago es un golpe; llegar a cero dispara una animación de "jefe
  derrotado".
- **Gastos hormiga**: registro rápido por categoría, con hormiga animada
  cruzando la pantalla, toasts con personalidad, y un "shake" de la billetera
  si el gasto es grande.
- **Hormiguero y logros**: visualización de cuántas "hormigas" llevas este mes
  y logros desbloqueables (primer gasto, primera deuda, jefe derrotado,
  patrimonio positivo, etc.).
- **Exportar / importar**: CSV de gastos y backup completo en JSON.
- **Login con Google + control de acceso**: nada de contraseñas que cuidar.
  El acceso es privado por invitación — un panel de administrador decide
  quién entra.
- **Multiusuario real**: cada cuenta de Google tiene su propio dashboard,
  sincronizado en la nube (Firestore), no en el navegador.

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| UI | React + TypeScript + Vite |
| Estilos | TailwindCSS (dark mode) |
| Animación | Framer Motion |
| Auth | Firebase Authentication (Google SSO) |
| Datos | Firebase Firestore (tiempo real, por usuario) |
| Iconografía | lucide-react |

## 🚀 Probarlo localmente

### Requisitos

- Node.js 18+
- Un proyecto de Firebase propio (plan gratuito Spark es suficiente)

### 1. Clonar e instalar

```bash
git clone https://github.com/AlvaroCC96/ANTWallet.git
cd ANTWallet
npm install
```

### 2. Crear tu propio proyecto de Firebase

ANTWallet no trae credenciales — cada quien conecta su propio backend.

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) →
   **Agregar proyecto**.
2. **Authentication → Get started → Sign-in method**: habilita **Google**
   (es el único proveedor que usa la app).
3. **Firestore Database → Create database**: elige **Start in production
   mode**. Luego, en la pestaña **Rules**, pega el contenido de
   [`firestore.rules`](firestore.rules) y publica.
4. En la página principal del proyecto, agrega una app **Web** (ícono `</>`)
   y copia el objeto `firebaseConfig` que te entrega.

### 3. Variables de entorno

```bash
cp .env.example .env
```

Completa `.env` con los valores de `firebaseConfig` del paso anterior
(`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.). Este archivo
nunca se sube a git.

### 4. Definir tu cuenta como administrador

En [`src/config/admin.ts`](src/config/admin.ts) y en la función `isAdmin()`
de [`firestore.rules`](firestore.rules), reemplaza el correo por el tuyo. El
admin siempre tiene acceso y es quien aprueba (o no) a otras cuentas desde el
panel **Admin** dentro de la app.

### 5. Correr en desarrollo

```bash
npm run dev
```

Abre la URL que muestra la terminal (por defecto
`http://localhost:5173/ANTWallet/`).

## 📦 Build y despliegue

```bash
npm run build      # build de producción
npm run preview     # previsualizarlo localmente
```

El proyecto ya viene configurado para **GitHub Pages**:

```bash
npm run deploy
```

Esto construye el proyecto y publica `dist/` en la rama `gh-pages`. Antes de
hacerlo por primera vez:

- Ajusta `base` en [`vite.config.ts`](vite.config.ts) y `homepage` en
  [`package.json`](package.json) si tu repo no se llama `ANTWallet` o tu
  usuario no es `AlvaroCC96`.
- Agrega el dominio `<tu-usuario>.github.io` en **Firebase → Authentication →
  Settings → Authorized domains**, o el login con Google fallará en
  producción.
- En GitHub, en **Settings → Pages**, confirma que la fuente sea la rama
  `gh-pages`.

> Las variables `VITE_FIREBASE_*` quedan incrustadas en el build en tiempo de
> compilación. Si despliegas vía CI/CD en vez de `npm run deploy` local,
> defínelas ahí como secrets antes de compilar.

## 🔐 Acceso y seguridad

- **Login exclusivo con Google** — sin contraseñas que filtrar ni recuperar.
- **Acceso por invitación**: solo el administrador y las cuentas que él
  habilite desde el panel **Admin** pueden entrar. El resto ve una pantalla
  de "acceso pendiente".
- **Aislamiento real de datos**: cada usuario tiene su propio documento en
  Firestore (`users/{uid}`), y las reglas de seguridad (no solo el código del
  frontend) impiden que alguien lea o escriba los datos de otra persona.

## 🗂️ Estructura del proyecto

```
src/
  components/         UI: formularios, listas, dashboard, gamificación
  components/auth/     pantallas de login y acceso denegado
  components/admin/    panel de administración de usuarios permitidos
  store/                AuthContext (Firebase Auth), AppContext (Firestore), FxContext (efectos)
  lib/                  inicialización de Firebase
  utils/                currency, calculations, csv, dates, authErrors
  types/                modelos de datos
  data/                 categorías de gasto y datos demo
firestore.rules          reglas de seguridad por usuario y allowlist de acceso
```

---

Hecho por [AlvaroCC96](https://github.com/AlvaroCC96) — porque las hormigas
siempre encuentran la forma de llegar a tu billetera.
