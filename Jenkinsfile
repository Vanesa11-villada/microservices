pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        // Clona tu repo; si es privado, configura credentialsId en Jenkins
        git branch: 'main',
            url: 'https://github.com/Vanesa11-villada/microservices',
            
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        // Detenemos cualquier stack anterior
        bat 'docker compose down || exit 0'
        // Reconstruimos y levantamos
        bat 'docker compose up -d --build'
      }
    }

    stage('Smoke Test') {
      steps {
        // Verificamos rápidamente que los servicios respondan
        bat 'timeout /t 10'
        bat 'curl -f http://localhost:3000/api/holidays?date=2025/06/07'
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
