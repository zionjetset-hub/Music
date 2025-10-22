#!/bin/bash

# Build script for iOS App
set -e

echo "🚀 Building iOS App..."

# Navigate to mobile directory
cd mobile

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install iOS dependencies
echo "📱 Installing iOS dependencies..."
cd ios
pod install
cd ..

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd ios
xcodebuild clean -workspace MusicApp.xcworkspace -scheme MusicApp
cd ..

# Build for release
echo "🔨 Building for release..."
cd ios
xcodebuild -workspace MusicApp.xcworkspace \
           -scheme MusicApp \
           -configuration Release \
           -destination generic/platform=iOS \
           -archivePath MusicApp.xcarchive \
           archive

# Export IPA
echo "📦 Exporting IPA..."
xcodebuild -exportArchive \
           -archivePath MusicApp.xcarchive \
           -exportPath ../dist/ios \
           -exportOptionsPlist ExportOptions.plist
cd ..

echo "✅ iOS build completed successfully!"
echo "📱 IPA location: dist/ios/MusicApp.ipa"