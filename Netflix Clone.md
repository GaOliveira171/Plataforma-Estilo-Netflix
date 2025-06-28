# Netflix Clone

Um clone da interface da Netflix com design moderno, SEO otimizado e responsivo.

## Tecnologias Utilizadas

### Backend
- Django 5.2.3
- Django REST Framework 3.16.0
- PostgreSQL 15
- Docker

### Frontend
- React 19
- TypeScript
- Styled Components
- React Router DOM
- Axios

## Estrutura do Projeto

```
netflix-clone/
├── backend/           # Aplicação Django
│   ├── accounts/      # App para gerenciamento de usuários e perfis
│   ├── movies/        # App para gerenciamento de filmes e séries
│   ├── streaming/     # App para gerenciamento de streaming
│   └── netflix_backend/ # Configurações do projeto Django
├── frontend/          # Aplicação React
│   ├── public/        # Arquivos públicos
│   └── src/           # Código fonte
│       ├── components/ # Componentes reutilizáveis
│       ├── context/   # Contextos React
│       ├── pages/     # Páginas da aplicação
│       ├── services/  # Serviços de API
│       └── styles/    # Estilos globais
└── docker/            # Arquivos de configuração Docker
```

## Funcionalidades

- Autenticação de usuários
- Perfis de usuário
- Catálogo de filmes e séries
- Reprodução de vídeos
- Lista de favoritos
- Histórico de visualização
- Recomendações personalizadas
- Pesquisa de conteúdo
- Interface responsiva

## Configuração e Execução

### Pré-requisitos
- Docker e Docker Compose
- Node.js (para desenvolvimento local do frontend)
- Python (para desenvolvimento local do backend)

### Executando com Docker

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/netflix-clone.git
cd netflix-clone
```

2. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env` no diretório `backend`
   - Copie o arquivo `.env.example` para `.env` no diretório `frontend`
   - Edite os arquivos `.env` com suas configurações

3. Execute o Docker Compose:
```bash
docker-compose up -d
```

4. Acesse a aplicação:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin Django: http://localhost:8000/admin

### Desenvolvimento Local

#### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Integração com AWS S3

Para armazenar vídeos e imagens, o projeto está configurado para usar o Amazon S3:

1. Crie um bucket S3 na AWS
2. Configure as credenciais da AWS no arquivo `.env` do backend:
```
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_STORAGE_BUCKET_NAME=seu_bucket_name
AWS_S3_REGION_NAME=sua_regiao
```

## SEO e Otimização

O projeto inclui:
- URLs amigáveis para SEO
- Metadados dinâmicos
- Schema Markup (Structured Data)
- Sitemap XML
- Otimização de Core Web Vitals

## Licença

Este projeto é apenas para fins educacionais e não deve ser usado comercialmente.

