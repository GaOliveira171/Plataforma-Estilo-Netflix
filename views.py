from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import (
    Genre, Person, Content, Cast, Season, Episode, 
    UserProfile, WatchHistory, Favorite, Rating
)
from .serializers import (
    GenreSerializer, PersonSerializer, ContentListSerializer, ContentDetailSerializer,
    SeasonSerializer, EpisodeSerializer, UserProfileSerializer, WatchHistorySerializer,
    FavoriteSerializer, RatingSerializer, UserRegistrationSerializer
)

class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class PersonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class ContentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Content.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'original_title', 'description']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ContentDetailSerializer
        return ContentListSerializer
    
    def get_queryset(self):
        queryset = Content.objects.all()
        
        # Filtrar por tipo de conteúdo
        content_type = self.request.query_params.get('type')
        if content_type:
            queryset = queryset.filter(content_type=content_type)
        
        # Filtrar por gênero
        genre = self.request.query_params.get('genre')
        if genre:
            queryset = queryset.filter(genres__name__icontains=genre)
        
        # Filtrar por classificação
        rating = self.request.query_params.get('rating')
        if rating:
            queryset = queryset.filter(rating=rating)
        
        # Filtrar por ano de lançamento
        year = self.request.query_params.get('year')
        if year:
            queryset = queryset.filter(release_date__year=year)
        
        # Ordenar por popularidade, data de lançamento, etc.
        sort_by = self.request.query_params.get('sort_by', 'created_at')
        if sort_by == 'popularity':
            queryset = queryset.order_by('-view_count')
        elif sort_by == 'release_date':
            queryset = queryset.order_by('-release_date')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-imdb_rating')
        else:
            queryset = queryset.order_by('-created_at')
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = Content.objects.filter(is_featured=True)
        serializer = ContentListSerializer(featured, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        trending = Content.objects.filter(is_trending=True)
        serializer = ContentListSerializer(trending, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        """
        Recomendações personalizadas baseadas no histórico do usuário.
        """
        if not request.user.is_authenticated:
            return Response({"detail": "Autenticação necessária"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Obter gêneros que o usuário assistiu recentemente
        watched_genres = Genre.objects.filter(
            contents__watchhistory__user=request.user
        ).distinct()
        
        # Recomendar conteúdo com gêneros similares que o usuário não assistiu
        recommendations = Content.objects.filter(
            genres__in=watched_genres
        ).exclude(
            watchhistory__user=request.user
        ).distinct().order_by('-imdb_rating')[:20]
        
        serializer = ContentListSerializer(recommendations, many=True)
        return Response(serializer.data)

class SeasonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Season.objects.all()
    serializer_class = SeasonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        content_id = self.request.query_params.get('content')
        if content_id:
            return Season.objects.filter(content_id=content_id)
        return Season.objects.all()

class EpisodeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        season_id = self.request.query_params.get('season')
        if season_id:
            return Episode.objects.filter(season_id=season_id)
        return Episode.objects.all()

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    def get_object(self):
        return get_object_or_404(UserProfile, user=self.request.user)

class WatchHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = WatchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return WatchHistory.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id
        
        # Verificar se já existe um registro para este conteúdo/episódio
        content_id = data.get('content')
        episode_id = data.get('episode')
        
        if content_id:
            existing = WatchHistory.objects.filter(
                user=request.user, 
                content_id=content_id,
                episode__isnull=True
            ).first()
        elif episode_id:
            existing = WatchHistory.objects.filter(
                user=request.user, 
                episode_id=episode_id
            ).first()
        else:
            return Response(
                {"detail": "Conteúdo ou episódio é obrigatório"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Atualizar registro existente ou criar novo
        if existing:
            serializer = self.get_serializer(existing, data=data, partial=True)
        else:
            serializer = self.get_serializer(data=data)
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id
        
        # Verificar se já existe um favorito para este conteúdo
        content_id = data.get('content')
        if not content_id:
            return Response(
                {"detail": "ID do conteúdo é obrigatório"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        existing = Favorite.objects.filter(
            user=request.user, 
            content_id=content_id
        ).first()
        
        if existing:
            return Response(
                {"detail": "Este conteúdo já está nos favoritos"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        content_id = self.request.query_params.get('content')
        if content_id:
            return Rating.objects.filter(content_id=content_id)
        return Rating.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id
        
        # Verificar se já existe uma avaliação para este conteúdo
        content_id = data.get('content')
        if not content_id:
            return Response(
                {"detail": "ID do conteúdo é obrigatório"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        existing = Rating.objects.filter(
            user=request.user, 
            content_id=content_id
        ).first()
        
        if existing:
            serializer = self.get_serializer(existing, data=data, partial=True)
        else:
            serializer = self.get_serializer(data=data)
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)

class UserRegistrationViewSet(viewsets.GenericViewSet):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Usuário registrado com sucesso"}, 
            status=status.HTTP_201_CREATED
        )

