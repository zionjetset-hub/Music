#!/bin/bash

# Deploy to Apple App Store
set -e

echo "🚀 Deploying to Apple App Store..."

# Check if fastlane is installed
if ! command -v fastlane &> /dev/null; then
    echo "❌ Fastlane is not installed. Installing..."
    gem install fastlane
fi

# Navigate to mobile directory
cd mobile

# Create fastlane directory if it doesn't exist
mkdir -p fastlane

# Create Fastfile for App Store
cat > fastlane/Fastfile << 'EOF'
default_platform(:ios)

platform :ios do
  desc "Deploy to Apple App Store"
  lane :deploy do
    build_app(
      workspace: "ios/MusicApp.xcworkspace",
      scheme: "MusicApp",
      configuration: "Release",
      export_method: "app-store"
    )
    
    upload_to_app_store(
      force: true,
      skip_metadata: false,
      skip_screenshots: false
    )
  end
end
EOF

# Create Appfile
cat > fastlane/Appfile << EOF
app_identifier("com.musicapp")
apple_id("your-apple-id@example.com")
itc_team_id("YOUR_TEAM_ID")
team_id("YOUR_TEAM_ID")
EOF

# Run fastlane deployment
echo "📱 Running fastlane deployment..."
fastlane ios deploy

echo "✅ Apple App Store deployment completed successfully!"