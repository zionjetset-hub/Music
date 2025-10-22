# Music Distribution App

🎵 **Your music, everywhere** - A complete music streaming platform with mobile apps for iOS, Android, and web.

## 🌟 Features

- **Cross-Platform**: Native mobile apps for iOS and Android
- **Music Streaming**: High-quality audio streaming with offline support
- **Playlist Management**: Create, share, and manage personal playlists
- **Smart Recommendations**: AI-powered music discovery
- **Social Features**: Share music with friends and discover new artists
- **Offline Listening**: Download songs for offline enjoyment
- **User Accounts**: Secure authentication and personalized experience

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API with SQLite database
- User authentication and authorization
- Music catalog management
- Playlist and favorites system
- Real-time music streaming

### Mobile Apps (React Native)
- iOS and Android native apps
- Modern, intuitive user interface
- Offline music playback
- Social sharing features
- Push notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- React Native development environment
- Docker (optional, for easy deployment)

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Mobile App Setup
```bash
cd mobile
npm install
# For iOS
cd ios && pod install && cd ..
npm run ios
# For Android
npm run android
```

### Docker Deployment
```bash
docker-compose up -d
```

## 📱 App Store Deployment

This project includes complete configurations for publishing to all major app stores:

- **Google Play Store**: Android APK and AAB builds
- **Apple App Store**: iOS app with proper metadata
- **Microsoft Store**: Windows app configuration

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🎨 App Store Assets

All required assets and metadata are included:
- App icons for all platforms
- Screenshots and promotional graphics
- Store descriptions and keywords
- Privacy policy and terms of service
- Localization files

## 🔧 Configuration

### Backend Configuration
- Environment variables in `backend/.env`
- Database configuration
- API endpoints and middleware

### Mobile App Configuration
- API base URL configuration
- App icons and branding
- Platform-specific settings

## 📊 Features Overview

### User Management
- User registration and authentication
- Profile management
- Secure password handling

### Music Features
- Song catalog with metadata
- Genre-based browsing
- Search functionality
- Playlist creation and management
- Favorites system

### Social Features
- Share playlists
- Follow other users
- Discover trending music
- User-generated content

## 🛠️ Development

### Backend API Endpoints
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get song by ID
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/:id/playlists` - Get user playlists
- `POST /api/playlists` - Create playlist

### Mobile App Structure
- Context-based state management
- Navigation with React Navigation
- Music player with React Native Track Player
- Material Design components

## 📦 Build Scripts

- `scripts/build-android.sh` - Build Android APK
- `scripts/build-ios.sh` - Build iOS app
- `scripts/deploy-backend.sh` - Deploy backend to production
- `scripts/deploy-google-play.sh` - Deploy to Google Play Store
- `scripts/deploy-app-store.sh` - Deploy to Apple App Store

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting

## 📈 Performance

- Optimized database queries
- Image caching and compression
- Lazy loading for large lists
- Background music playback
- Efficient state management

## 🌐 Internationalization

- Multi-language support ready
- Localized app store descriptions
- RTL language support
- Cultural adaptation

## 📱 Supported Platforms

- **iOS**: 12.0+
- **Android**: 5.0+ (API level 21+)
- **Web**: Modern browsers
- **Windows**: 10/11 (via Microsoft Store)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Documentation: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Issues: GitHub Issues
- Email: support@musicapp.com

## 🎯 Roadmap

- [ ] Web application
- [ ] Desktop apps (Windows, macOS, Linux)
- [ ] Advanced music recommendations
- [ ] Live streaming features
- [ ] Artist collaboration tools
- [ ] Music creation tools

---

**Ready to launch your music app to the world?** 🚀

Follow the deployment guide to publish your app to all major app stores and start building your music community!