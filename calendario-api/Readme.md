
# Documentación de la API “Calendario Festivo”

Este proyecto consta de dos servicios:

1. **API Node.js (Express + MongoDB)**  
   Expone un endpoint para consultar si un día dado es festivo en Colombia.

2. **API Spring Boot (Java + MySQL)**  
   Consume la API de Express, genera y almacena un calendario completo (clasificado) y permite consultar:
   - Generación del calendario
   - Listado completo
   - Listado solo de festivos

## Índice

1. [Requisitos Previos](#requisitos-previos)  
2. [Inicialización de la API Express](#inicialización-de-la-api-express)  
3. [Inicialización de la API Spring Boot](#inicialización-de-la-api-spring-boot)  
4. [Endpoints de Spring Boot](#endpoints-de-spring-boot)  
5. [Flujo de Uso](#flujo-de-uso)  

## Requisitos Previos

- **Node.js** y **npm**  
- **MongoDB** (local o Docker)  
- **Java 17+**, **Maven**  
- **MySQL Server** (local o Docker)  

---

## Inicialización de la API Express

1. En la carpeta `api-festivos/`, abrir terminal e instalar dependencias:
   npm install

2. Asegurarse de que MongoDB esté corriendo, ingresar en la terminal:
   mongod

3. Poblar la colección `Holiday`:
   npm run seed.js

4. (Opcional) Verificar datos:
   node utils/printDB.js

5. Iniciar el servidor:
   npm start

6. Probar endpoint:
   GET http://localhost:3000/api/holidays?date=2025/01/01

---

## Inicialización de la API Spring Boot

1. Crear base de datos MySQL:
   CREATE DATABASE calendario_festivo;

2. Clonar o importar el proyecto Maven `festivo-api/`.
3. Configurar `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/calendario_festivo
   spring.datasource.username=root
   spring.datasource.password=TU_PASSWORD
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   server.port=8080
   ```
4. Ejecutar:

   mvn spring-boot:run

o iniciarlizar desde la IDE que se este usando

---

## Endpoints de Spring Boot

| Método | Ruta                                 | Descripción                                                                 |
|--------|--------------------------------------|------------------------------------------------------------------------------|
| GET    | `/api/calendario/generar/{anio}`     | Genera y guarda en MySQL el calendario completo del año.                    |
| GET    | `/api/calendario/listar/{anio}`      | Lista todos los días del calendario (laborales, fines de semana, festivos). |
| GET    | `/api/calendario/obtener/{anio}`     | Lista únicamente los días marcados como festivos (con descripción).         |

---

## Flujo de Uso

1. **Levantar MongoDB** (`mongod`)  
2. **Arrancar API Express** (`npm start`)  
3. **Verificar Express** con `GET /api/holidays?date=YYYY/MM/DD`  
4. **Levantar MySQL** (XAMPP o Docker)  
5. **Arrancar API Spring Boot** (`mvn spring-boot:run`)  
6. **Generar Calendario**  
   GET http://localhost:8080/api/calendario/generar/2025
   - Devuelve `true` si se creó correctamente.  

7. **Listar Todo el Calendario**  
   GET http://localhost:8080/api/calendario/listar/2025

8. **Listar Solo Festivos**  
   GET http://localhost:8080/api/calendario/obtener/2025

---
