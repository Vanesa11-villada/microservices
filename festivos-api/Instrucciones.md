
# Guía de Inicialización y Ejecución del Proyecto "API Festivos"

Esta guía explica paso a paso cómo configurar, poblar y levantar el servicio de la API de festivos, utilizando Node.js, Express y MongoDB. Está diseñada para que cualquier persona, incluso sin experiencia previa, pueda levantar el servicio y validar su funcionamiento.

---

## 1. Estructura de Carpetas del Proyecto

La estructura del proyecto es la siguiente:

```
api-festivos/
├── config/
│   └── db.js          // Configuración y conexión a MongoDB.
├── controllers/
│   └── holidayController.js  // Lógica para validar fechas y verificar festivos.
├── models/
│   └── Holiday.js     // Esquema Mongoose para la colección de festivos.
├── routes/
│   └── holidays.js    // Definición de los endpoints de la API (ej. /api/holidays).
├── utils/
│   └── dateUtils.js   // Funciones auxiliares para validación y cálculo de fechas.
│   └── printDB.js     // Script para imprimir el contenido de la base de datos (validación).
└── app.js             // Archivo principal que inicia el servidor Express.
```

- **config/db.js:**  
  Contiene la configuración para conectarse a la base de datos MongoDB.

- **controllers/holidayController.js:**  
  Implementa la lógica de negocio para determinar si una fecha es festiva.

- **models/Holiday.js:**  
  Define la estructura (esquema) de los documentos de festivos en MongoDB mediante Mongoose.

- **routes/holidays.js:**  
  Define las rutas y endpoints para exponer la API de festivos.

- **utils/dateUtils.js:**  
  Incluye funciones para validar fechas, calcular el día de la semana, ajustar fechas y calcular festivos basados en Pascua.

- **utils/printDB.js:**  
  Script utilizado para imprimir los datos de la base de datos y verificar que se hayan insertado correctamente.

- **app.js:**  
  Archivo de entrada que configura y levanta el servidor Express, montando las rutas correspondientes.

---

## 2. Pasos para Inicializar y Levantar el Servicio

### 2.1 Activar MongoDB

1. **Iniciar el servidor de MongoDB:**

   Abre una terminal y ejecuta:
   ```
   mongod
   ```
   Esto iniciará el proceso del servidor de MongoDB.

2. **Verificar la conexión con MongoDB:**

   Abre otra terminal y ejecuta:
   ```
   mongosh
   ```
   Esto abrirá la consola interactiva de MongoDB, donde podrás ejecutar comandos para verificar el estado de la base de datos.

### 2.2 Poblar la Base de Datos

1. **Ejecutar el script seed.js:**

   Asegúrate de que el servidor de MongoDB esté en ejecución (con `mongod` activo). Luego, desde la raíz del proyecto, ejecuta:
   ```
   node scripts/seed.js
   ```
   Este script se conecta a MongoDB, limpia la colección "Holiday" y añade los registros de festivos definidos.

### 2.3 Validar la Inserción de Datos

1. **Ejecutar el script printDB.js:**

   Para confirmar que los datos se hayan insertado correctamente, ejecuta:
   ```
   node utils/printDB.js
   ```
   Este script se conectará a la base de datos, obtendrá todos los documentos de la colección "Holiday" e imprimirá el listado en la consola.

### 2.4 Correr el Servidor de la API

1. **Iniciar la aplicación principal:**

   Desde la raíz del proyecto, ejecuta:
   ```
   node app.js
   ```
   Esto levantará el servidor Express en el puerto 3000 (o en el puerto definido en la variable de entorno `PORT`). Verás un mensaje en la consola indicando que el servidor se ha iniciado, por ejemplo:
   ```
   Servidor iniciado en el puerto 3000
   ```

### 2.5 Validar el Funcionamiento de la API

1. **Realizar una prueba con el navegador o Postman:**

   Abre un navegador web o una herramienta como Postman y accede a la siguiente URL:
   ```
   http://localhost:3000/api/holidays?date=2023/06/12
   ```
   Esto enviará una petición GET al endpoint `/api/holidays` con el parámetro `date` en formato "YYYY/MM/DD". La API responderá con un mensaje en formato JSON indicando si la fecha es festiva, por ejemplo:
   ```
   { "message": "Es Festivo" }
   ```
   o
   ```
   { "message": "No es Festivo" }
   ```

---

## 3. Recursos Adicionales

- **Documentación de Node.js:**  
  [Node.js Documentation](https://nodejs.org/en/docs/)

- **Documentación de MongoDB:**  
  [MongoDB Manual](https://docs.mongodb.com/)

- **Documentación de Mongoose:**  
  [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)

- **Guía de Express.js:**  
  [Express.js Guide](https://expressjs.com/en/starter/installing.html)

Estos recursos adicionales pueden ser útiles para ampliar conocimientos sobre los componentes utilizados en el proyecto.
