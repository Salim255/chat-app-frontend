pipeline {
    agent any

    tools {
        nodejs 'NODE20'
        jdk 'JDK17'
    }

    environment {
        registryCredentials = 'ecr:eu-west-3:awscreds'
        imageName = "961341553126.dkr.ecr.eu-west-3.amazonaws.com/intimacy-frontend-repo"
        intimacyRegistry = "https://961341553126.dkr.ecr.eu-west-3.amazonaws.com"
        ANGULAR_OUTPUT_DIR = "www"
    }

    stages {

        stage("Fetch Code") {
            steps {
                git branch: 'develop', url: 'https://github.com/Salim255/intimacy-frontend.git'
            }
        }

        stage("Install Dependencies") {
            steps {
               sh 'npm ci'
            }
        }

        stage("Build App") {
            steps {
                script {
                    sh 'npx ng cache clean'
                    sh 'ng build --configuration production --verbose'
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
                    sh 'npm run lint -- --format json -o eslint-report.json'
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: "${APP_DIR}/eslint-report.json", fingerprint: true
                }
            }
        }

        stage("SonarQube Analysis") {
            environment {
                SONARQUBE_SCANNER_HOME = tool 'sonar7.1'
            }
            steps {

                withSonarQubeEnv('sonarserver') {
                    sh '''
                        ${SONARQUBE_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=intimacy-frontend \
                        -Dsonar.projectName="Intimacy Frontend" \
                        -Dsonar.projectVersion=1.0 \
                        -Dsonar.sources=src \
                        -Dsonar.sourceEncoding=UTF-8 \
                        -Dsonar.eslint.reportPaths=eslint-report.json \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage("Archive Artifact") {
            steps {
                sh "tar -czf ../${ANGULAR_OUTPUT_DIR}.tar.gz ${ANGULAR_OUTPUT_DIR}"
                archiveArtifacts artifacts: "www.tar.gz", fingerprint: true
            }
        }

        stage("Upload to Nexus") {
            steps {
                nexusArtifactUploader(
                    nexusVersion: 'nexus3',
                    protocol: 'http',
                    nexusUrl: '172.31.4.90:8081',
                    groupId: 'QA',
                    version: "${env.BUILD_ID}-${env.BUILD_TIMESTAMP}",
                    repository: 'intimacy-frontend-repository',
                    credentialsId: 'nexuslogin',
                    artifacts: [[
                        artifactId: 'intimacy-frontend',
                        classifier: '',
                        file: "${ANGULAR_OUTPUT_DIR}.tar.gz",
                        type: 'tgz'
                    ]]
                )
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${imageName}:${BUILD_NUMBER}", ".")
                }
            }
        }

        stage("Upload App Image") {
            steps {
                script {
                    docker.withRegistry(intimacyRegistry, registryCredentials) {
                        dockerImage.push("${BUILD_NUMBER}")
                        dockerImage.push("latest")
                    }
                }
            }
        }
    }
}
