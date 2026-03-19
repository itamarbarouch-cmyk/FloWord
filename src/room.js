import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'

const ROOM_CODES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0,O,1,I

/** Same word, one contains the other (religious/religion), or small typo (Door/Dor) counts as match */
function matchesAssociation(a, b) {
  const x = a.toLowerCase().trim()
  const y = b.toLowerCase().trim()
  if (!x || !y) return false
  if (x === y) return true
  if (x.length >= 3 && y.length >= 3 && (x.includes(y) || y.includes(x))) return true
  const maxLen = Math.max(x.length, y.length)
  const minLen = Math.min(x.length, y.length)
  if (minLen < 2) return false
  if (maxLen - minLen > 2) return false
  const d = levenshtein(x, y)
  return d <= 2
}

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      )
    }
  }
  return dp[m][n]
}

const ENCOURAGING_QUOTES = [
  'If at first you don\'t succeed, try try again.',
  'Every expert was once a beginner.',
  'You\'re one step closer than before.',
  'The best view comes after the hardest climb.',
  'Keep going — you\'ve got this.',
  'Mistakes are proof that you\'re trying.',
  'Progress, not perfection.',
  'One more try could be the one.',
  'Stay curious. Next round might be yours.',
  'It\'s not over until you win.',
]

const CELEBRATORY_QUOTES = [
  'You did it! What a match.',
  'Great minds think alike.',
  'That\'s the spirit!',
  'Perfect sync.',
  'You two are on the same wavelength.',
  'Boom! Nailed it.',
  'Teamwork makes the dream work.',
  'Unstoppable.',
]

function randomQuote() {
  return ENCOURAGING_QUOTES[Math.floor(Math.random() * ENCOURAGING_QUOTES.length)]
}

function randomCelebratoryQuote() {
  return CELEBRATORY_QUOTES[Math.floor(Math.random() * CELEBRATORY_QUOTES.length)]
}
const CODE_LENGTH = 6

export function generateRoomCode() {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ROOM_CODES[Math.floor(Math.random() * ROOM_CODES.length)]
  }
  return code
}

export async function createRoom(uid) {
  let code
  let exists = true
  while (exists) {
    code = generateRoomCode()
    const ref = doc(db, 'rooms', code)
    const snap = await getDoc(ref)
    exists = snap.exists()
  }
  const ref = doc(db, 'rooms', code)
  await setDoc(ref, {
    player1Id: uid,
    player2Id: null,
    phase: 'secret',
    attempt: 1,
    player1SecretDone: false,
    player2SecretDone: false,
    player1Guess: '',
    player2Guess: '',
    promptWord1: '',
    promptWord2: '',
    lastQuote: null,
    result: null,
    createdAt: serverTimestamp(),
  })
  return code
}

export async function joinRoom(roomCode, uid) {
  const ref = doc(db, 'rooms', roomCode.toUpperCase().trim())
  const snap = await getDoc(ref)
  if (!snap.exists()) return { error: 'Room not found' }
  const data = snap.data()
  if (data.player2Id) return { error: 'Room is full' }
  if (data.player1Id === uid) return { error: 'You already created this room' }
  await updateDoc(ref, { player2Id: uid })
  return { roomCode: ref.id }
}

export function subscribeRoom(roomCode, onUpdate) {
  const ref = doc(db, 'rooms', roomCode)
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      onUpdate(null)
      return
    }
    const data = snap.data()
    onUpdate({
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toMillis?.(),
    })
  })
}

export function subscribeWord(roomCode, player, onUpdate) {
  const ref = doc(db, 'rooms', roomCode, 'words', player)
  return onSnapshot(ref, (snap) => {
    onUpdate(snap.exists() ? snap.data().word : '')
  })
}

export async function setSecretWord(roomCode, player, word) {
  const roomRef = doc(db, 'rooms', roomCode)
  const wordRef = doc(db, 'rooms', roomCode, 'words', player)
  const doneField = player === 'p1' ? 'player1SecretDone' : 'player2SecretDone'
  const batch = writeBatch(db)
  batch.set(wordRef, { word: (word || '').trim() })
  batch.update(roomRef, { [doneField]: true })
  await batch.commit()
  const snap = await getDoc(roomRef)
  if (!snap.exists()) return
  const data = snap.data()
  if (data.player1SecretDone && data.player2SecretDone) {
    await updateDoc(roomRef, { phase: 'reveal' })
  }
}

export async function startRound(roomCode) {
  const roomRef = doc(db, 'rooms', roomCode)
  const w1Ref = doc(db, 'rooms', roomCode, 'words', 'p1')
  const w2Ref = doc(db, 'rooms', roomCode, 'words', 'p2')
  const [roomSnap, s1, s2] = await Promise.all([
    getDoc(roomRef),
    getDoc(w1Ref),
    getDoc(w2Ref),
  ])
  if (!roomSnap.exists()) return
  const word1 = s1.exists() ? (s1.data().word || '').trim() : ''
  const word2 = s2.exists() ? (s2.data().word || '').trim() : ''
  await updateDoc(roomRef, {
    phase: 'association',
    attempt: 1,
    player1Guess: '',
    player2Guess: '',
    promptWord1: word1,
    promptWord2: word2,
    lastQuote: null,
    result: null,
  })
}

export async function submitAssociation(roomCode, player, guess) {
  const ref = doc(db, 'rooms', roomCode)
  const field = player === 'p1' ? 'player1Guess' : 'player2Guess'
  await updateDoc(ref, { [field]: (guess || '').trim() })
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data()
  const p1 = (data.player1Guess || '').trim()
  const p2 = (data.player2Guess || '').trim()
  if (p1 === '' || p2 === '') return
  if (matchesAssociation(p1, p2)) {
    await updateDoc(ref, {
      phase: 'result',
      result: 'win',
      lastQuote: randomCelebratoryQuote(),
    })
    return
  }
  if (data.attempt >= 2) {
    await updateDoc(ref, {
      phase: 'result',
      result: 'loss',
      lastQuote: randomQuote(),
    })
    return
  }
  await updateDoc(ref, {
    attempt: 2,
    promptWord1: p1,
    promptWord2: p2,
    player1Guess: '',
    player2Guess: '',
    lastQuote: null,
  })
}

export async function playAgain(roomCode) {
  const roomRef = doc(db, 'rooms', roomCode)
  const p1Ref = doc(db, 'rooms', roomCode, 'words', 'p1')
  const p2Ref = doc(db, 'rooms', roomCode, 'words', 'p2')
  const batch = writeBatch(db)
  batch.update(roomRef, {
    phase: 'secret',
    attempt: 1,
    player1SecretDone: false,
    player2SecretDone: false,
    player1Guess: '',
    player2Guess: '',
    promptWord1: '',
    promptWord2: '',
    lastQuote: null,
    result: null,
  })
  batch.delete(p1Ref)
  batch.delete(p2Ref)
  await batch.commit()
}
