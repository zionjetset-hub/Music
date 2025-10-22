import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useMusic } from '../context/MusicContext';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlaylistScreen = ({ route, navigation }) => {
  const { playlist } = route.params;
  const { playSong, currentSong, isPlaying } = useMusic();
  const [playlistSongs, setPlaylistSongs] = useState([]);

  useEffect(() => {
    loadPlaylistSongs();
  }, [playlist]);

  const loadPlaylistSongs = async () => {
    // In a real app, you would fetch playlist songs from the API
    // For now, we'll use mock data
    setPlaylistSongs([
      {
        id: 1,
        title: 'Sample Song 1',
        artist: 'Sample Artist 1',
        album: 'Sample Album',
        duration: 180,
        artwork: 'https://via.placeholder.com/60x60',
      },
      {
        id: 2,
        title: 'Sample Song 2',
        artist: 'Sample Artist 2',
        album: 'Sample Album',
        duration: 200,
        artwork: 'https://via.placeholder.com/60x60',
      },
    ]);
  };

  const handlePlaySong = (song) => {
    playSong(song);
    navigation.navigate('Player');
  };

  const renderSongItem = ({ item }) => (
    <Card style={styles.songCard}>
      <Card.Content>
        <View style={styles.songItem}>
          <Image
            source={{ uri: item.artwork }}
            style={styles.albumArt}
          />
          <View style={styles.songInfo}>
            <Title style={styles.songTitle}>{item.title}</Title>
            <Paragraph style={styles.songArtist}>{item.artist}</Paragraph>
            {item.album && (
              <Paragraph style={styles.songAlbum}>{item.album}</Paragraph>
            )}
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => handlePlaySong(item)}
          >
            <Icon
              name={currentSong?.id === item.id && isPlaying ? 'pause' : 'play-arrow'}
              size={30}
              color="#1DB954"
            />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{playlist.name}</Text>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.playlistInfo}>
        <Text style={styles.songCount}>
          {playlistSongs.length} {playlistSongs.length === 1 ? 'song' : 'songs'}
        </Text>
        <Text style={styles.createdDate}>
          Created {new Date(playlist.created_at).toLocaleDateString()}
        </Text>
      </View>

      <FlatList
        data={playlistSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  playlistInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  songCount: {
    fontSize: 16,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  createdDate: {
    fontSize: 14,
    color: '#808080',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  songCard: {
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 2,
  },
  songAlbum: {
    fontSize: 12,
    color: '#808080',
  },
  playButton: {
    padding: 10,
  },
});

export default PlaylistScreen;