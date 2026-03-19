# FloWord

A two-player online association game. Each player picks a secret word, then you try to type the **same** association word. Match and you win; get a random encouraging quote when you don’t.

## How to run

1. Install dependencies: `npm install`
2. Configure Firebase (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)) and add your `.env` with `VITE_FIREBASE_*` variables.
3. Start the app: `npm run dev`
4. Open the app in two browsers (or two devices), create a room on one, join with the 6-letter code on the other.

## Rules

**Step 1 — Baseline**  
Both players privately enter a random word. Only you see your word until both have submitted.

**Step 2 — First association**  
The two baseline words are revealed. Both players type one word that links them (e.g. “fruit” for “apple” and “orange”). Submit independently; if you finish first, you see “Waiting for other player.” The round advances only when **both** have submitted.

**Step 3 — Second association**  
If you didn’t match in Step 2, the prompt changes to the two words you just entered. Again, both players type an association for **those** words. Same flow: submit when ready, wait for the other if needed. You’ll see a random encouraging quote from the previous attempt.

**Step 4 — Result**  
- **Match:** You see a win screen and a short celebration. Same word, similar words (e.g. religious / religion), or small typos (e.g. Door / Dor) all count as a match.
- **No match after both attempts:** Game over screen with “Better luck next time” and another random encouraging quote. Play again to start from Step 1 with new words.

## Tech

- React + Vite
- Firebase (Anonymous Auth + Firestore) for rooms and real-time sync
- Mobile-friendly UI
