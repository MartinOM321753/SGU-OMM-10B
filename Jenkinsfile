pipeline {
    agent any
    environment {
        PATH = "/usr/local/bin:${env.PATH}"
    }

    stages {
        
        // Para detener los servicios o en todo caso hacer caso omiso
        stage('Deteniendo los servicios...') {
            steps {
                sh '''
                    docker compose -p SGU-OMM-10B down || true
                '''
            }
        }
        
        // Eliminar las imagenes creadas por este proyecto
        stage('Eliminando imagenes anteriores...') {
            steps {
                sh '''
                    IMAGES=$(docker images --filter "label=com.docker.compose.project=SGU-OMM-10B" -q)
                    if [ -n "$IMAGES" ]; then
                        docker rmi -f $IMAGES
                    else
                        echo "No hay imagenes por eliminar"
                    fi
                '''
            }
        }

        // Del recurso SCM configurado en el job jala el repo
        stage('Obteniendo actualizacion...') {
            steps {
                checkout scm
            }
        }

        stage('Construyendo y desplegando servicios...') {
            steps {
                sh '''
                    docker compose up --build -d
                '''
            }
        }

    }

    post {
        success {
            echo "Pipeline ejecutado con exito"
        }

        failure {
            echo "Error al ejecutar el Pipeline"
        }

        always {
            echo "Pipeline finalizado"
        }
    }

}