import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useMusic } from '../context/MusicContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const PlayerScreen = ({ navigation }) => {
  const { currentSong, isPlaying, pauseSong, resumeSong, stopSong } = useMusic();
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // In a real app, you would set up listeners for position updates
    // For now, we'll just use static values
    setDuration(currentSong?.duration || 180);
  }, [currentSong]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const handleStop = () => {
    stopSong();
    navigation.goBack();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="keyboard-arrow-down" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.noSongText}>No song playing</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="keyboard-arrow-down" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.albumArtContainer}>
        <Image
          source={{ uri: currentSong.artwork || 'https://via.placeholder.com/300x300' }}
          style={styles.albumArt}
        />
      </View>

      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{currentSong.title}</Text>
        <Text style={styles.songArtist}>{currentSong.artist}</Text>
        {currentSong.album && (
          <Text style={styles.songAlbum}>{currentSong.album}</Text>
        )}
      </View>

      <View style={styles.progressContainer}>
        <Slider
          style={styles.progressSlider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={setPosition}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#333333"
          thumbStyle={styles.sliderThumb}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="shuffle" size={24} color="#B3B3B3" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="skip-previous" size={32} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          <Icon
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={40}
            color="#000000"
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="skip-next" size={32} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="repeat" size={24} color="#B3B3B3" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.bottomButton}>
          <Icon name="favorite-border" size={24} color="#B3B3B3" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomButton}>
          <Icon name="playlist-add" size={24} color="#B3B3B3" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomButton} onPress={handleStop}>
          <Icon name="stop" size={24} color="#B3B3B3" />
        </TouchableOpacity>
      </View>
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
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSongText: {
    fontSize: 18,
    color: '#B3B3B3',
  },
  albumArtContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  albumArt: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 10,
  },
  songInfo: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  songArtist: {
    fontSize: 18,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 4,
  },
  songAlbum: {
    fontSize: 16,
    color: '#808080',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  progressSlider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#1DB954',
    width: 20,
    height: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  controlButton: {
    padding: 15,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  bottomButton: {
    padding: 15,
    marginHorizontal: 10,
  },
});

export default PlayerScreen;