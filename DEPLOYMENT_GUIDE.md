# 🚀 GUÍA DE DESPLIEGUE - Impulso Digital en Hostinger

Esta guía detalla el proceso completo para subir y configurar el sistema de gestión operativa en tu servidor de Hostinger.

---

## 📋 ÍNDICE
1. [Requisitos Previos](#1-requisitos-previos)
2. [Paso 1: Crear la Base de Datos en Hostinger](#paso-1-crear-la-base-de-datos-en-hostinger)
3. [Paso 2: Importar las Tablas en phpMyAdmin](#paso-2-importar-las-tablas-en-phpmyadmin)
4. [Paso 3: Configurar las Credenciales de la API](#paso-3-configurar-las-credenciales-de-la-api)
5. [Paso 4: Compilar el Proyecto React](#paso-4-compilar-el-proyecto-react)
6. [Paso 5: Subir los Archivos a Hostinger](#paso-5-subir-los-archivos-a-hostinger)
7. [Paso 6: Verificación Final](#paso-6-verificación-final)
8. [Solución de Problemas](#solución-de-problemas)

---

## 1. REQUISITOS PREVIOS

Antes de comenzar, asegúrate de tener:

- [x] Cuenta activa en Hostinger con un plan de hosting web
- [x] Dominio configurado (puede ser el subdominio gratuito de Hostinger)
- [x] Acceso al panel hPanel de Hostinger
- [x] Node.js instalado en tu PC (para compilar el proyecto)
- [x] Cliente FTP (FileZilla) o acceso al Administrador de Archivos de Hostinger

---

## PASO 1: CREAR LA BASE DE DATOS EN HOSTINGER

### 1.1. Accede a tu panel de Hostinger
1. Ve a [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu dominio/sitio web

### 1.2. Crea una nueva base de datos MySQL
1. En el menú lateral, busca **"Bases de datos"** → **"Bases de datos MySQL"**
2. Completa los campos:
   - **Nombre de la base de datos:** `impulso_db` (Hostinger añadirá un prefijo, ej: `u123456789_impulso_db`)
   - **Nombre de usuario:** `impulso_admin` (Hostinger añadirá el prefijo)
   - **Contraseña:** Genera una contraseña segura y **GUÁRDALA EN UN LUGAR SEGURO**
3. Haz clic en **"Crear"**

### 1.3. Anota tus credenciales
Guarda estos datos, los necesitarás después:
```
Servidor (Host): localhost
Nombre de la BD: u123456789_impulso_db
Usuario: u123456789_impulso_admin
Contraseña: [la contraseña que creaste]
```

---

## PASO 2: IMPORTAR LAS TABLAS EN PHPMYADMIN

### 2.1. Accede a phpMyAdmin
1. En el panel de Hostinger, ve a **"Bases de datos"** → **"phpMyAdmin"**
2. Haz clic en **"Ingresar a phpMyAdmin"** junto a tu base de datos

### 2.2. Importa el script SQL
1. En phpMyAdmin, selecciona tu base de datos en el panel izquierdo
2. Haz clic en la pestaña **"SQL"** (en la parte superior)
3. Abre el archivo `database/impulso_digital.sql` de este proyecto
4. Copia TODO el contenido del archivo
5. Pégalo en el área de texto de phpMyAdmin
6. Haz clic en **"Ejecutar"** (o "Go")

### 2.3. Verifica la importación
En el panel izquierdo deberías ver estas tablas:
- ✅ `company_settings`
- ✅ `users`
- ✅ `clients`
- ✅ `stores`
- ✅ `tickets`
- ✅ `ticket_photos`
- ✅ `materials_requests`
- ✅ `materials_request_items`
- ✅ `petty_cash`
- ✅ `fleet`
- ✅ `store_documents`

---

## PASO 3: CONFIGURAR LAS CREDENCIALES DE LA API

### 3.1. Edita el archivo de configuración
1. Abre el archivo `api/config.php` en un editor de texto
2. Modifica las siguientes líneas con tus datos reales:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_impulso_db');     // Tu nombre de BD real
define('DB_USER', 'u123456789_impulso_admin');  // Tu usuario real
define('DB_PASS', 'TuContraseñaSegura');        // Tu contraseña real

define('APP_URL', 'https://tudominio.com');     // Tu dominio real
define('API_URL', 'https://tudominio.com/api'); // Tu dominio + /api
```

3. Guarda el archivo

---

## PASO 4: COMPILAR EL PROYECTO REACT

### 4.1. Abre una terminal/consola en la carpeta del proyecto
```bash
cd "c:\Users\Agencia\.gemini\antigravity\scratch\GESTION TICKET MARCA BLANCA"
```

### 4.2. Instala las dependencias (si no lo has hecho)
```bash
npm install
```

### 4.3. Genera el build de producción
```bash
npm run build
```

Esto creará una carpeta `dist/` con los archivos optimizados para producción.

---

## PASO 5: SUBIR LOS ARCHIVOS A HOSTINGER

### Opción A: Usando el Administrador de Archivos de Hostinger

1. En hPanel, ve a **"Archivos"** → **"Administrador de archivos"**
2. Navega a la carpeta `public_html`
3. **IMPORTANTE:** Primero, respalda o elimina los archivos existentes si los hay
4. Sube los archivos de la siguiente manera:

**Estructura de archivos a subir:**
```
public_html/
├── api/                    ← Carpeta api/ completa
│   ├── config.php
│   ├── tickets.php
│   ├── users.php
│   ├── clients.php
│   ├── settings.php
│   ├── fleet.php
│   ├── materials.php
│   └── petty-cash.php
├── assets/                 ← Desde la carpeta dist/
├── index.html             ← Desde la carpeta dist/
└── [otros archivos de dist/]
```

### Opción B: Usando FileZilla (FTP)

1. Descarga e instala [FileZilla](https://filezilla-project.org/)
2. Obtén tus credenciales FTP desde Hostinger:
   - hPanel → **"Archivos"** → **"Cuentas FTP"**
3. Conecta con FileZilla:
   - **Host:** ftp.tudominio.com (o la IP que te da Hostinger)
   - **Usuario:** tu usuario FTP
   - **Contraseña:** tu contraseña FTP
   - **Puerto:** 21
4. Sube los archivos a `public_html/`

---

## PASO 6: VERIFICACIÓN FINAL

### 6.1. Prueba la API
Abre en tu navegador:
```
https://tudominio.com/api/settings.php
```
Deberías ver una respuesta JSON con la configuración de la empresa.

### 6.2. Prueba la aplicación
Abre en tu navegador:
```
https://tudominio.com
```
La aplicación debería cargar correctamente.

### 6.3. Credenciales de acceso inicial
- **Usuario:** alex@impulsodigital.com
- **Contraseña:** (deberás actualizar el hash en la base de datos o crear un nuevo usuario)

---

## SOLUCIÓN DE PROBLEMAS

### Error 500 en la API
- Verifica que las credenciales de la base de datos sean correctas
- Revisa que PHP tenga la extensión PDO habilitada (generalmente ya está en Hostinger)

### La página se ve en blanco
- Verifica que el archivo `index.html` esté en la raíz de `public_html/`
- Abre la consola del navegador (F12) para ver errores

### Las rutas no funcionan (Error 404)
- Crea un archivo `.htaccess` en `public_html/` con este contenido:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### CORS Error (bloqueo de API)
- Verifica que el archivo `api/config.php` tenga los headers CORS correctos
- Si usas un subdominio diferente para la API, ajusta `Access-Control-Allow-Origin`

---

## 📞 SOPORTE

Si encuentras algún problema durante el despliegue, revisa:
1. El archivo `INTERACTION_LOG.md` para contexto del proyecto
2. Los logs de error en Hostinger (hPanel → Avanzado → Logs de errores)

---

*Guía creada para Impulso Digital - Gestión Operativa Centralizada*
*Última actualización: 14/01/2026*
