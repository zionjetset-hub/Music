import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Account Settings',
      icon: 'settings',
      onPress: () => Alert.alert('Coming Soon', 'Account settings will be available soon'),
    },
    {
      title: 'Downloaded Music',
      icon: 'download',
      onPress: () => Alert.alert('Coming Soon', 'Downloaded music will be available soon'),
    },
    {
      title: 'Privacy Policy',
      icon: 'privacy-tip',
      onPress: () => Alert.alert('Coming Soon', 'Privacy policy will be available soon'),
    },
    {
      title: 'Terms of Service',
      icon: 'description',
      onPress: () => Alert.alert('Coming Soon', 'Terms of service will be available soon'),
    },
    {
      title: 'Help & Support',
      icon: 'help',
      onPress: () => Alert.alert('Coming Soon', 'Help & support will be available soon'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <Icon name="person" size={50} color="#1DB954" />
              </View>
              <View style={styles.userInfo}>
                <Title style={styles.userName}>{user?.username || 'User'}</Title>
                <Paragraph style={styles.userEmail}>{user?.email || 'user@example.com'}</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <Card key={index} style={styles.menuCard}>
            <Card.Content>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                <Icon name={item.icon} size={24} color="#1DB954" />
                <Text style={styles.menuText}>{item.title}</Text>
                <Icon name="chevron-right" size={24} color="#B3B3B3" />
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.logoutSection}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.logoutButtonText}
        >
          Logout
        </Button>
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileCard: {
    backgroundColor: '#1E1E1E',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#B3B3B3',
  },
  menuSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuCard: {
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
  },
  logoutSection: {
    padding: 20,
  },
  logoutButton: {
    borderColor: '#FF4444',
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#FF4444',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;