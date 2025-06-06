const Holiday = require('../models/Holiday');
const {
  parseAndValidateDate,
  getDayOfWeek,
  shiftToNextMonday,
  buildPascuaFestives
} = require('../utils/dateUtils');

/**
 * Controlador para verificar si la fecha ingresada es festiva.
 *
 * Parámetros:
 *  - req: Objeto de solicitud que debe incluir en su query el parámetro "date" con el formato "YYYY/MM/DD".
 *  - res: Objeto de respuesta que se utiliza para enviar la respuesta en formato JSON.
 *
 * Funcionamiento:
 * 1. Se valida y parsea la fecha usando la función parseAndValidateDate, que convierte una cadena "YYYY/MM/DD" en un objeto
 *    con las propiedades { year, month, day } si la fecha es válida. En caso contrario, retorna null.
 *    Si la fecha es inválida, el controlador responde con un error HTTP 400 y un mensaje descriptivo.
 *
 * 2. Se consulta la base de datos para obtener festivos que tengan tipo 1 o 2.
 *    - Para festivos de Tipo 1 (fijos): Se compara directamente el día y el mes del documento con la fecha ingresada.
 *    - Para festivos de Tipo 2 (Ley de puente): Se utiliza la función shiftToNextMonday para calcular la fecha efectiva.
 *      Esta función desplaza la fecha base al siguiente lunes si la fecha no es lunes. Se compara la fecha resultante
 *      con la fecha ingresada.
 *    Si se encuentra una coincidencia en alguno de estos casos, se retorna inmediatamente una respuesta JSON con { message: "Es Festivo" }.
 *
 * 3. Si no se encuentra coincidencia en la base de datos (festivos de tipo 1 o 2), se calculan los festivos basados en Pascua (tipo 3 y 4)
 *    mediante la función buildPascuaFestives. Esta función genera un arreglo de objetos en memoria, donde cada objeto representa un
 *    festivo relacionado con Pascua y contiene las propiedades name, year, month y day.
 *    Se recorre este arreglo y se verifica si alguno de los festivos calculados coincide con la fecha ingresada.
 *    Si se encuentra una coincidencia, se retorna { message: "Es Festivo" }; de lo contrario, se retorna { message: "No es Festivo" }.
 *
 * 4. Si ocurre algún error durante la consulta a la base de datos o en el cálculo, se captura el error y se responde con un error HTTP 500,
 *    incluyendo el mensaje de error.
 *
 * Retorno:
 *  - Un objeto JSON que indica "Es Festivo" si la fecha coincide con algún festivo,
 *    "No es Festivo" si no coincide, o un error HTTP 400/500 en caso de formato inválido o error en el proceso.
 */
exports.checkHoliday = async (req, res) => {
  // Se extrae el parámetro "date" de la query de la solicitud.
  const { date: dateStr } = req.query;

  // Paso 1: Validar y parsear la fecha.
  // Se utiliza parseAndValidateDate para convertir la cadena "YYYY/MM/DD" en un objeto { year, month, day }.
  // Si la fecha es inválida, parseAndValidateDate retorna null.
  const parsedDate = parseAndValidateDate(dateStr);
  if (!parsedDate) {
    // Si el formato o los valores de la fecha son incorrectos, se responde con un error HTTP 400.
    return res.status(400).json({
      message: "Formato de fecha no válido o valores incorrectos"
    });
  }
  // Se desestructura el objeto resultante para obtener year, month y day.
  const { year, month, day } = parsedDate;

  try {
    // Paso 2: Consultar la base de datos para obtener festivos de tipo 1 y 2.
    // Se realiza una búsqueda en la colección "Holiday" para obtener documentos cuyo campo "type" sea 1 o 2.
    const holidays12 = await Holiday.find({
      type: { $in: [1, 2] }
    });

    // Se itera sobre cada festivo obtenido de la base de datos.
    for (const fest of holidays12) {
      if (fest.type === 1) {
        // Para un festivo de Tipo 1 (fijo), se compara directamente el día y el mes del documento con los de la fecha ingresada.
        if (fest.day === day && fest.month === month) {
          // Si hay coincidencia, se retorna una respuesta JSON indicando que la fecha es festiva.
          return res.json({ message: "Es Festivo" });
        }
      } else if (fest.type === 2) {
        // Para un festivo de Tipo 2 (Ley de puente), se calcula la fecha efectiva.
        // La función shiftToNextMonday recibe el año de la fecha ingresada y los valores de day y month del festivo,
        // retornando un objeto { year, month, day } que representa la fecha del festivo desplazada al siguiente lunes si es necesario.
        const effectiveDate = shiftToNextMonday(year, fest.month, fest.day);
        // Se compara la fecha efectiva con la fecha ingresada.
        if (
          effectiveDate.year === year &&
          effectiveDate.month === month &&
          effectiveDate.day === day
        ) {
          // Si la fecha efectiva coincide con la fecha ingresada, se retorna "Es Festivo".
          return res.json({ message: "Es Festivo" });
        }
      }
    }

    // Paso 3: Si no se encontró coincidencia en festivos de tipo 1 o 2,
    // se procede a calcular los festivos basados en Pascua (tipo 3 y 4).
    // Se llama a buildPascuaFestives, que genera una lista en memoria de festivos asociados a la Pascua para el año indicado.
    const pascuaFestives = buildPascuaFestives(year);
    // Se recorre el arreglo de festivos calculados y se verifica si alguno coincide con la fecha ingresada.
    const found = pascuaFestives.some(f => 
      f.year === year && f.month === month && f.day === day
    );

    // Si se encontró alguna coincidencia en los festivos de Pascua, se retorna "Es Festivo".
    if (found) {
      return res.json({ message: "Es Festivo" });
    } else {
      // Si no hay coincidencias, se retorna "No es Festivo".
      return res.json({ message: "No es Festivo" });
    }

  } catch (error) {
    // Paso 4: Si ocurre un error durante la consulta a la base de datos o en el cálculo de festivos,
    // se captura el error y se retorna un error HTTP 500 junto con un mensaje descriptivo.
    return res.status(500).json({
      message: "Error al consultar/calcular festivos",
      error: error.message
    });
  }
};
