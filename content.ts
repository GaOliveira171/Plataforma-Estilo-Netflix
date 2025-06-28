import api from './api';

export interface Genre {
  id: number;
  name: string;
  description?: string;
}

export interface Person {
  id: number;
  name: string;
  biography?: string;
  photo?: string;
  roles: string;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  content_type: 'movie' | 'series' | 'documentary';
  release_date: string;
  duration: number;
  rating: string;
  imdb_rating?: number;
  poster?: string;
  backdrop?: string;
  trailer_url?: string;
  is_featured: boolean;
  is_trending: boolean;
  view_count: number;
  genres: Genre[];
}

export interface ContentDetail extends Content {
  original_title?: string;
  cast: {
    person: Person;
    character_name: string;
    order: number;
  }[];
  directors: Person[];
  seasons?: Season[];
}

export interface Season {
  id: number;
  content: number;
  season_number: number;
  title: string;
  description?: string;
  release_date: string;
  poster?: string;
  episodes: Episode[];
}

export interface Episode {
  id: number;
  season: number;
  episode_number: number;
  title: string;
  description: string;
  duration: number;
  release_date: string;
  thumbnail?: string;
  view_count: number;
}

export interface ContentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Content[];
}

// Obter lista de conteúdos com paginação e filtros
export const getContents = async (
  page = 1,
  filters?: {
    type?: string;
    genre?: string;
    rating?: string;
    year?: number;
    sort_by?: string;
  }
): Promise<ContentResponse> => {
  const params = { page, ...filters };
  const response = await api.get<ContentResponse>('/movies/contents/', { params });
  return response.data;
};

// Obter detalhes de um conteúdo específico
export const getContentDetail = async (id: number): Promise<ContentDetail> => {
  const response = await api.get<ContentDetail>(`/movies/contents/${id}/`);
  return response.data;
};

// Obter conteúdos em destaque
export const getFeaturedContents = async (): Promise<Content[]> => {
  const response = await api.get<Content[]>('/movies/contents/featured/');
  return response.data;
};

// Obter conteúdos em tendência
export const getTrendingContents = async (): Promise<Content[]> => {
  const response = await api.get<Content[]>('/movies/contents/trending/');
  return response.data;
};

// Obter recomendações personalizadas
export const getRecommendations = async (): Promise<Content[]> => {
  const response = await api.get<Content[]>('/movies/contents/recommendations/');
  return response.data;
};

// Obter temporadas de uma série
export const getSeasons = async (contentId: number): Promise<Season[]> => {
  const response = await api.get<Season[]>('/movies/seasons/', {
    params: { content: contentId }
  });
  return response.data;
};

// Obter episódios de uma temporada
export const getEpisodes = async (seasonId: number): Promise<Episode[]> => {
  const response = await api.get<Episode[]>('/movies/episodes/', {
    params: { season: seasonId }
  });
  return response.data;
};

// Adicionar conteúdo aos favoritos
export const addToFavorites = async (contentId: number): Promise<void> => {
  await api.post('/movies/favorites/', { content: contentId });
};

// Remover conteúdo dos favoritos
export const removeFromFavorites = async (favoriteId: number): Promise<void> => {
  await api.delete(`/movies/favorites/${favoriteId}/`);
};

// Obter lista de favoritos
export const getFavorites = async (): Promise<{ id: number; content: Content }[]> => {
  const response = await api.get<{ id: number; content: Content }[]>('/movies/favorites/');
  return response.data;
};

// Registrar histórico de visualização
export const addToWatchHistory = async (
  data: {
    content?: number;
    episode?: number;
    progress: number;
    completed: boolean;
  }
): Promise<void> => {
  await api.post('/movies/history/', data);
};

// Obter histórico de visualização
export const getWatchHistory = async (): Promise<{
  id: number;
  content?: Content;
  episode?: Episode;
  progress: number;
  completed: boolean;
  watched_at: string;
}[]> => {
  const response = await api.get('/movies/history/');
  return response.data;
};

