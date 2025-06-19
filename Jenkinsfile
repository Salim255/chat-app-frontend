pipeline {
    agent any

    tools {
        nodejs 'NODE20'
        jdk 'JDK17'
    }

    environment {
        registryCredentials = 'ecr:eu-west-3:awscreds'
        imageName = "961341553126.dkr.ecr.eu-west-3.amazonaws.com/intimacy-frontend"
        intimacyRegistry = "https://961341553126.dkr.ecr.eu-west-3.amazonaws.com"
        ANGULAR_OUTPUT_DIR = "www"
    }

    stages {

        stage("Clean Workspace") {
            steps {
                cleanWs()
            }
        }

        stage("Fetch Code") {
            steps {
                git branch: 'develop', url: 'https://github.com/Salim255/chat-app-frontend.git'
            }
        }

        stage("Install Dependencies") {
            steps {
               sh 'npm install'
            }
        }

        stage("Build App") {
            steps {
                script {
                    sh 'npm run build'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: "www/**", fingerprint: true
                }
            }
        }

        stage("Lint (Checkstyle)") {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'npm run lint -- --format json > eslint-report.json'
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'eslint-report.json', fingerprint: true
                }
            }
        }

        stage('SonarQube Analysis') {
            environment {
                SONARQUBE_SCANNER_HOME = tool 'sonar7.1' // Ensure you have configured SonarQube scanner in Jenkins
            }
            steps {
                withSonarQubeEnv('sonarserver') { // Ensure you have configured SonarQube server in Jenkins
                    sh '''
                        ${SONARQUBE_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=intimacy-front-v2 \
                        -Dsonar.projectName="Intimacy Frontend" \
                        -Dsonar.projectVersion=1.0 \
                        -Dsonar.sources=src \
                        -Dsonar.exclusions=src/infrastructure/**/* \
                        -Dsonar.sourceEncoding=UTF-8 \
                        -Dsonar.eslint.reportPaths=eslint-report.json \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''

                    // Upload the ESLint report to SonarQube server
                    echo "========SonarQube Analysis executed successfully========"
                }
            }
        }

        stage("Quality Gate") {
            steps {
              timeout(time: 1, unit: 'HOURS') {
                waitForQualityGate abortPipeline: true
              }
                 //jenkins-ci-webhook
            }
        }


        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${imageName}:frontend-${BUILD_NUMBER}", ".")
                }
            }
        }

        stage("Upload App Image") {
            steps {
                script {
                    docker.withRegistry(intimacyRegistry, registryCredentials) {
                      dockerImage.push("frontend-${BUILD_NUMBER}")
                      dockerImage.push("latest")
                    }
                }
            }
        }

        stage("Deploy to Cluster"){
            agent { label 'minikube' }
            steps {
                script {
                    sh 'pwd'
                    sh 'kubectl rollout restart deployment client-deployment -n default'
                }
            }
        }
    }
}
