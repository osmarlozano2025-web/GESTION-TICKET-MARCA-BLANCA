# 🚀 Impulso Digital - Gestión Operativa Centralizada

Este proyecto es una plataforma de gestión técnica y operativa de "Marca Blanca" diseñada para el control total de tickets, materiales, flota y finanzas.

## 📊 Estado del Proyecto: ¿Está completo?
El proyecto está **100% completo en su capa de interfaz de usuario (Frontend)**. Todas las vistas, flujos de pasos (Step 1-6), dashboards y lógica de navegación están operativas y personalizadas para **Impulso Digital**.

Sin embargo, para que sea un producto de producción funcional en **Hostinger**, requiere una **Capa de Datos (Backend)**. Actualmente, los datos son simulados (Mocks). 

---

## 🗄️ Arquitectura de Base de Datos (MySQL)

Para que el sistema sea funcional y persistente, usaremos **una (1) base de datos** en Hostinger (MySQL), accesible vía **phpMyAdmin**. Dentro de esta base de datos, crearemos las siguientes tablas:

### Tablas Requeridas:
1.  **`company_settings`**: Almacena el nombre, eslogan, logo y color de la marca (Marca Blanca).
2.  **`users`**: Gestión de accesos, roles (Admin, Técnico) y permisos.
3.  **`clients`**: Información de clientes y empresas.
4.  **`stores`**: Sucursales o puntos de servicio vinculados a clientes.
5.  **`tickets`**: El núcleo del sistema. Almacena estado, prioridad, técnico asignado y datos de cada fase.
6.  **`materials_requests`**: Requerimientos de insumos vinculados a tickets.
7.  **`petty_cash`**: Registro de gastos y caja chica por ticket.
8.  **`fleet`**: Control de vehículos, KM y alertas de servicio.

---

## 🛠️ Roadmap para el Despliegue en Hostinger

Para que la aplicación funcione en tu hosting, debemos seguir este plan:

### 1. Preparación del Backend (PHP API)
Hostinger utiliza mayoritariamente PHP. Necesitamos crear una carpeta `api/` en el servidor que contenga los scripts necesarios para:
*   Conectarse a MySQL.
*   Recibir y enviar datos en formato JSON desde el React Frontend.

### 2. Configuración en Hostinger
1.  **Crear Base de Datos MySQL**: Desde el panel de Hostinger (hPanel).
2.  **Importar Estructura**: Crear las tablas mencionadas mediante phpMyAdmin (te proporcionaré el script SQL necesario).
3.  **Subir el Build**: Ejecutar `npm run build` localmente y subir el contenido de la carpeta `dist/` a la carpeta `public_html/` de tu sitio.

### 3. Preguntas Frecuentes (FAQ)
*   **¿Necesito instalar phpMyAdmin en mi PC?** 
    No es obligatorio. Puedes usar el que trae Hostinger directamente. Sin embargo, instalar **XAMPP** o **Laragon** en tu ordenador es recomendable si quieres probar el backend localmente antes de subirlo.
*   **¿Cuántas bases de datos?** 
    Solo **una**. Una estructura bien diseñada organiza todo en tablas dentro de una sola base de datos.
*   **¿Está listo para subir?** 
    Como "Demo Visual" o "Mockup Funcional", **sí**. Como sistema de gestión de datos reales, **falta el puente (PHP)** entre el diseño y la base de datos.

---

## 🚀 Comandos Rápidos
```bash
# Iniciar desarrollo
npm run dev

# Generar versión para producción (Hostinger)
npm run build
```

---
*Desarrollado con ❤️ para Impulso Digital - Estrategia Operativa.*
