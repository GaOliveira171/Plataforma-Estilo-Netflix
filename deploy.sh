#!/bin/bash

# Script para deployment do Netflix Clone em produção

echo "=== Iniciando deployment do Netflix Clone ==="
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

# Verificar variáveis de ambiente de produção
echo "Verificando arquivos de ambiente de produção..."
if [ ! -f "backend/.env.prod" ]; then
    echo "Arquivo backend/.env.prod não encontrado. Criando arquivo de exemplo..."
    cat > backend/.env.prod << EOL
# Django settings
DEBUG=False
SECRET_KEY=change-this-to-a-secure-random-string
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,backend

# Database settings
DATABASE_URL=postgres://postgres:postgres@db:5432/netflix_clone
POSTGRES_PASSWORD=change-this-to-a-secure-password
POSTGRES_USER=postgres
POSTGRES_DB=netflix_clone

# AWS settings
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=your-region
EOL
    echo "Arquivo backend/.env.prod criado. Por favor, atualize com suas configurações de produção."
    echo "IMPORTANTE: Altere as senhas e chaves para valores seguros!"
    exit 1
fi

if [ ! -f "frontend/.env.prod" ]; then
    echo "Arquivo frontend/.env.prod não encontrado. Criando arquivo de exemplo..."
    cat > frontend/.env.prod << EOL
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_NAME=Netflix Clone
EOL
    echo "Arquivo frontend/.env.prod criado. Por favor, atualize com suas configurações de produção."
    exit 1
fi

echo "Arquivos de ambiente de produção verificados."
echo

# Criar docker-compose de produção
echo "Criando arquivo docker-compose.prod.yml..."
cat > docker-compose.prod.yml << EOL
version: '3.8'

services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./backend/.env.prod
    restart: always
    networks:
      - netflix-network

  backend:
    build: ./backend
    volumes:
      - static_volume:/app/static
      - media_volume:/app/media
    env_file:
      - ./backend/.env.prod
    depends_on:
      - db
    command: >
      sh -c "python manage.py wait_for_db &&
             python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn netflix_backend.wsgi:application --bind 0.0.0.0:8000"
    restart: always
    networks:
      - netflix-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    env_file:
      - ./frontend/.env.prod
    depends_on:
      - backend
    restart: always
    networks:
      - netflix-network

  nginx:
    image: nginx:1.25
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - static_volume:/var/www/static
      - media_volume:/var/www/media
    depends_on:
      - backend
      - frontend
    restart: always
    networks:
      - netflix-network

networks:
  netflix-network:

volumes:
  postgres_data:
  static_volume:
  media_volume:
EOL

echo "Arquivo docker-compose.prod.yml criado."
echo

# Criar Dockerfile de produção para o frontend
echo "Criando Dockerfile.prod para o frontend..."
cat > frontend/Dockerfile.prod << EOL
# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:1.25-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOL

echo "Arquivo Dockerfile.prod para o frontend criado."
echo

# Criar diretório para configurações do Nginx
echo "Criando configurações do Nginx..."
mkdir -p nginx/conf.d
mkdir -p nginx/ssl

# Criar configuração do Nginx
cat > nginx/conf.d/default.conf << EOL
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:80;
}

server {
    listen 80;
    server_name _;
    
    # Redirecionar para HTTPS em produção
    # Descomente as linhas abaixo quando tiver SSL configurado
    # return 301 https://\$host\$request_uri;
}

# Descomente o bloco abaixo quando tiver SSL configurado
# server {
#     listen 443 ssl;
#     server_name _;
#
#     ssl_certificate /etc/nginx/ssl/fullchain.pem;
#     ssl_certificate_key /etc/nginx/ssl/privkey.pem;
#
#     # API
#     location /api {
#         proxy_pass http://backend;
#         proxy_set_header Host \$host;
#         proxy_set_header X-Real-IP \$remote_addr;
#         proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto \$scheme;
#     }
#
#     # Admin
#     location /admin {
#         proxy_pass http://backend;
#         proxy_set_header Host \$host;
#         proxy_set_header X-Real-IP \$remote_addr;
#     }
#
#     # Static files
#     location /static/ {
#         alias /var/www/static/;
#     }
#
#     # Media files
#     location /media/ {
#         alias /var/www/media/;
#     }
#
#     # Frontend
#     location / {
#         proxy_pass http://frontend;
#         proxy_set_header Host \$host;
#         proxy_set_header X-Real-IP \$remote_addr;
#     }
# }

# Configuração temporária para desenvolvimento sem SSL
server {
    listen 80;
    
    # API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Admin
    location /admin {
        proxy_pass http://backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    # Static files
    location /static/ {
        alias /var/www/static/;
    }
    
    # Media files
    location /media/ {
        alias /var/www/media/;
    }
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOL

echo "Configuração do Nginx criada."
echo

# Criar configuração do Nginx para o frontend
cat > frontend/nginx/default.conf << EOL
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOL

echo "Configuração do Nginx para o frontend criada."
echo

# Criar diretório para o Nginx do frontend
mkdir -p frontend/nginx

# Criar configuração do Nginx para o frontend
cat > frontend/nginx/default.conf << EOL
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOL

echo "Configuração do Nginx para o frontend criada."
echo

# Instruções para deployment
echo "=== Instruções para Deployment ==="
echo
echo "1. Configure os arquivos .env.prod com suas credenciais de produção"
echo "2. Configure o SSL para seu domínio (recomendado: Let's Encrypt)"
echo "3. Atualize a configuração do Nginx em nginx/conf.d/default.conf"
echo "4. Execute o deployment com: docker-compose -f docker-compose.prod.yml up -d"
echo
echo "Para iniciar o deployment agora, execute:"
echo "docker-compose -f docker-compose.prod.yml up -d"
echo
echo "Preparação para deployment concluída!"

