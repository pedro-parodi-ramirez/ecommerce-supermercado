# Ecommerce Supermercado
Este proyecto implementa el backend y frontend de un sitio web de un supermercado mediante una interfaz API REST. Cuenta un sistema de log-in y registro de usuarios, gestión de productos, carrito de compras y órdenes de compra. Usuarios con permisos de administrador podrán modificar, eliminar o agregar productos. El sistema implementa un servicio email que envía un correo al administrador (a una dirección configurable) cada vez que se da de alta un nuevo usuario o se confirma un carrito de compras, con el detalle del mismo.

Adicionalmente, el sitio incorpora un canal de chat online haciendo uso de SocketIO. Permite chatear en tiempo real con el Servicio de Asistencia al Consumidor del sitio web. Para ello, es necesario que al sitio web esté logueado (además del usuario), el administrador. El administrador será el encargado de responder mensajes específicos a cada usuario, dirigiendo los mensajes en base al email del usuario (ver credenciales de administrador más abajo).

## Ejecutar servidor
Luego de las configuraciones correspondientes (ver más abajo), situarse en la raíz del proyecto desde una terminal o PowerShell y ejecutar:
```
npm start
```
Luego ingresar a la siguiente ruta para probar las funcionalidades de la app:
```
localhost:8080
```

La funcionalidad del servidor puede ser probada mediante un frontend maquetado con Bootstrap, ingresando a la ruta `localhost:8080` en un navegador. Esta app realiza CRUDs para las distintas funcionalidades requeridas del sitio.
El servidor genera mensajes en consola con cada solicitud recibida para control del funcionamiento, permitiendo una trazabilidad de los eventos. Logs importantes son almacenados en archivos en `directorio_raiz/backend/logs/`.

La persitencia de datos es en memoria por default y existe la posibilidad de persistencia en MongoDB, utilizando una base de datos ya creada.

### Usuarios creados por default

```
1. USUARIO ADMINISTRADOR
email: admin@gmail.com
pass: admin

2. USUARIO ALEATORIO
email: marcosa@gmail.com
pass: marcosa
```

## Imágenes de referencia
<table style="text-align:center">
    <tr>
        <img src="./frontend/public/image/main-page.png" alt="message-user">
    </tr>
    <tr>
        <td><img src="./frontend/public/image/shop-chart.png" alt="message-user"></td>
        <td><img src="./frontend/public/image/message-user.png" alt="message-user"></td>
    </tr>
</table>

## Inicializar DB
### Persistencia: `Memoria`
La app se ejecuta automáticamente con valores iniciales, no requiere configuración.

### Persistencia: `Mongo Atlas`
En el caso de utiliar Mongo Atlas como persistencia, se cuenta la opción de inicializar la DB con 10 productos y ningún carrito de compras ni órdenes creadas. También se crean dos usuarios, uno con permisos de administrador y otro aleatorio.

Situarse en la raíz del proyecto y ejecutar:
```
npm run initdb
```

*Nota: la base de datos en Mongo DB de momento se encuentra fuera de servicio por inactividad. Comunicarse con el creador de este proyecto en caso de precisarla.*

## Configuración
Es necesario correr la aplicación en Windows y tener previamente instalado **Node.js** y el instalador de paquetes **npm**.

1. Crear un archivo en la raíz del proyecto, con el nombre `.env` y el siguiente contenido:
```
PERSISTANCE='memory'
PORT=8080
MONGODB_URI='mongodb+srv://developer:x6JYg18ip3N7gsky@coderhouse.wm4ogqy.mongodb.net/ecommerce'
NODEMAILER_PASS='exrkfzjrwjunkbgf'
SESSION_TIMEOUT='300000'
ADMIN_EMAIL='<choose>'
```
Modificar contenido a elección:
* PERSISTANCE: persistencia de datos elegida. Valores posibles 'mongodb' o 'memory'.
* PORT: puerto de esucha en el servidor.
* SESSION_TIMEOUT: tiempo para sesión de usuario activa en milisegundos. Default: 5 minutos.
* ADMIN_EMAIL: reemplazar <choose> según el correo a donde se quiera recibir una notificación al momento de darse de alta un nuevo usuario y/o confirmarse una compra.
2. Instalar las dependencias
```
npm install
```
## Notas
---
1. El administrador puede elegir a que usuario enviarle un mensajes, ingresando el correo del mismo en el campo correspondiente. El usuario siempre enviará mensajes al administrador, dirigido con el correo `admin@gmail.com`. Se logra enviar mensajes dirigidos a usuarios específicos dado que cada socketID se corresponde a un email.
2. El chat en línea se encuentra activo en todo momento haciendo uso de socket.io. Sin embargo, el administrador debe estar logueado al momento de que el usuario envíe un mensaje. Caso contrario, nunca lo recibirá.

## Herramientas de trabajo
---
#### IDE
* Visual Studio Code
* Postman

### Frameworks y tecnologías
* NodeJS
* Express
* Dotenv
* SocketIO
* Mongo Atlas
* Mongoose
* Nodemailer
* Passport
* Bcrypt
* Winston
* Uuid
* Bootstrap
