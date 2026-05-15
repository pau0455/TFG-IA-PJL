# AITalk - Interfaz Web y Dashboard

**Proyecto TFG del ciclo ASIX2, por Pau Laguna, Joel Ortega y Liming Xin.**

Consiste en un sistema automatizado de atención al cliente para la hostelería basado en una arquitectura de Inteligencia Artificial agéntica. Este repositorio contiene el código fuente del portal web, la documentación técnica y el panel de control del proyecto.

## Descripción del Proyecto General

El núcleo del sistema no reside en esta web, sino en un orquestador **n8n** alojado en local. El flujo de trabajo principal hace lo siguiente:
1. Recibe mensajes de usuarios a través de un bot de **Telegram**.
2. Procesa texto e interpreta notas de voz utilizando el modelo **Gemini 3.1 Flash Lite**.
3. Deriva la lógica conversacional al modelo **Devstral latest**, que actúa con un *system prompt* estricto de recepcionista.
4. El agente tiene acceso a herramientas para realizar consultas y escrituras en una base de datos **PostgreSQL**, para ver inventario de menús, alérgenos, aforo y en **Google Calendar**.

## Función de esta Página Web

Los archivos de este repositorio conforman la interfaz gráfica orientada a la presentación y administración del proyecto:

* **Documentación Técnica (`docs.html`):** Detalla la arquitectura de nodos, los modelos LLM elegidos, el diseño de la base de datos y la justificación de las tecnologías.
* **Simulación / Mockups (`manolo.html`):** Entornos de prueba para demostrar cómo se integraría el chatbot en un entorno real.
* **Dashboard de Desarrollo (`dashboard-dev.html`, `reservas.php`, `login-dev`):** Un panel de control privado que se conecta directamente a la base de datos PostgreSQL. Utiliza PHP para extraer las reservas y Javascript para actualizar la tabla en tiempo real con Short Polling sin recargar la página.

## Stack Tecnológico

* **Frontend:** HTML5, CSS3, JavaScript.
* **Backend:** PHP 8+
* **Base de datos:** PostgreSQL 14+

## Despliegue Local de la Web


Esta guía detalla el paso a paso para desplegar la interfaz web en un entorno de pruebas.

### 1. Instalación de Dependencias y Servicios
Actualiza los repositorios e instala php-cli, y la extensión de PostgreSQL para PHP:

```bash
sudo apt update
sudo apt install nginx php-fpm php-pgsql git -y
```

### 2. Clona el repositorio

```bash
git clone https://github.com/pau0455/TFG-IA-PJL
cd aitalk-web
```

### 3. Configurar la Base de Datos

Edita el archivo reservas.php y ajusta las variables de conexión con los datos de tu servidor PostgreSQL:

```PHP
$host = '192.168.x.x'; // IP de tu BBDD
$db   = 'restaurante';
$user = 'postgres';
$pass = 'tu_contraseña';
```

### 4. Levantar el servidor web

En la carpeta raiz de la web ejecuta el siguente comando en la consola:

```bash
php -S localhost:8000
```
### 5. Buscar localhost en el navegador

Abre tu navegador web y accede a la siguiente dirección para visualizar la interfaz del proyecto en local:

```text
http://localhost:8000
```

Si todo está configurado correctamente, podrás acceder a:

* `index.html` → Página principal del proyecto.
* `docs.html` → Documentación técnica y arquitectura.
* `manolo.html` → Simulación del chatbot.
* `dashboard-dev.html` → Panel de control de reservas y monitorización.

> **Nota:** Se debe asegurar que el servidor PHP siga ejecutándose en la terminal mientras utilizas la web.
