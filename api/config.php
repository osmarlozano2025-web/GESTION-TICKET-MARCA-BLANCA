<?php
// api/config.php

// Cargar variables de entorno de forma segura
// En un entorno de producción, estas variables se configurarían en el servidor.
// Para el desarrollo local, puedes usar un archivo .env con una librería como vlucas/phpdotenv.

// Usamos getenv para leer las variables de entorno.
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_user = getenv('DB_USER') ?: 'root'; // Usuario por defecto para entornos locales
$db_pass = getenv('DB_PASS') ?: '';     // Contraseña por defecto para entornos locales
$db_name = getenv('DB_NAME') ?: 'impulso_digital'; // Nombre de la BD por defecto

// Definir las constantes que usará db.php
define('DB_HOST', $db_host);
define('DB_USER', $db_user);
define('DB_PASS', $db_pass);
define('DB_NAME', $db_name);

?>
