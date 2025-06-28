import api from './api';

export interface VideoQuality {
  id: number;
  resolution: string;
  video_url: string;
  bitrate: number;
  file_size: number;
}

export interface Subtitle {
  id: number;
  language: string;
  language_display: string;
  subtitle_url: string;
  is_default: boolean;
}

export interface AudioTrack {
  id: number;
  language: string;
  language_display: string;
  audio_url: string;
  is_default: boolean;
}

export interface StreamingManifest {
  session_id: number;
  title: string;
  description: string;
  duration: number;
  poster_url: string | null;
  video_qualities: VideoQuality[];
  subtitles: Subtitle[];
  audio_tracks: AudioTrack[];
}

export interface StreamingSession {
  id: number;
  content_title?: string;
  episode_title?: string;
  quality: string;
  buffering_count: number;
  buffering_duration: number;
  start_time: string;
  end_time: string | null;
  duration: number;
}

// Obter manifesto de streaming para um conteúdo ou episódio
export const getStreamingManifest = async (
  params: { content_id?: number; episode_id?: number }
): Promise<StreamingManifest> => {
  const response = await api.post<StreamingManifest>('/streaming/manifest/', params);
  return response.data;
};

// Finalizar uma sessão de streaming
export const endStreamingSession = async (
  sessionId: number,
  data: {
    quality: string;
    buffering_count: number;
    buffering_duration: number;
  }
): Promise<StreamingSession> => {
  const response = await api.post<StreamingSession>(
    `/streaming/sessions/${sessionId}/end_session/`,
    data
  );
  return response.data;
};

// Registrar um erro de streaming
export const reportStreamingError = async (
  data: {
    session: number;
    error_type: 'playback' | 'buffering' | 'quality' | 'audio' | 'subtitle' | 'connection' | 'other';
    error_message: string;
  }
): Promise<void> => {
  await api.post('/streaming/errors/', data);
};

