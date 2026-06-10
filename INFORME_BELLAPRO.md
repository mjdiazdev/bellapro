# BellaPro — Informe de Proyecto
**Fecha:** Marzo 2026
**Preparado por:** MJ Díaz Dev

---

# PARTE 1 — VISIÓN GENERAL (Para el cliente)

## ¿Qué es BellaPro?

BellaPro es una plataforma digital de ventas diseñada específicamente para su negocio de distribución. Permite a sus clientes realizar pedidos de forma rápida y sencilla escaneando un código QR con su móvil, sin necesidad de registrarse ni descargar ninguna aplicación.

Usted, como administrador, tiene acceso a un panel completo desde el que gestiona todo: productos, pedidos, clientes, métodos de envío y más.

---

## ¿Cómo funciona para el cliente final?

El proceso es muy simple:

```
1. El cliente escanea el código QR (catálogo, tarjeta, expositor...)
        ↓
2. Ve los productos de esa categoría con precios y disponibilidad
        ↓
3. Añade lo que quiere al carrito
        ↓
4. Introduce sus datos de entrega y elige el método de envío
        ↓
5. Paga con PayPal de forma segura
        ↓
6. Recibe un email de confirmación con el detalle de su pedido
```

No hace falta registro, no hace falta aplicación. Solo escanear y comprar.

---

## ¿Qué puede hacer usted desde el panel de administración?

### Gestión de Pedidos
- Ver todos los pedidos en tiempo real
- Consultar el detalle de cada pedido: productos, cantidades, dirección de entrega, método de envío y total pagado
- Cambiar el estado de los pedidos (pendiente, completado, cancelado)
- Actualizar varios pedidos a la vez

### Gestión de Productos
- Añadir, editar y eliminar productos
- Controlar el stock de cada producto
- Importar productos en masa desde Excel (ideal para catálogos grandes)
- Organizar productos por categorías

### Códigos QR
- Cada categoría de productos tiene su propio código QR único
- Puede generar e imprimir el QR desde el panel
- Al escanear el QR, el cliente ve directamente los productos de esa categoría

### Logística y Envíos
- Configurar los centros de distribución
- Definir los métodos de envío disponibles y sus precios
- El sistema asigna automáticamente el centro y método según el código postal del cliente

### Clientes
- Ver el listado de todos los clientes que han realizado pedidos
- Consultar el historial de compras de cada cliente

### Dashboard (Panel de Control)
- Resumen visual de ventas, pedidos y clientes
- Gráficos de rendimiento por centro de distribución
- Métricas actualizadas en tiempo real

---

## Tecnología y seguridad

- La plataforma funciona en un **servidor propio** con dominio `bella-online.es`
- Toda la comunicación es **cifrada con SSL** (candado verde HTTPS)
- Los pagos se procesan a través de **PayPal**, sin que datos bancarios pasen por nuestra plataforma
- Los correos de confirmación se envían desde `info@bella-online.es`

---

## Estado actual de la plataforma

| Funcionalidad | Estado |
|---|---|
| Tienda con escaneo QR | ✅ Funcionando |
| Carrito y checkout | ✅ Funcionando |
| Pago con PayPal | ✅ Funcionando (modo pruebas) |
| Email de confirmación de compra | ⏳ Pendiente de validación DNS |
| Panel de administración completo | ✅ Funcionando |
| Dashboard con métricas | ✅ Funcionando |
| Importación de productos desde Excel | ✅ Funcionando |
| Dominio y SSL activos | ✅ Funcionando |

---

## Pendientes antes del lanzamiento oficial

### 1. Activar correo de confirmación
Para que los emails de compra lleguen correctamente a Gmail y otros proveedores, es necesario actualizar un registro técnico (SPF) en el proveedor donde está registrado el dominio (**servicio-online.net**).

**Qué hay que hacer:**
Acceder al panel de **servicio-online.net** → Zona DNS de `bella-online.es` → localizar el registro TXT con `v=spf1` → reemplazarlo por:
```
v=spf1 ip4:72.61.111.16 include:spf.dominioabsoluto.net ~all
```

### 2. Activar PayPal en modo real
Actualmente PayPal está en modo de pruebas. Para aceptar pagos reales hay que cambiar las credenciales de PayPal al entorno de producción desde el panel de PayPal Business.

---

## Accesos entregados

