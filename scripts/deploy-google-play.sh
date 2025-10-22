#!/bin/bash

# Deploy to Google Play Store
set -e

echo "🚀 Deploying to Google Play Store..."

# Check if fastlane is installed
if ! command -v fastlane &> /dev/null; then
    echo "❌ Fastlane is not installed. Installing..."
    gem install fastlane
fi

# Navigate to mobile directory
cd mobile

# Create fastlane directory if it doesn't exist
mkdir -p fastlane

# Create Fastfile for Google Play
cat > fastlane/Fastfile << 'EOF'
default_platform(:android)

platform :android do
  desc "Deploy to Google Play Store"
  lane :deploy do
    gradle(
      task: "bundle",
      build_type: "Release"
    )
    
    upload_to_play_store(
      track: 'internal',
      aab: 'android/app/build/outputs/bundle/release/app-release.aab',
      skip_upload_apk: true,
      skip_upload_metadata: false,
      skip_upload_images: false,
      skip_upload_screenshots: false
    )
  end
end
EOF

# Create Appfile
cat > fastlane/Appfile << EOF
json_key_file("google-play-key.json")
package_name("com.musicapp")
EOF

# Run fastlane deployment
echo "📱 Running fastlane deployment..."
fastlane android deploy

echo "✅ Google Play Store deployment completed successfully!"