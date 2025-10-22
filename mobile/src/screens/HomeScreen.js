import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const { songs, loadSongs, playSong, currentSong, isPlaying, loading } = useMusic();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSongs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSongs();
    setRefreshing(false);
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
            source={{ uri: item.artwork || 'https://via.placeholder.com/60x60' }}
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
        <Text style={styles.welcomeText}>Welcome back, {user?.username || 'User'}!</Text>
        <Text style={styles.subtitle}>Discover new music</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Songs</Text>
        <FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {currentSong && (
        <View style={styles.nowPlaying}>
          <TouchableOpacity
            style={styles.nowPlayingContent}
            onPress={() => navigation.navigate('Player')}
          >
            <Image
              source={{ uri: currentSong.artwork || 'https://via.placeholder.com/40x40' }}
              style={styles.nowPlayingArt}
            />
            <View style={styles.nowPlayingInfo}>
              <Text style={styles.nowPlayingTitle}>{currentSong.title}</Text>
              <Text style={styles.nowPlayingArtist}>{currentSong.artist}</Text>
            </View>
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={24}
              color="#1DB954"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#B3B3B3',
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
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
  nowPlaying: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  nowPlayingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  nowPlayingArt: {
    width: 40,
    height: 40,
    borderRadius: 3,
    marginRight: 15,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nowPlayingArtist: {
    fontSize: 12,
    color: '#B3B3B3',
  },
});

export default HomeScreen;