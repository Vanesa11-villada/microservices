// Importamos mongoose para gestionar la conexión y operaciones con MongoDB.
const mongoose = require('mongoose');

// Define el esquema para el modelo "Holiday" con los siguientes campos:
// - day: Número obligatorio que representa el día del festivo.
// - month: Número obligatorio que representa el mes del festivo.
// - name: Cadena obligatoria con el nombre del festivo.
// - type: Número obligatorio que indica el tipo de festivo.
// - offset: Número opcional (valor por defecto 0) usado en cálculos de fechas.
const HolidaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  month: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: Number, required: true },
  offset: { type: Number, default: 0 }
});

// Creamos y exportamos el modelo "Holiday" basado en el esquema definido.
module.exports = mongoose.model('Holiday', HolidaySchema);
