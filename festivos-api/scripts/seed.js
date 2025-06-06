// Importamos el módulo mongoose para trabajar con MongoDB
const mongoose = require('mongoose');
// Importamos el modelo Holiday que define el esquema de los festivos
const Holiday = require('../models/Holiday');
// Importamos la función para conectar a la base de datos desde config/db.js
const connectDB = require('../config/db');

// Definimos una función asíncrona que se encargará de insertar los festivos en la base de datos
const seedFestivos = async () => {
  // Nos conectamos a la base de datos usando la función importada
  await connectDB();

  // Limpia la colección "holidays": elimina todos los documentos existentes
  await Holiday.deleteMany({});

  // Definimos un array con los festivos a insertar en la base de datos
  // Se agrupan en dos bloques:
  // 1. Festivos fijos (Tipo 1) y festivos con "Ley de puente" (Tipo 2)
  // 2. Festivos basados en Pascua (Tipo 3 y 4), donde day y month se asignan como 0 (o null) ya que se calcularán dinámicamente
  const festivos = [
    // Tipo 1: Festivos fijos (la fecha es la indicada)
    { day: 1, month: 1, name: 'Año nuevo', type: 1 },
    { day: 1, month: 5, name: 'Día del Trabajo', type: 1 },
    { day: 20, month: 7, name: 'Independencia Colombia', type: 1 },
    { day: 7, month: 8, name: 'Batalla de Boyacá', type: 1 },
    { day: 8, month: 12, name: 'Inmaculada Concepción', type: 1 },
    { day: 25, month: 12, name: 'Navidad', type: 1 },
    // Tipo 2: Festivos con "Ley de puente" (la fecha base se traslada al siguiente lunes si no es lunes)
    { day: 6, month: 1, name: 'Santos Reyes', type: 2 },
    { day: 19, month: 3, name: 'San José', type: 2 },
    { day: 29, month: 6, name: 'San Pedro y San Pablo', type: 2 },
    { day: 15, month: 8, name: 'Asunción de la Virgen', type: 2 },
    { day: 12, month: 10, name: 'Día de la Raza', type: 2 },
    { day: 1, month: 11, name: 'Todos los santos', type: 2 },
    { day: 11, month: 11, name: 'Independencia de Cartagena', type: 2 },
    // Festivos basados en Pascua (Tipo 3 y Tipo 4)
    // Se asignan day y month como 0 porque se calcularán dinámicamente
    { day: 0, month: 0, name: 'Jueves Santo', type: 3, offset: -3 },
    { day: 0, month: 0, name: 'Viernes Santo', type: 3, offset: -2 },
    { day: 0, month: 0, name: 'Domingo de Pascua', type: 3, offset: 0 },
    { day: 0, month: 0, name: 'Ascensión del Señor', type: 4, offset: 40 },
    { day: 0, month: 0, name: 'Corpus Christi', type: 4, offset: 61 },
    { day: 0, month: 0, name: 'Sagrado Corazón de Jesús', type: 4, offset: 68 },
  ];

  try {
    // Inserta el array de festivos en la colección "holidays"
    await Holiday.insertMany(festivos);
    console.log('Festivos insertados correctamente');
    // Termina el proceso de Node.js con código 0 (éxito)
    process.exit(0);
  } catch (error) {
    // Si ocurre algún error durante la inserción, se imprime en consola y se termina el proceso con código 1 (error)
    console.error('Error al insertar los festivos:', error);
    process.exit(1);
  }
};

// Ejecuta la función seedFestivos para poblar la base de datos
seedFestivos();
