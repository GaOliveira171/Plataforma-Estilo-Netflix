from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Genre, Person, Content, Cast, Season, Episode, 
    UserProfile, WatchHistory, Favorite, Rating
)

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class CastSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only=True)
    
    class Meta:
        model = Cast
        fields = ['person', 'character_name', 'order']

class EpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = '__all__'

class SeasonSerializer(serializers.ModelSerializer):
    episodes = EpisodeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Season
        fields = '__all__'

class ContentListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    
    class Meta:
        model = Content
        fields = [
            'id', 'title', 'description', 'content_type', 'release_date',
            'duration', 'rating', 'imdb_rating', 'poster', 'backdrop',
            'is_featured', 'is_trending', 'view_count', 'genres'
        ]

class ContentDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    cast = CastSerializer(many=True, read_only=True)
    directors = PersonSerializer(many=True, read_only=True)
    seasons = SeasonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Content
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'avatar', 'date_of_birth', 'preferred_language']

class WatchHistorySerializer(serializers.ModelSerializer):
    content = ContentListSerializer(read_only=True)
    episode = EpisodeSerializer(read_only=True)
    
    class Meta:
        model = WatchHistory
        fields = '__all__'

class FavoriteSerializer(serializers.ModelSerializer):
    content = ContentListSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = '__all__'

class RatingSerializer(serializers.ModelSerializer):
    content = ContentListSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Rating
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("As senhas não coincidem.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user

