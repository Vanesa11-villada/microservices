// Importamos el módulo express, que nos permite crear y configurar un servidor web.
const express = require('express');

// Creamos un router, que es un objeto que permite definir rutas de manera modular.
const router = express.Router();

// Importamos la función "checkHoliday" del controlador de festivos, la cual contiene la lógica para validar la fecha.
const { checkHoliday } = require('../controllers/holidayController');

// Definimos un endpoint para validar la fecha festiva.
// Este endpoint responde a solicitudes GET en la ruta raíz del router.
// Ejemplo de uso: GET /api/holidays?date=2023/06/12
router.get('/', checkHoliday);

// Exportamos el router para que pueda ser utilizado en otros archivos, por ejemplo, en app.js para montar la ruta.
module.exports = router;
