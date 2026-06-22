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
- **🧠 AntAI Advisor**: un consejero financiero con IA generativa que observa
  tu progreso y reacciona solo cuando pasa algo importante (subes de nivel,
  derrotas un jefe, cambia la Reina Hormiga, completas una meta, tu
  patrimonio se vuelve positivo o cruza un hito, o tus gastos hormiga se
  descontrolan). También puedes pedirle un consejo cuando quieras.

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| UI | React + TypeScript + Vite |
| Estilos | TailwindCSS (dark/light mode) |
| Animación | Framer Motion |
| Auth | Firebase Authentication (Google SSO) |
| Datos | Firebase Firestore (tiempo real, por usuario) |
| IA | OpenAI API vía Firebase Cloud Functions |
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

## 🧠 AntAI Advisor (opcional)

AntAI Advisor es un consejero financiero con IA generativa integrado al RPG:
nunca calcula montos ni toca tus datos, solo interpreta un resumen y genera
mensajes narrativos. Es **opcional** — el resto de la app funciona perfecto
sin configurarlo, y si la función no está desplegada, AntAI simplemente
muestra un mensaje local ("el oráculo está descansando") en vez de romperse.

### Requisitos para activarlo

1. **Plan Blaze en Firebase** (pago por uso). Las Cloud Functions necesitan
   salir a internet para llamar a OpenAI, y eso requiere el plan de pago —
   el plan gratuito Spark no lo permite. Tiene una capa gratuita generosa;
   para el volumen de esta app el costo real es mínimo.
2. **Una cuenta y API key de OpenAI** — créala en
   [platform.openai.com](https://platform.openai.com/api-keys). Esta key
   **nunca** va en el frontend ni en variables `VITE_*`; vive solo en
   Firebase Secret Manager.

### 1. Instalar el código de las funciones

```bash
cd functions
npm install
```

### 2. Iniciar sesión y conectar el proyecto de Firebase

```bash
npx firebase-tools login
npx firebase-tools use --add   # elige tu proyecto (antwallet-b8f31 si usas el mismo)
```

### 3. Guardar la API key de OpenAI como secret

```bash
npx firebase-tools functions:secrets:set OPENAI_API_KEY
```

Te pedirá pegar la key — queda cifrada en Secret Manager, no en el código.

### 4. (Opcional) Elegir el modelo

Por defecto la función usa `gpt-4o-mini` (económico). Para usar otro modelo
de tu cuenta de OpenAI sin tocar código, crea `functions/.env` (no se sube a
git) con:

```
OPENAI_MODEL=gpt-4o-mini
```

Ese valor sobreescribe el `default` definido vía `defineString('OPENAI_MODEL', ...)`
en `functions/src/index.ts`. Si prefieres no crear el archivo, simplemente
edita el `default` ahí mismo y vuelve a desplegar.

### 5. Desplegar

```bash
cd functions && npm run build
npx firebase-tools deploy --only functions
```

Esto publica `generateFinancialInsight`. El frontend ya está configurado
para llamarla (`src/lib/aiAdvisor.ts`) — no necesitas tocar nada más.

### Cómo probar cada parte

- **Generación manual**: entra al Dashboard, busca la card "AntAI Advisor" y
  haz clic en "🧠 Generar Consejo IA". Deberías ver el shimmer de carga y
  luego un consejo nuevo.
- **Eventos automáticos**: usa el botón "Cargar demo" (pestaña Datos) o
  registra acciones reales — subir de nivel, pagar una deuda hasta dejarla en
  $0, completar una meta, o hacer que tus gastos hormiga superen el 80% del
  presupuesto mensual. Cada uno dispara un insight solo, sin que aprietes
  nada, y aparece un toast con el evento. AntAI no repite el mismo evento dos
  veces (queda guardado en `aiWatcherState` dentro de tu documento de
  usuario).
- **Fallback local**: antes de desplegar la función (o si la apagas/falla),
  haz clic en "Generar Consejo IA" — deberías ver un mensaje como "El oráculo
  está descansando" en vez de un error o una pantalla rota.
- **Historial**: abre "Historial" en la card de AntAI para ver hasta los
  últimos 20 consejos, y "Limpiar historial" para vaciarlo.

### Seguridad

- La API key de OpenAI vive en Firebase Secret Manager, nunca en el
  frontend ni en el repo.
- La función valida que quien llama esté autenticado y, además, que su
  correo esté en `allowedUsers` (o sea el admin) — el mismo control de
  acceso que ya usa el resto de la app, replicado server-side con el Admin
  SDK (que ignora `firestore.rules` a propósito, ya que corre en el backend).
- A la IA solo se le envía un `FinancialSnapshot` con montos agregados
  (patrimonio, nivel, XP, nombre del jefe principal, etc.) — nunca gastos
  individuales, nombres de cuentas reales ni movimientos completos.

## 🗂️ Estructura del proyecto

```
src/
  components/          UI: formularios, listas, dashboard, gamificación
  components/auth/      pantallas de login y acceso denegado
  components/admin/     panel de administración de usuarios permitidos
  components/rpg/       perfil RPG, misiones, timeline, logros
  components/ai/         AntAI Advisor: card, historial, watcher de eventos
  store/                 AuthContext, AppContext (Firestore), FxContext, ThemeContext
  hooks/                 useAIAdvisor
  lib/                   inicialización de Firebase + cliente de Cloud Functions
  utils/                 calculations, rpg, achievements, missions, timeline,
                         bossNames, creditCards, snapshot, aiEventDetector
  types/                 modelos de datos, tipos RPG y de IA
  data/                  categorías, datos demo, mensajes, eventos de IA
firestore.rules           reglas de seguridad por usuario y allowlist de acceso
functions/                Firebase Cloud Functions (generateFinancialInsight)
```

---

Hecho por [AlvaroCC96](https://github.com/AlvaroCC96) — porque las hormigas
siempre encuentran la forma de llegar a tu billetera.
