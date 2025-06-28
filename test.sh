#!/bin/bash

# Script para testar a aplicação Netflix Clone

echo "=== Iniciando testes do Netflix Clone ==="
echo

# Verificar se o Docker está instalado
echo "Verificando instalação do Docker..."
if ! command -v docker &> /dev/null; then
    echo "Docker não encontrado. Por favor, instale o Docker antes de continuar."
    exit 1
fi

echo "Docker encontrado."

# Verificar se o Docker Compose está instalado
echo "Verificando instalação do Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose não encontrado. Por favor, instale o Docker Compose antes de continuar."
    exit 1
fi

echo "Docker Compose encontrado."
echo

# Verificar arquivos essenciais
echo "Verificando arquivos essenciais..."
REQUIRED_FILES=(
    "docker-compose.yml"
    "backend/Dockerfile"
    "frontend/Dockerfile"
    "backend/requirements.txt"
    "frontend/package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Arquivo não encontrado: $file"
        exit 1
    fi
done

echo "Todos os arquivos essenciais encontrados."
echo

# Verificar variáveis de ambiente
echo "Verificando arquivos de ambiente..."
if [ ! -f "backend/.env" ]; then
    echo "Arquivo backend/.env não encontrado. Criando arquivo de exemplo..."
    cat > backend/.env << EOL
# Django settings
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,backend

# Database settings
DATABASE_URL=postgres://postgres:postgres@db:5432/netflix_clone
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=netflix_clone

# AWS settings
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=your-region
EOL
    echo "Arquivo backend/.env criado. Por favor, atualize com suas configurações."
fi

if [ ! -f "frontend/.env" ]; then
    echo "Arquivo frontend/.env não encontrado. Criando arquivo de exemplo..."
    cat > frontend/.env << EOL
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_NAME=Netflix Clone
EOL
    echo "Arquivo frontend/.env criado. Por favor, atualize com suas configurações."
fi

echo "Arquivos de ambiente verificados."
echo

# Construir e iniciar os containers
echo "Construindo e iniciando os containers..."
docker-compose build
if [ $? -ne 0 ]; then
    echo "Erro ao construir os containers. Verifique os logs acima."
    exit 1
fi

echo "Iniciando os containers..."
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "Erro ao iniciar os containers. Verifique os logs acima."
    exit 1
fi

echo "Containers iniciados com sucesso."
echo

# Verificar se os serviços estão rodando
echo "Verificando status dos serviços..."
sleep 5  # Aguardar inicialização dos serviços

if ! docker-compose ps | grep -q "backend.*Up"; then
    echo "Serviço backend não está rodando. Verifique os logs com 'docker-compose logs backend'."
    exit 1
fi

if ! docker-compose ps | grep -q "frontend.*Up"; then
    echo "Serviço frontend não está rodando. Verifique os logs com 'docker-compose logs frontend'."
    exit 1
fi

if ! docker-compose ps | grep -q "db.*Up"; then
    echo "Serviço db não está rodando. Verifique os logs com 'docker-compose logs db'."
    exit 1
fi

echo "Todos os serviços estão rodando."
echo

# Verificar se as portas estão acessíveis
echo "Verificando portas..."
if ! curl -s http://localhost:8000 > /dev/null; then
    echo "Backend não está acessível na porta 8000."
    exit 1
fi

if ! curl -s http://localhost:3000 > /dev/null; then
    echo "Frontend não está acessível na porta 3000."
    exit 1
fi

echo "Portas verificadas com sucesso."
echo

# Exibir informações de acesso
echo "=== Netflix Clone está rodando! ==="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000/api"
echo "Admin Django: http://localhost:8000/admin"
echo
echo "Para parar os serviços, execute: docker-compose down"
echo "Para visualizar logs, execute: docker-compose logs -f"
echo
echo "Testes concluídos com sucesso!"

