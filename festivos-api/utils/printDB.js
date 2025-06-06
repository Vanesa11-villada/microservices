// Importa el módulo mongoose para trabajar con MongoDB.
const mongoose = require('mongoose');
// Importa la función de conexión a la base de datos definida en ./config/db.
const connectDB = require('../config/db');
// Importa el modelo Holiday, que define la estructura de los documentos en la colección "Holiday".
const Holiday = require('../models/Holiday');

/**
 * La función printDatabase se encarga de conectarse a la base de datos, recuperar todos los
 * documentos almacenados en la colección "Holiday" y mostrarlos en consola. Esta función
 * se utiliza para validar que la base de datos se encuentre poblada correctamente con los festivos.
 */
async function printDatabase() {
  try {
    // Conecta a la base de datos utilizando la función connectDB.
    await connectDB();

    // Ejecuta una consulta para obtener todos los documentos de la colección "Holiday".
    const holidays = await Holiday.find({});

    // Muestra un mensaje en consola indicando que se están listando los festivos.
    console.log("Festivos en la base de datos:");
    // Imprime el arreglo de documentos obtenidos, lo que permite verificar que la base de datos está llena.
    console.log(holidays);

    // Cierra la conexión a MongoDB para liberar recursos.
    mongoose.connection.close();
  } catch (error) {
    // En caso de producirse un error durante la conexión o la consulta, se muestra el mensaje de error en consola.
    console.error("Error al obtener la base de datos:", error);
  }
}

// Ejecuta la función printDatabase para validar el contenido de la base de datos.
printDatabase();
