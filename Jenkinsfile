pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        // Reemplaza con tu URL real; si tu repo es privado, añade credentialsId aquí
        git branch: 'main', url: 'https://github.com/Vanesa11-villada/microservices.git'
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        bat 'docker compose down || exit 0'
        bat 'docker compose up -d --build'
      }
    }

    stage('Smoke Test') {
      steps {
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
