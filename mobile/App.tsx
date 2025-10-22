import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export default function App() {
  const [statusText, setStatusText] = useState<string>('');

  useEffect(() => {
    if (!API_URL) {
      setStatusText('Set EXPO_PUBLIC_API_URL to your backend.');
      return;
    }
    const controller = new AbortController();
    const tryHealth = async () => {
      try {
        const response = await fetch(`${API_URL.replace(/\/$/, '')}/health`, {
          signal: controller.signal,
        });
        if (response.ok) {
          const text = await response.text();
          setStatusText(text || 'Backend is reachable.');
        } else {
          setStatusText(`Backend responded with ${response.status}.`);
        }
      } catch (err) {
        setStatusText('Could not reach backend.');
      }
    };
    void tryHealth();
    return () => controller.abort();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Music</Text>
        <Text style={styles.subtitle}>Your global distribution app</Text>
        <View style={styles.card}>
          <Text style={styles.label}>API URL</Text>
          <Text style={styles.code}>{API_URL || 'not set'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Backend status</Text>
          <Text style={styles.code}>{statusText || 'checking...'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b132b',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    color: '#f0f4f8',
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#d9e2ec',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1c2541',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    color: '#9fb3c8',
    marginBottom: 6,
  },
  code: {
    color: '#f0f4f8',
    fontFamily: 'System',
  },
});
