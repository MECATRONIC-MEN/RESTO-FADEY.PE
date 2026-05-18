# Resto Fadey

Sitio web profesional para **Resto Fadey** — el sistema POS número uno para tu restaurante en Perú.

🌐 **Dominio:** [https://restofadey.pe](https://restofadey.pe)

## Tecnologías

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/) (iconos)

## Estructura del proyecto

```
/app              → Páginas y rutas (App Router)
/components       → Componentes reutilizables
/components/ui    → UI base (Button, Card, etc.)
/sections         → Secciones de la landing page
/public           → Assets estáticos
/public/images    → Imágenes y placeholders
/styles           → Estilos globales
/lib              → Utilidades, datos y configuración SEO
```

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page principal |
| `/planes` | Planes y precios |
| `/demo` | Solicitar demostración |
| `/contacto` | Formulario de contacto |
| `/blog` | Blog (estructura preparada) |
| `/terminos` | Términos y condiciones |
| `/privacidad` | Política de privacidad |

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## SEO

- Metadata optimizada en `lib/seo.ts`
- Open Graph configurado
- `app/sitemap.ts` — sitemap dinámico
- `app/robots.ts` — robots dinámico
- `public/robots.txt` y `public/sitemap.xml` — archivos estáticos

## Integración SUNAT

Estructura preparada en `lib/sunat.ts` para futura integración de comprobantes electrónicos.

## Personalización

- **WhatsApp:** Edita el número en `lib/constants.ts` y `lib/utils.ts`
- **Planes y precios:** Edita `lib/data.ts`
- **Colores:** Configura en `tailwind.config.ts`

## Despliegue en Perú (dominio restofadey.pe)

Para que al escribir **restofadey.pe** en el navegador lleguen a tu web necesitas **3 cosas**:

### 1. Registrar el dominio `.pe` (Perú)

Compra **restofadey.pe** en un registrador autorizado para dominios peruanos, por ejemplo:

- [Punto.pe](https://www.punto.pe) — registrador local
- [NIC.pe / Zona Perú](https://www.nic.pe) — información oficial del `.pe`
- Hostinger, GoDaddy u otros que ofrezcan extensión `.pe`

> El dominio es solo el nombre (como una dirección). Aún debes alojar la web en un servidor.

### 2. Publicar la web (hosting)

**Opción recomendada (Next.js): [Vercel](https://vercel.com)** — gratis para proyectos como este, rápido y pensado para Next.js.

1. Sube el proyecto a **GitHub** (repositorio privado o público).
2. Entra en [vercel.com](https://vercel.com) → **Add New Project** → importa el repo.
3. Deja el framework en **Next.js** y haz **Deploy**.
4. En el proyecto: **Settings → Domains** → agrega `restofadey.pe` y `www.restofadey.pe`.
5. Vercel te mostrará los registros DNS que debes copiar en tu registrador.

**Opción con proveedor peruano (VPS):** si prefieres servidor en Perú (Datta, NEODATA, Banahosting VPS, etc.):

```bash
npm run build
npm start
```

Necesitas un VPS con Node.js 18+, Nginx como proxy y PM2. Es más técnico; Vercel suele ser más simple para este proyecto.

### 3. Conectar dominio y DNS

En el panel de tu registrador (donde compraste `restofadey.pe`), configura:

| Tipo | Nombre | Valor (ejemplo con Vercel) |
|------|--------|----------------------------|
| `A` | `@` | IP que indique Vercel |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Los valores exactos los da Vercel al agregar el dominio. La propagación puede tardar **1–24 horas**.

### 4. HTTPS

Vercel activa **SSL gratis** automáticamente. Tu sitio quedará en `https://restofadey.pe`.

### Checklist antes de publicar

- [ ] WhatsApp real en `lib/constants.ts`
- [ ] `npm run build` sin errores
- [ ] Dominio `restofadey.pe` comprado y DNS apuntando al hosting

### Comandos útiles

```bash
npm run build   # verificar que compila
npm run start   # probar versión producción local
```

## Licencia

© Resto Fadey. Todos los derechos reservados.
