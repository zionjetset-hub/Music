import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LibraryScreen = ({ navigation }) => {
  const { playlists, favorites, loadPlaylists, loadFavorites, createPlaylist, addToFavorites } = useMusic();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('playlists');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    if (user) {
      loadPlaylists(user.id);
      loadFavorites(user.id);
    }
  }, [user]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }

    const result = await createPlaylist(user.id, newPlaylistName.trim());
    if (result.success) {
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
      Alert.alert('Success', 'Playlist created successfully');
    } else {
      Alert.alert('Error', result.error || 'Failed to create playlist');
    }
  };

  const renderPlaylistItem = ({ item }) => (
    <Card style={styles.itemCard}>
      <Card.Content>
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => navigation.navigate('Playlist', { playlist: item })}
        >
          <Icon name="playlist-play" size={40} color="#1DB954" />
          <View style={styles.itemInfo}>
            <Title style={styles.itemTitle}>{item.name}</Title>
            <Paragraph style={styles.itemSubtitle}>
              Created {new Date(item.created_at).toLocaleDateString()}
            </Paragraph>
          </View>
          <Icon name="chevron-right" size={24} color="#B3B3B3" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderFavoriteItem = ({ item }) => (
    <Card style={styles.itemCard}>
      <Card.Content>
        <View style={styles.itemContent}>
          <Icon name="favorite" size={40} color="#1DB954" />
          <View style={styles.itemInfo}>
            <Title style={styles.itemTitle}>{item.title}</Title>
            <Paragraph style={styles.itemSubtitle}>{item.artist}</Paragraph>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'playlists' && styles.activeTab]}
            onPress={() => setActiveTab('playlists')}
          >
            <Text style={[styles.tabText, activeTab === 'playlists' && styles.activeTabText]}>
              Playlists
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'playlists' && (
        <View style={styles.content}>
          <View style={styles.createPlaylistContainer}>
            <Button
              mode="contained"
              onPress={() => setShowCreatePlaylist(true)}
              style={styles.createButton}
              contentStyle={styles.buttonContent}
            >
              Create Playlist
            </Button>
          </View>

          {showCreatePlaylist && (
            <Card style={styles.createCard}>
              <Card.Content>
                <TextInput
                  label="Playlist Name"
                  value={newPlaylistName}
                  onChangeText={setNewPlaylistName}
                  mode="outlined"
                  style={styles.input}
                  theme={{ colors: { primary: '#1DB954' } }}
                />
                <View style={styles.buttonRow}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowCreatePlaylist(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleCreatePlaylist}
                    style={styles.saveButton}
                  >
                    Create
                  </Button>
                </View>
              </Card.Content>
            </Card>
          )}

          <FlatList
            data={playlists}
            renderItem={renderPlaylistItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {activeTab === 'favorites' && (
        <View style={styles.content}>
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#1DB954',
  },
  tabText: {
    fontSize: 16,
    color: '#B3B3B3',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  createPlaylistContainer: {
    marginBottom: 20,
  },
  createButton: {
    borderRadius: 25,
    backgroundColor: '#1DB954',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  createCard: {
    backgroundColor: '#1E1E1E',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#1DB954',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1DB954',
  },
  itemCard: {
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
  },
});

export default LibraryScreen;