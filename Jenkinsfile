pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        // Clona tu repo (ajusta la URL si es necesario)
        git branch: 'main', url: 'https://github.com/Vanesa11-villada/microservices.git'
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        // Limpia contenedores antiguos
        bat 'docker rm -f express_festivos || echo "express_festivos no existía"'
        bat 'docker rm -f spring_calendario || echo "spring_calendario no existía"'
        bat 'docker compose down --remove-orphans -v || exit 0'

        // Reconstruye y levanta
        bat 'docker compose up -d --build --force-recreate'
      }
    }

    stage('Smoke Test') {
        steps {
            // 1) Espera 60 segundos para que Spring tenga tiempo de arrancar
            bat 'powershell -Command "Start-Sleep -Seconds 60"'

            // 2) Muestra los últimos logs de Spring para ver el arranque
            bat 'docker compose logs --tail 20 spring-service'

            // 3) Pruebas de humo
                // 3.1) Generar el calendario para 2025

                bat 'curl -f http://localhost:8090/api/calendario/generar/2025'

               // 3.2) Ahora sí listamos (debería devolver un 200 con el array)
                bat 'curl -f http://localhost:8090/api/calendario/listar/2025'
        }
    }

  }

  post {
    success {
      echo '✅ Despliegue completado con éxito'
    }
    failure {
      echo '❌ El pipeline falló. Revisa la consola de Jenkins.'
    }
  }
}
