from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Person(models.Model):
    ROLE_CHOICES = [
        ('actor', 'Ator'),
        ('director', 'Diretor'),
        ('producer', 'Produtor'),
        ('writer', 'Roteirista'),
    ]
    
    name = models.CharField(max_length=200)
    biography = models.TextField(blank=True)
    birth_date = models.DateField(null=True, blank=True)
    photo = models.ImageField(upload_to='people/', null=True, blank=True)
    roles = models.CharField(max_length=20, choices=ROLE_CHOICES, default='actor')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Content(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('movie', 'Filme'),
        ('series', 'Série'),
        ('documentary', 'Documentário'),
    ]
    
    RATING_CHOICES = [
        ('G', 'Livre'),
        ('PG', '10 anos'),
        ('PG-13', '13 anos'),
        ('R', '16 anos'),
        ('NC-17', '18 anos'),
    ]

    title = models.CharField(max_length=200)
    original_title = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES)
    release_date = models.DateField()
    duration = models.PositiveIntegerField(help_text="Duração em minutos")
    rating = models.CharField(max_length=10, choices=RATING_CHOICES)
    imdb_rating = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)],
        null=True, blank=True
    )
    
    # Relacionamentos
    genres = models.ManyToManyField(Genre, related_name='contents')
    cast = models.ManyToManyField(Person, through='Cast', related_name='acted_contents')
    directors = models.ManyToManyField(Person, related_name='directed_contents', blank=True)
    
    # Mídia
    poster = models.ImageField(upload_to='posters/', null=True, blank=True)
    backdrop = models.ImageField(upload_to='backdrops/', null=True, blank=True)
    trailer_url = models.URLField(blank=True)
    video_file = models.FileField(upload_to='videos/', null=True, blank=True)
    
    # Metadados
    is_featured = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class Cast(models.Model):
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    character_name = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        unique_together = ['content', 'person']

class Season(models.Model):
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='seasons')
    season_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    release_date = models.DateField()
    poster = models.ImageField(upload_to='seasons/', null=True, blank=True)

    def __str__(self):
        return f"{self.content.title} - Temporada {self.season_number}"

    class Meta:
        ordering = ['season_number']
        unique_together = ['content', 'season_number']

class Episode(models.Model):
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='episodes')
    episode_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.PositiveIntegerField(help_text="Duração em minutos")
    release_date = models.DateField()
    video_file = models.FileField(upload_to='episodes/', null=True, blank=True)
    thumbnail = models.ImageField(upload_to='episode_thumbs/', null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.season.content.title} S{self.season.season_number}E{self.episode_number} - {self.title}"

    class Meta:
        ordering = ['episode_number']
        unique_together = ['season', 'episode_number']

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    preferred_language = models.CharField(max_length=10, default='pt-br')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

class WatchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.ForeignKey(Content, on_delete=models.CASCADE, null=True, blank=True)
    episode = models.ForeignKey(Episode, on_delete=models.CASCADE, null=True, blank=True)
    watched_at = models.DateTimeField(auto_now_add=True)
    progress = models.PositiveIntegerField(default=0, help_text="Progresso em segundos")
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-watched_at']

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'content']
        ordering = ['-created_at']

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'content']
        ordering = ['-created_at']