| Elemento | Detalle |
|---|---|
| URL de la plataforma | https://bella-online.es |
| Panel de administración | https://bella-online.es/login |
| Correo del sistema | info@bella-online.es |
| Repositorio del código | https://github.com/mjdiazdev/bellapro |
| Servidor (SSH) | VPS Hostinger — IP: 72.61.111.16 |

---

## Cierre y entrega

El desarrollo de BellaPro se ha completado satisfactoriamente, cumpliendo con todos los requisitos especificados. La plataforma está desplegada en producción y cuenta con documentación técnica completa.

### Entregables

- Plataforma web completa (frontend React + backend Laravel) desplegada en producción
- Código fuente versionado en repositorio Git
- Informe de proyecto completo (este documento)
- Documentación técnica de arquitectura y despliegue
- Soporte técnico 48 horas post-entrega

---

## Soporte y mantenimiento

Para cualquier consulta técnica, incidencia o solicitud de nuevas funcionalidades, contacte con el equipo de desarrollo:

**Studio Ascend Clarus**
Desarrollo Web & Aplicaciones
mjdiaz.dev@gmail.com

---
---

# PARTE 2 — DOCUMENTACIÓN TÉCNICA (Para desarrolladores)

## 1. Stack Tecnológico

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| PHP | 8.3 | Lenguaje servidor |
| Laravel | 12 | Framework principal |
| MySQL | 8.x | Base de datos |
| Laravel Sanctum | — | Autenticación por tokens |
| Spatie Permission | — | Gestión de roles y permisos |
| Maatwebsite Excel | — | Importación de productos desde Excel |
| SimpleSoftwareIO QrCode | — | Generación de códigos QR |
| PayPal REST API | v2 | Pasarela de pago |

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Framework UI |
| React Router | 7.9 | Navegación SPA |
| Axios | 1.x | Peticiones HTTP |
| Tailwind CSS | 3.4 | Estilos |
| Recharts | 3.7 | Gráficos del dashboard |
| html5-qrcode | 2.3 | Escáner QR en navegador |
| Lucide React | 0.555 | Iconografía |

### Infraestructura (Producción)
| Elemento | Detalle |
|---|---|
| Servidor | VPS Hostinger (IP: 72.61.111.16) |
| Sistema Operativo | Linux (cPanel) |
| Web Server | Apache 2.4 con PHP 8.3 |
| Dominio | bella-online.es |
| SSL | Certificado activo (HTTPS) |
| Correo | SMTP bella-online.es (puerto 465, SSL) |

---

## 2. Arquitectura

```
Cliente (React SPA)
        │
        │ HTTPS (Axios + Sanctum token)
        ▼
Apache / bella-online.es
        │
        ├── /          → React Build (public_html)
        └── /backend/  → Laravel API (symlink → backend/public)
                │
                ├── Routes (api.php)
                ├── Controllers (Http/Controllers/Api/)
                ├── Handlers (app/Handlers/)        ← lógica de negocio
                ├── Repositories (app/Repositories/) ← queries DB
                ├── Services (PayPal, Mail)
                └── Models (Eloquent ORM)
```

### Patrón arquitectónico
- **Controller** → recibe request, valida, delega
- **Handler** → orquesta lógica de negocio
- **Repository** → queries a base de datos
- **Service** → integraciones externas (PayPal, Mail)

---

## 3. Módulos del Sistema

### 3.1 Tienda (Público)
- Escáner QR en navegador (html5-qrcode)
- Listado de productos por categoría
- Carrito persistente en `localStorage` (CartContext)
- Búsqueda y filtrado en tiempo real
- Validación de stock antes de añadir

**Rutas API:**
- `GET /api/qr/{code}` → productos por QR
- `GET /api/categories/{id}/products` → productos de categoría

### 3.2 Checkout
- Formulario multietapa: email → facturación → envío → método → pago
- Validación de CP (DB local + fallback zippopotam.us)
- Métodos de envío dinámicos según CP y centro
- IVA 21% automático
- PayPal OAuth → crear orden → capturar pago
- Email de confirmación post-pago

**Rutas API:**
- `POST /api/orders` → crear orden (transacción ACID)
- `POST /api/orders/{id}/capture-paypal` → capturar pago
- `GET /api/postal-codes/lookup/{code}` → validar CP
- `GET /api/distribution-centers/shipping-methods` → métodos disponibles

### 3.3 Órdenes (Admin)
- Listado con filtros por estado, fecha, cliente
- Detalle con items, precios, datos de envío
- Bulk update de estados
- Estados: `pending` → `completed` → `canceled`

