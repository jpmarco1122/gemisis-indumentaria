# GENESIS | Indumentaria — tienda virtual

Tienda e-commerce MVP lista para desarrollar y desplegar con **React + Vite + Tailwind CSS + Supabase + Supabase Storage + Mercado Pago + Google Analytics + Vercel**.

## 1. Requisitos

- Node.js 20+ recomendado.
- npm 10+.
- Cuenta de Supabase.
- Cuenta de Mercado Pago Developers.
- Cuenta de Google Analytics.
- Cuenta de Vercel.
- Git/GitHub opcional, recomendado para deploy.

## 2. Instalar y levantar localmente

```bash
npm install
copy .env.example .env.local
npm run dev
```

En Linux/macOS reemplazá `copy` por `cp`.

Abrí `http://localhost:5173`.

Antes de probar el checkout, configurá Supabase y Mercado Pago según las secciones siguientes.

## 3. Configurar Supabase — paso a paso

### 3.1 Crear proyecto

1. Entrá a https://supabase.com/dashboard.
2. Creá un proyecto nuevo.
3. Guardá la contraseña de la base de datos.
4. Esperá a que termine de provisionarse.
5. En **Project Settings > API** copiá:
   - Project URL → `VITE_SUPABASE_URL` y `SUPABASE_URL`.
   - Publishable/anon key → `VITE_SUPABASE_PUBLISHABLE_KEY`.
6. Copiá la **service_role key** solamente en el backend/Vercel como `SUPABASE_SERVICE_ROLE_KEY`. **Nunca la pongas en `VITE_*`, GitHub ni código del frontend.**

### 3.2 Crear tablas

1. Abrí **SQL Editor** en Supabase.
2. Creá una nueva query.
3. Copiá todo el contenido de `supabase/schema.sql`.
4. Ejecutá la query.
5. En **Table Editor** verificá `products`, `categories` y `orders`.

El script crea además datos demo para poder probar la tienda.

### 3.3 Autenticación del administrador

1. Supabase → **Authentication → Users**.
2. Elegí **Add user**.
3. Creá el email y contraseña del administrador.
4. Luego entrá a `/login` en la aplicación.
5. El usuario autenticado puede entrar al `/admin`.

> Para producción recomiendo agregar una tabla `admin_users` y restringir las policies a esos usuarios, en vez de permitir cualquier usuario autenticado. El MVP usa `authenticated` para simplificar la puesta en marcha.

## 4. Configurar Supabase Storage — paso a paso

Las imágenes de productos se almacenan en Supabase Storage.

### 4.1 Crear bucket

1. Supabase → **Storage**.
2. Click en **New bucket**.
3. Nombre exacto: `product-images`.
4. Para este MVP activá **Public bucket**.
5. Creá el bucket.

La aplicación utiliza este nombre en `src/lib/supabase.js`.

### 4.2 Policies del bucket

Para permitir que el administrador autenticado suba imágenes:

1. Entrá a **Storage → Policies**.
2. Seleccioná el bucket `product-images`.
3. Creá una policy de **INSERT** para `authenticated`.
4. Creá una policy de **UPDATE** para `authenticated`.
5. Creá una policy de **DELETE** para `authenticated`.
6. Para lectura, al ser bucket público, las imágenes pueden ser servidas por URL pública.

Una policy de INSERT puede utilizar una condición como:

```sql
bucket_id = 'product-images' and auth.role() = 'authenticated'
```

> La interfaz de Supabase puede cambiar los nombres de los campos/pantallas. Lo importante es que las operaciones de escritura queden limitadas a usuarios autenticados.

### 4.3 Cómo sube una imagen el panel

El administrador entra a `/admin`, selecciona una imagen y la aplicación:

1. Genera un nombre UUID.
2. Sube el archivo a `product-images`.
3. Obtiene la URL pública.
4. Guarda `image_url` en `products`.

Para producción recomiendo guardar también `image_path` y usarlo para borrar/reemplazar imágenes antiguas.

## 5. Variables de entorno

