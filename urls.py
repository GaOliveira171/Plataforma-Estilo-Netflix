from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'genres', views.GenreViewSet)
router.register(r'people', views.PersonViewSet)
router.register(r'contents', views.ContentViewSet)
router.register(r'seasons', views.SeasonViewSet)
router.register(r'episodes', views.EpisodeViewSet)
router.register(r'profile', views.UserProfileViewSet, basename='profile')
router.register(r'history', views.WatchHistoryViewSet, basename='history')
router.register(r'favorites', views.FavoriteViewSet, basename='favorites')
router.register(r'ratings', views.RatingViewSet, basename='ratings')
router.register(r'register', views.UserRegistrationViewSet, basename='register')

urlpatterns = [
    path('', include(router.urls)),
]

