import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Music App</Text>
      <Text>Welcome! Replace this with your UI.</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