Copiá `.env.example` como `.env.local` y completá:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=xxxxx
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxx

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxx
MERCADOPAGO_WEBHOOK_SECRET=xxxxx
APP_URL=http://localhost:5173
```

Las variables que comienzan con `VITE_` llegan al navegador. **No coloques secretos ahí.**

## 6. Google Analytics 4

1. Google Analytics → Admin.
2. Creá una propiedad GA4.
3. Creá un Web Data Stream.
4. Copiá el Measurement ID (`G-...`).
5. Configuralo como `VITE_GA_MEASUREMENT_ID`.

La aplicación inicializa GA4 y registra eventos básicos como `select_item`, `add_to_cart` y `begin_checkout`.

## 7. Mercado Pago

### Desarrollo

1. Entrá al portal de desarrolladores de Mercado Pago.
2. Creá una aplicación.
3. Usá credenciales de prueba mientras desarrollás.
4. Guardá el Access Token como `MERCADOPAGO_ACCESS_TOKEN`.
5. El frontend nunca recibe el Access Token.

### Flujo

`Checkout React → /api/create-preference → Mercado Pago → pago → /api/webhook → Supabase orders`.

El backend crea la orden antes de enviar al usuario a Mercado Pago. El webhook consulta el pago directamente en Mercado Pago y actualiza el pedido.

### Webhook

En producción configurá la URL:

```text
https://TU-DOMINIO.vercel.app/api/webhook
```

No uses la URL local como webhook permanente. Para desarrollo local podés utilizar un túnel HTTPS como ngrok/Cloudflare Tunnel si necesitás recibir callbacks reales.

> Antes de producción endurecé la validación criptográfica del webhook usando la firma oficial de Mercado Pago y el secreto configurado. El endpoint de este MVP consulta el pago directamente a Mercado Pago para evitar confiar en el payload del webhook.

## 8. Vercel

1. Subí el proyecto a GitHub.
2. Vercel → **Add New Project**.
3. Importá el repositorio.
4. Framework: Vite.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Agregá todas las variables del `.env.local` en **Settings → Environment Variables**.
8. Cambiá `APP_URL` por tu dominio HTTPS de Vercel.
9. Deploy.
10. Configurá el webhook de Mercado Pago con el dominio final.

## 9. Prueba completa recomendada

1. Abrí `/catalogo`.
2. Buscá un producto.
3. Filtrá por categoría.
4. Abrí una ficha.
5. Elegí talle/color.
6. Agregá al carrito.
7. Cambiá cantidades.
8. Iniciá checkout.
9. Usá credenciales de prueba de Mercado Pago.
10. Comprobá el pedido en `orders`.
11. Comprobá el cambio de pago mediante webhook.
12. Abrí `/seguimiento` con número de pedido + email.
13. Entrá a `/login` y luego `/admin`.
14. Subí una imagen y creá un producto.
15. Confirmá que la imagen aparece en Storage.

## 10. Panel administrador

Ruta: `/admin`.

Permite:

- Crear productos.
- Subir imagen.
- Definir precio.
- Definir stock.
- Definir talles.
- Definir colores.
- Ver productos.
- Ver últimos pedidos.
- Cambiar estado del pedido.
- Cargar código de seguimiento.

Estados disponibles:

`PENDING → PAID → PREPARING → SHIPPED → DELIVERED`

También existe `CANCELLED`.

## 11. Base de datos

### products

Catálogo, precio, stock, variantes e imagen.

### categories

Categorías de la tienda.

### orders

Cliente, productos comprados, total, estado, pago, envío, tracking y datos de Mercado Pago.

## 12. Seguridad antes de producción

- No subir `.env.local` a Git.
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY`.
- Nunca exponer `MERCADOPAGO_ACCESS_TOKEN`.
- Restringir Storage a administradores reales.
- Restringir las policies de productos a administradores.
- Validar firma oficial del webhook.
- Mover la creación/actualización crítica de stock a funciones transaccionales.
- Implementar idempotencia del webhook para evitar descontar stock dos veces.
- Agregar rate limiting al tracking y login.
- Validar tamaño, MIME y extensión de imágenes.
- Configurar dominio propio y HTTPS.

## 13. Mejoras de una segunda etapa

- Variantes reales con stock independiente por talle/color.
- Eliminación/reemplazo de imágenes.
- Edición de productos desde el panel.
- Gestión de categorías.
- Cupones.
- Costos y métodos de envío.
- Emails transaccionales.
- WhatsApp.
- SEO avanzado.
- Sitemap/robots.
- Optimización y resize de imágenes.
- Roles `admin`/`staff`.
- Historial de estados de pedidos.
- Integración con servicios de logística.
- Dashboard de ventas y métricas.

## 14. Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

Si `npm run build` termina sin errores, la aplicación está lista para ser desplegada en Vercel.