### 3.4 Productos (Admin)
- CRUD completo
- Stock por producto (actual + mínimo)
- Importación masiva desde Excel
- Bulk update de precios/stock

### 3.5 Categorías y QR (Admin)
- CRUD de categorías
- Generación de QR por categoría
- `code` único por categoría → mapea al QR físico

### 3.6 Logística (Admin)
- Centros de Distribución (nombre, email, coordinador)
- Métodos de Envío (nombre, precio)
- Asignación de métodos por centro
- Asignación automática por CP del cliente

### 3.7 Usuarios y Roles (Admin)
- Roles: `admin` (acceso total), `coordinador` (solo órdenes de su centro)
- Autenticación por token Sanctum

### 3.8 Dashboard (Admin)
- KPIs: órdenes, clientes, facturación
- Gráficos por centro de distribución (Recharts)
- Estadísticas en tiempo real

---

## 4. Base de Datos

```
orders
├── customer_id, delivery_*, delivery_postal_code_id
├── dist_center_shipping_method_id
├── subtotal, shipping_price, total (IVA 21%)
└── status (pending|completed|canceled)

order_items
└── order_id, product_id, quantity, unit_price, total_price

products
└── category_id, name, reference, price, description, image, status

product_stocks
└── product_id, stock, min_stock

categories
└── id, name, code, qr_url

customers
└── nif, email, name, phone, address, postal_code_id

payments
└── order_id, method, amount, status, details (JSON PayPal)

distribution_centers
└── name, email, phone, user_id (coordinador)

distribution_center_shipping_methods
└── distribution_center_id, shipping_method_id

postal_codes / cities / provinces
└── geolocalización
```

---

## 5. Integración PayPal

1. `POST /api/orders` → crea orden en DB (pending)
2. `PayPalService::createOrder()` → token OAuth → orden PayPal
3. Devuelve `approve_url` → frontend redirige a PayPal
4. Cliente autoriza → PayPal redirige a `PAYPAL_RETURN_URL`
5. `POST /api/orders/{id}/capture-paypal` → captura pago
6. Verifica `COMPLETED` → actualiza Order + Payment → envía email

**Variables requeridas:**
```
PAYPAL_MODE=sandbox|production
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_RETURN_URL=https://bella-online.es/checkout/payment-confirm
PAYPAL_CANCEL_URL=https://bella-online.es/checkout
```

---

## 6. Sistema de Correo

**Driver:** SMTP directo (bella-online.es:465 SSL)

```
MAIL_MAILER=smtp
MAIL_HOST=bella-online.es
MAIL_PORT=465
MAIL_ENCRYPTION=ssl
MAIL_USERNAME=info@bella-online.es
MAIL_FROM_ADDRESS=info@bella-online.es
MAIL_FROM_NAME="BellaPro"
```

**Template:** `resources/views/emails/purchase.blade.php`
Incluye: número de pedido, items, subtotal, envío, IVA (21%), total.

> **Pendiente:** Registro SPF en servicio-online.net para autorizar IP 72.61.111.16.

---

## 7. Estructura en Servidor

```
/home/bellapro/
├── public_html/          ← DocumentRoot Apache (React build)
│   ├── index.html
│   ├── static/
│   ├── .htaccess         ← React Router + FollowSymLinks
│   └── backend/          ← symlink → bellapro/backend/public
│
└── bellapro/
    ├── frontend/
    │   ├── src/
    │   └── package.json  ← BUILD_PATH='/home/bellapro/public_html'
    └── backend/
        ├── app/
        ├── public/
        └── .env
```

---

## 8. Proceso de Despliegue

```bash
# 1. Actualizar código
git pull

# 2. Compilar frontend (va directo a public_html)
cd frontend && npm run build

# 3. Actualizar dependencias backend (si hay cambios en composer)
cd ../backend
/opt/cpanel/ea-php83/root/usr/bin/php /usr/local/bin/composer install --no-dev

# 4. Limpiar caché Laravel
php artisan config:clear && php artisan cache:clear
```

---

## 9. Pendientes Técnicos

| # | Tarea | Prioridad |
|---|---|---|
| 1 | Actualizar SPF en servicio-online.net (ip4:72.61.111.16) | Alta |
| 2 | Activar PayPal producción (PAYPAL_MODE=production) | Alta |
| 3 | Verificar correos de confirmación tras SPF | Alta |
| 4 | Actualizar PHP CLI a 8.3 como versión por defecto en el servidor | Media |

---

*Documento generado: Marzo 2026*
