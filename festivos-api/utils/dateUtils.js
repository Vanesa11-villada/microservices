/**
 * Esta función valida y extrae el año, el mes y el día de una cadena con el formato "YYYY/MM/DD".
 * Primero, divide la cadena utilizando el carácter '/' y verifica que se obtengan exactamente tres partes.
 * Luego, convierte cada parte a un número entero y valida que el mes esté dentro del rango 1 a 12 y que el día
 * se encuentre dentro del rango permitido para ese mes, considerando el año bisiesto en el caso de febrero.
 * Si todos los valores son válidos, la función retorna un objeto con las propiedades { year, month, day }.
 * En caso contrario, retorna null.
 *
 * @param {string} dateStr - La cadena que representa la fecha en formato "YYYY/MM/DD".
 * @returns {object|null} Un objeto con las propiedades year, month y day, o null si la fecha es inválida.
 */
function parseAndValidateDate(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) {
    return null;
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null;
  }

  if (month < 1 || month > 12) {
    return null;
  }

  let maxDays = 31;
  if (month === 2) {
    const isLeap = isLeapYear(year);
    maxDays = isLeap ? 29 : 28;
  } else if ([4, 6, 9, 11].includes(month)) {
    maxDays = 30;
  }

  if (day < 1 || day > maxDays) {
    return null;
  }

  return { year, month, day };
}

/**
 * Esta función determina si un año es bisiesto.
 * Un año es bisiesto si es divisible por 4 y no es divisible por 100, o si es divisible por 400.
 *
 * @param {number} year - El año a evaluar.
 * @returns {boolean} True si el año es bisiesto; de lo contrario, false.
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Esta función devuelve el día de la semana para una fecha dada.
 * Los días se representan con números: 0 para domingo, 1 para lunes, 2 para martes, y así sucesivamente.
 *
 * @param {number} year - El año de la fecha.
 * @param {number} month - El mes de la fecha (1-12).
 * @param {number} day - El día de la fecha.
 * @returns {number} Un número que representa el día de la semana (0=Domingo, 1=Lunes, etc.).
 */
function getDayOfWeek(year, month, day) {
  return new Date(year, month - 1, day).getDay();
}

/**
 * Esta función desplaza una fecha dada (especificada por año, mes y día) al siguiente lunes.
 * Si la fecha ya es un lunes, la función retorna la misma fecha.
 * El resultado se devuelve en un objeto con las propiedades { year, month, day }.
 *
 * @param {number} year - El año de la fecha.
 * @param {number} month - El mes de la fecha (1-12).
 * @param {number} day - El día de la fecha.
 * @returns {object} Un objeto que contiene el año, mes y día correspondientes al siguiente lunes.
 */
function shiftToNextMonday(year, month, day) {
  const tempDate = new Date(year, month - 1, day);
  while (tempDate.getDay() !== 1) {
    tempDate.setDate(tempDate.getDate() + 1);
  }
  return {
    year: tempDate.getFullYear(),
    month: tempDate.getMonth() + 1,
    day: tempDate.getDate()
  };
}

/**
 * Esta función calcula la fecha del Domingo de Pascua para un año determinado.
 * Utiliza la siguiente fórmula:
 *   a = año % 19
 *   b = año % 4
 *   c = año % 7
 *   d = (19 * a + 24) % 30
 *   e = (2 * b + 4 * c + 6 * d + 5) % 7
 * La suma de d y e indica la cantidad de días que se deben sumar al 15 de marzo, y se le suman 7 días adicionales
 * para obtener la fecha del Domingo de Pascua.
 * La función retorna la fecha en un objeto con las propiedades { year, month, day }.
 *
 * @param {number} year - El año para el cual se calculará el Domingo de Pascua.
 * @returns {object} Un objeto con la fecha del Domingo de Pascua.
 */
function getEasterSunday(year) {
  const a = year % 19;
  const b = year % 4;
  const c = year % 7;
  const d = (19 * a + 24) % 30;
  const e = (2 * b + 4 * c + 6 * d + 5) % 7;
  const daysAfterMarch15 = d + e;

  const easterDate = new Date(year, 2, 15 + daysAfterMarch15 + 7); // El mes de marzo se representa como 2 (base 0)
  return {
    year: easterDate.getFullYear(),
    month: easterDate.getMonth() + 1,
    day: easterDate.getDate()
  };
}

/**
 * Esta función genera una "pseudo base de datos" en memoria para los festivos que se calculan a partir de la fecha de Pascua.
 * Se calculan dos tipos de festivos:
 *   - Festivos de tipo 3: Festivos basados en Pascua que se toman en la fecha exacta (por ejemplo, Jueves Santo, Viernes Santo,
 *     Domingo de Ramos y Domingo de Pascua).
 *   - Festivos de tipo 4: Festivos que, además de calcularse a partir de Pascua con un offset, deben trasladarse al siguiente lunes
 *     si la fecha calculada no cae en lunes (por ejemplo, Ascensión del Señor, Corpus Christi y Sagrado Corazón de Jesús).
 * La función retorna un array de objetos. Cada objeto contiene el nombre del festivo y su fecha calculada para el año dado,
 * expresada en un objeto con { year, month, day }.
 *
 * @param {number} year - El año para el cual se generarán las fechas de los festivos basados en Pascua.
 * @returns {Array} Un arreglo de objetos, donde cada objeto representa un festivo con sus propiedades: name, year, month y day.
 */
function buildPascuaFestives(year) {
  const easter = getEasterSunday(year);

  // Se define un arreglo con los festivos relacionados con Pascua.
  // Cada objeto incluye:
  //   - name: el nombre del festivo.
  //   - offset: la cantidad de días a sumar o restar a la fecha del Domingo de Pascua.
  //   - checkMonday: un indicador que, si es true, significa que la fecha calculada debe ajustarse para caer en lunes.
  const pascuaFestivos = [
    { name: 'Domingo de Ramos', offset: -7, checkMonday: false },
    { name: 'Jueves Santo', offset: -3, checkMonday: false },
    { name: 'Viernes Santo', offset: -2, checkMonday: false },
    { name: 'Domingo de Pascua', offset: 0, checkMonday: false },
    { name: 'Ascensión del Señor', offset: 40, checkMonday: true },
    { name: 'Corpus Christi', offset: 61, checkMonday: true },
    { name: 'Sagrado Corazón de Jesús', offset: 68, checkMonday: true },
  ];

  const results = [];
  pascuaFestivos.forEach(fest => {
    const temp = new Date(easter.year, easter.month - 1, easter.day);
    temp.setDate(temp.getDate() + fest.offset);

    let yearF = temp.getFullYear();
    let monthF = temp.getMonth() + 1;
    let dayF = temp.getDate();

    // Si el festivo debe caer en lunes (checkMonday true) y la fecha calculada no es lunes,
    // se ajusta la fecha al siguiente lunes utilizando la función shiftToNextMonday.
    if (fest.checkMonday) {
      const dow = getDayOfWeek(yearF, monthF, dayF);
      if (dow !== 1) {
        const shifted = shiftToNextMonday(yearF, monthF, dayF);
        yearF = shifted.year;
        monthF = shifted.month;
        dayF = shifted.day;
      }
    }

    results.push({
      name: fest.name,
      year: yearF,
      month: monthF,
      day: dayF
    });
  });

  return results;
}

// Se exportan todas las funciones para que puedan ser utilizadas en otros módulos.
module.exports = {
  parseAndValidateDate,
  getDayOfWeek,
  shiftToNextMonday,
  getEasterSunday,
  buildPascuaFestives
};
