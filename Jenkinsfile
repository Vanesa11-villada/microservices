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
        bat 'docker compose down --remove-orphans || exit 0'

        // Reconstruye y levanta
        bat 'docker compose up -d --build --force-recreate'
      }
    }

stage('Smoke Test') {
    steps {
            // 1) Esperar a que el health status sea healthy (timeout 60s)
            bat '''
            for /L %%i in (1,1,12) do (
                docker compose ps --services --filter "health=healthy" | findstr spring-service && exit /b 0
                timeout /t 5 >nul
            )
            echo "ERROR: spring-service no alcanzó estado healthy en tiempo" 
            exit /b 1
            '''

            // 2) Mostrar últimos logs
            bat 'docker compose logs --tail 20 spring-service'

            // 3) Pruebas de humo
            bat 'curl -f http://localhost:3001/api/holidays?date=2025/06/07'
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
