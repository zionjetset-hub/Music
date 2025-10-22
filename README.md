# Music

Distribute the Music app globally across major app stores.

## What was added

- Backend legal pages served at `/legal/privacy` and `/legal/terms`
- Expo mobile app scaffold in `mobile/` with EAS config
- Store listing metadata templates under `store/apple` and `store/google`
- GitHub Actions workflow to build and submit via EAS

## Next steps

1. Replace placeholders in `mobile/app.json` for bundle identifiers and packages
2. Add real descriptions/screenshots in `store/*/metadata`
3. Add credentials in `mobile/eas.json` and repo secrets (`EXPO_TOKEN`)
4. Run backend locally: `cd backend && npm install && npm start`
5. Run app locally: `cd mobile && npm install && npm start`
