# FloWord – Firebase setup

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com).

2. **Add a Web app** in Project settings → Your apps. Copy the config object.

3. **Enable Anonymous Auth**: Authentication → Sign-in method → Anonymous → Enable.

4. **Create Firestore database**: Build → Firestore Database → Create database (start in test mode for quick setup; then deploy rules below).

5. **Environment variables**: Copy `.env.example` to `.env` and set:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

6. **Deploy Firestore rules**: Install Firebase CLI (`npm i -g firebase-tools`), run `firebase login`, then:
   ```bash
   firebase init firestore
   ```
   Choose your project and replace the generated `firestore.rules` with the one in this repo. Then:
   ```bash
   firebase deploy --only firestore:rules
   ```

After that, run `npm run dev` and open the app. Create a room, share the code with a friend (on another device or browser), and play.
