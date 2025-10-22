import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useMusic } from '../context/MusicContext';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchScreen = ({ navigation }) => {
  const { songs, genres, loadSongs, playSong, currentSong, isPlaying } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    loadSongs(1, 20, selectedGenre, searchQuery);
  }, [searchQuery, selectedGenre]);

  const handlePlaySong = (song) => {
    playSong(song);
    navigation.navigate('Player');
  };

  const renderSongItem = ({ item }) => (
    <Card style={styles.songCard}>
      <Card.Content>
        <View style={styles.songItem}>
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search songs, artists, albums..."
          placeholderTextColor="#B3B3B3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Icon name="search" size={24} color="#B3B3B3" style={styles.searchIcon} />
      </View>

      <View style={styles.genresContainer}>
        <Text style={styles.genresTitle}>Genres</Text>
        <View style={styles.chipsContainer}>
          <Chip
            selected={!selectedGenre}
            onPress={() => setSelectedGenre(null)}
            style={styles.chip}
            textStyle={styles.chipText}
          >
            All
          </Chip>
          {genres.map((genre) => (
            <Chip
              key={genre}
              selected={selectedGenre === genre}
              onPress={() => setSelectedGenre(genre)}
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {genre}
            </Chip>
          ))}
        </View>
      </View>

      <FlatList
        data={songs}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    margin: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#FFFFFF',
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
  genresContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  genresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
  },
  chipText: {
    color: '#FFFFFF',
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

export default SearchScreen;