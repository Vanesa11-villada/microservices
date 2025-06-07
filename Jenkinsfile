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
            // 1) Dale tiempo sólido a que Spring levante (60s)
            bat 'powershell -Command "Start-Sleep -Seconds 60"'

            // 2) Verifica qué contenedores están arriba y sus puertos
            bat 'docker compose ps'

            // 3) Muestra los últimos 20 logs de Spring para confirmar que arrancó
            bat 'docker compose logs --tail 20 spring-service'

            // 4) Smoke test de Express (éste ya sabíamos que funciona)
            bat 'curl -f http://localhost:3001/api/holidays?date=2025/06/07'

            // 5) Ahora sí llama a generar y luego a listar en Spring
            bat 'curl -f http://localhost:8090/api/calendario/generar/2025'
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
