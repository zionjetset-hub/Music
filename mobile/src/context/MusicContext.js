import React, { createContext, useContext, useState, useEffect } from 'react';
import TrackPlayer, { Capability, RepeatMode } from 'react-native-track-player';
import { api } from '../services/api';

const MusicContext = createContext({});

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePlayer();
    loadInitialData();
  }, []);

  const initializePlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
      });
    } catch (error) {
      console.error('Player initialization error:', error);
    }
  };

  const loadInitialData = async () => {
    await Promise.all([
      loadSongs(),
      loadGenres(),
    ]);
  };

  const loadSongs = async (page = 1, limit = 20, genre = null, search = null) => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (genre) params.genre = genre;
      if (search) params.search = search;

      const response = await api.get('/songs', { params });
      setSongs(response.data);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGenres = async () => {
    try {
      const response = await api.get('/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const loadPlaylists = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/playlists`);
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const loadFavorites = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/favorites`);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const playSong = async (song) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: song.id.toString(),
        url: song.file_path || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: song.title,
        artist: song.artist,
        album: song.album,
        artwork: song.artwork || 'https://via.placeholder.com/300x300',
      });
      
      await TrackPlayer.play();
      setCurrentSong(song);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const pauseSong = async () => {
    try {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing song:', error);
    }
  };

  const resumeSong = async () => {
    try {
      await TrackPlayer.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error resuming song:', error);
    }
  };

  const stopSong = async () => {
    try {
      await TrackPlayer.stop();
      setIsPlaying(false);
      setCurrentSong(null);
    } catch (error) {
      console.error('Error stopping song:', error);
    }
  };

  const createPlaylist = async (userId, name) => {
    try {
      const response = await api.post(`/users/${userId}/playlists`, { name });
      if (response.data.playlistId) {
        await loadPlaylists(userId);
        return { success: true, playlistId: response.data.playlistId };
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      return { success: false, error: error.response?.data?.error };
    }
  };

  const addToPlaylist = async (playlistId, songId) => {
    try {
      const response = await api.post(`/playlists/${playlistId}/songs`, { songId });
      return { success: true };
    } catch (error) {
      console.error('Error adding to playlist:', error);
      return { success: false, error: error.response?.data?.error };
    }
  };

  const addToFavorites = async (userId, songId) => {
    try {
      const response = await api.post(`/users/${userId}/favorites`, { songId });
      if (response.data) {
        await loadFavorites(userId);
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { success: false, error: error.response?.data?.error };
    }
  };

  const value = {
    songs,
    currentSong,
    isPlaying,
    playlists,
    favorites,
    genres,
    loading,
    loadSongs,
    loadGenres,
    loadPlaylists,
    loadFavorites,
    playSong,
    pauseSong,
    resumeSong,
    stopSong,
    createPlaylist,
    addToPlaylist,
    addToFavorites,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};