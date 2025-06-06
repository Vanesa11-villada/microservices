// Importamos el módulo Express para crear el servidor web
const express = require('express');
// Importamos body-parser para parsear los cuerpos de las peticiones JSON
const bodyParser = require('body-parser');
// Importamos la función de conexión a MongoDB definida en ./config/db
const connectDB = require('./config/db');

// Creamos una instancia de la aplicación Express
const app = express();

// Conectamos a la base de datos MongoDB utilizando la función connectDB
connectDB();

// Configuramos el middleware body-parser para que convierta los cuerpos de las peticiones en formato JSON
app.use(bodyParser.json());

// Definimos las rutas de la API:
// Aquí, se monta el router definido en ./routes/holidays en la ruta base '/api/holidays'.
// Esto significa que todas las rutas definidas en ese archivo estarán disponibles a partir de '/api/holidays'
app.use('/api/holidays', require('./routes/holidays'));

// Definimos una ruta raíz de prueba (GET /) que responde con un mensaje sencillo
app.get('/', (req, res) => {
  res.send('API de Festivos en Express y MongoDB');
});

// Definimos el puerto en el que el servidor escuchará, utilizando la variable de entorno PORT o 3000 por defecto
const PORT = process.env.PORT || 3000;
// Iniciamos el servidor y mostramos en la consola un mensaje indicando el puerto en el que se está ejecutando
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
