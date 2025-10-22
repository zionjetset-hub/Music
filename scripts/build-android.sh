#!/bin/bash

# Build script for Android APK
set -e

echo "🚀 Building Android APK..."

# Navigate to mobile directory
cd mobile

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Build release APK
echo "🔨 Building release APK..."
cd android
./gradlew assembleRelease
cd ..

# Move APK to dist folder
echo "📁 Moving APK to distribution folder..."
mkdir -p ../dist/android
cp android/app/build/outputs/apk/release/app-release.apk ../dist/android/music-app-release.apk

echo "✅ Android build completed successfully!"
echo "📱 APK location: dist/android/music-app-release.apk"