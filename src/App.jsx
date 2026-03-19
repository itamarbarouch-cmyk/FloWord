import { useState, useEffect, useCallback } from 'react'
import { auth, ensureAnonymousAuth } from './firebase'
import {
  createRoom,
  joinRoom,
  subscribeRoom,
  subscribeWord,
  setSecretWord,
  startRound,
  submitAssociation,
  playAgain as roomPlayAgain,
} from './room'
import { Lock, Eye, Zap, Copy, Sparkles, SendHorizontal, LogOut } from 'lucide-react'
import { Celebration } from './Celebration'
import { LandingScreen } from './components/LandingScreen'
import { WaitingForPlayer } from './components/WaitingForPlayer'
import './App.css'

const PHASE = {
  SECRET: 'secret',
  REVEAL: 'reveal',
  ASSOCIATION: 'association',
  RESULT: 'result',
}

const REVEALED_PHASES = [PHASE.REVEAL, PHASE.ASSOCIATION, PHASE.RESULT]

function App() {
  const [authReady, setAuthReady] = useState(false)
  const [user, setUser] = useState(null)
  const [view, setView] = useState('landing') // 'landing' | 'create' | 'join' | 'game'
  const [roomCode, setRoomCode] = useState('')
  const [room, setRoom] = useState(null)
  const [word1, setWord1] = useState('')
  const [word2, setWord2] = useState('')
  const [joinInput, setJoinInput] = useState('')
  const [joinError, setJoinError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [mySecret, setMySecret] = useState('')
  const [myGuess, setMyGuess] = useState('')
  const [roomCodeCopied, setRoomCodeCopied] = useState(false)

  const isPlayer1 = user && room && room.player1Id === user.uid
  const isPlayer2 = user && room && room.player2Id === user.uid
  const me = isPlayer1 ? 1 : isPlayer2 ? 2 : 0
  const phase = room?.phase || ''
  const showWords = REVEALED_PHASES.includes(phase)
  const player1Word = showWords ? word1 : ''
  const player2Word = showWords ? word2 : ''
  const promptWord1 = room?.promptWord1 ?? player1Word
  const promptWord2 = room?.promptWord2 ?? player2Word

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) setUser(u)
      setAuthReady(true)
    })
    return () => unsub()
  }, [])

  const handleCreateRoom = useCallback(async () => {
    setJoinError('')
    setIsCreating(true)
    try {
      const currentUser = await ensureAnonymousAuth()
      const uid = currentUser?.uid ?? auth.currentUser?.uid
      if (!uid) {
        throw new Error('Could not sign in')
      }
      setUser(currentUser ?? auth.currentUser)
      const code = await createRoom(uid)
      setRoomCode(code)
      setView('game')
    } catch (e) {
      setJoinError(e?.message || 'Failed to create room')
      setView('landing')
    } finally {
      setIsCreating(false)
    }
  }, [])

  const handleJoinRoom = useCallback(async (e) => {
    e.preventDefault()
    const code = joinInput.trim().toUpperCase()
    if (!code) return
    setJoinError('')
    setIsCreating(true)
    try {
      const currentUser = await ensureAnonymousAuth()
      const uid = currentUser?.uid ?? auth.currentUser?.uid
      if (!uid) {
        throw new Error('Could not sign in')
      }
      setUser(currentUser ?? auth.currentUser)
      const result = await joinRoom(code, uid)
      if (result.error) {
        setJoinError(result.error)
        return
      }
      setRoomCode(result.roomCode)
      setJoinInput('')
      setView('game')
    } catch (err) {
      setJoinError(err?.message || 'Failed to join room')
    } finally {
      setIsCreating(false)
    }
  }, [joinInput])

  useEffect(() => {
    if (!roomCode || view !== 'game') return
    const unsub = subscribeRoom(roomCode, setRoom)
    return () => unsub()
  }, [roomCode, view])

  useEffect(() => {
    if (!roomCode || !room || !showWords) return
    const unsub1 = subscribeWord(roomCode, 'p1', setWord1)
    const unsub2 = subscribeWord(roomCode, 'p2', setWord2)
    return () => {
      unsub1()
      unsub2()
    }
  }, [roomCode, room, showWords])

  const handleSecretSubmit = async (e) => {
    e.preventDefault()
    if (!mySecret.trim() || !(isPlayer1 || isPlayer2)) return
    try {
      await setSecretWord(roomCode, isPlayer1 ? 'p1' : 'p2', mySecret)
      setMySecret('')
    } catch (err) {
      setJoinError(err?.message)
    }
  }

  const handleStartRound = async () => {
    try {
      await startRound(roomCode)
    } catch (err) {
      setJoinError(err.message)
    }
  }

  const handleAssociationSubmit = async (e) => {
    e.preventDefault()
    if (!myGuess.trim() || !(isPlayer1 || isPlayer2)) return
    try {
      await submitAssociation(roomCode, isPlayer1 ? 'p1' : 'p2', myGuess)
      setMyGuess('')
    } catch (err) {
      setJoinError(err?.message)
    }
  }

  const handlePlayAgain = async () => {
    try {
      await roomPlayAgain(roomCode)
    } catch (err) {
      setJoinError(err.message)
    }
  }

  const leaveRoom = () => {
    setRoomCode('')
    setRoom(null)
    setWord1('')
    setWord2('')
    setView('landing')
    setJoinError('')
    setMySecret('')
    setMyGuess('')
  }

  if (!authReady) {
    return (
      <div className="floword">
        <h1 className="floword-title">FloWord</h1>
        <p className="floword-loading">Loading…</p>
      </div>
    )
  }

  if (view === 'landing') {
    return (
      <LandingScreen
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        inputCode={joinInput}
        setInputCode={(value) => {
          setJoinInput(value)
          setJoinError('')
        }}
        error={joinError}
        isCreating={isCreating}
      />
    )
  }

  if (view === 'game' && !room) {
    return (
      <div className="floword">
        <h1 className="floword-title">FloWord</h1>
        <p className="floword-loading">Connecting to room…</p>
      </div>
    )
  }

  if (view === 'game' && room && !room.player2Id && isPlayer1) {
    return (
      <div className="floword">
        <h1 className="floword-title">FloWord</h1>
        <section className="floword-roomcode-card">
          <h2 className="floword-roomcode-heading">Room code</h2>
          <div className="floword-roomcode-row">
            <p className="floword-roomcode-value" aria-label={`Room code: ${roomCode}`}>
              {roomCode}
            </p>
            <button
              type="button"
              className="floword-roomcode-copy"
              onClick={() => {
                navigator.clipboard.writeText(roomCode).then(() => {
                  setRoomCodeCopied(true)
                  setTimeout(() => setRoomCodeCopied(false), 2000)
                })
              }}
              aria-label="Copy room code"
              title={roomCodeCopied ? 'Copied!' : 'Copy code'}
            >
              <Copy size={20} aria-hidden />
              {roomCodeCopied && <span className="floword-roomcode-copied">Copied!</span>}
            </button>
          </div>
          <p className="floword-roomcode-hint">
            Share this code with your friend. When they join, the game will start.
          </p>
          <button type="button" className="floword-roomcode-cancel" onClick={leaveRoom}>
            Cancel
          </button>
        </section>
      </div>
    )
  }

  if (view === 'game' && room && !room.player2Id && isPlayer2) {
    return (
      <div className="floword">
        <h1 className="floword-title">FloWord</h1>
        <p className="floword-loading">Waiting for room…</p>
      </div>
    )
  }

  return (
    <div className={`floword ${phase === PHASE.ASSOCIATION || phase === PHASE.RESULT ? 'floword-association-bg' : ''}`}>
      <h1 className="floword-title">FloWord</h1>
      <p className="floword-room-badge">Room {roomCode}</p>

      {joinError && <p className="floword-error floword-error-inline">{joinError}</p>}

      {phase === PHASE.SECRET && ((isPlayer1 && room.player1SecretDone) || (isPlayer2 && room.player2SecretDone)) && (
        <WaitingForPlayer />
      )}

      {phase === PHASE.SECRET && !(isPlayer1 && room.player1SecretDone) && !(isPlayer2 && room.player2SecretDone) && (
        <section className="floword-secret-card">
          <Lock className="floword-secret-icon" size={40} strokeWidth={1.5} aria-hidden />
          <h2 className="floword-secret-title">Secret Word</h2>
          <p className="floword-secret-subtitle">Enter a baseline word to start the game</p>
          <form onSubmit={handleSecretSubmit} className="floword-secret-form">
              <input
                type="text"
                className="floword-secret-input"
                placeholder="Type your word..."
                value={mySecret}
                onChange={(e) => setMySecret(e.target.value)}
                autoComplete="off"
                autoFocus
              />
              <button type="submit" className="floword-secret-btn" disabled={!mySecret.trim()}>
                Submit Secret Word
              </button>
            </form>
        </section>
      )}

      {phase === PHASE.REVEAL && (
        <section className="floword-reveal-card">
          <Eye className="floword-reveal-icon" size={40} strokeWidth={1.5} aria-hidden />
          <h2 className="floword-reveal-title">Words Revealed</h2>
          <p className="floword-reveal-subtitle">Here are your baseline words</p>
          <div className="floword-reveal-rows">
            <div className="floword-reveal-row">
              <span className="floword-reveal-label">PLAYER 1</span>
              <span className="floword-reveal-word">{player1Word || '—'}</span>
            </div>
            <div className="floword-reveal-row">
              <span className="floword-reveal-label">PLAYER 2</span>
              <span className="floword-reveal-word">{player2Word || '—'}</span>
            </div>
          </div>
          <button type="button" className="floword-reveal-cta" onClick={handleStartRound}>
            Ready for Association
            <Zap className="floword-reveal-cta-icon" size={20} aria-hidden />
          </button>
        </section>
      )}

      {phase === PHASE.ASSOCIATION && ((isPlayer1 && room.player1Guess !== '') || (isPlayer2 && room.player2Guess !== '')) && (
        <WaitingForPlayer />
      )}

      {phase === PHASE.ASSOCIATION && !(isPlayer1 && room.player1Guess !== '') && !(isPlayer2 && room.player2Guess !== '') && (
        <section className="floword-association-card">
          <h2 className="floword-association-title">
            {room.attempt === 1 ? 'First Attempt' : 'Second Attempt - Last Chance'}
          </h2>
          <p className="floword-association-words">
            {promptWord1 || '—'} · {promptWord2 || '—'}
          </p>
          <form onSubmit={handleAssociationSubmit} className="floword-association-form">
            <p className="floword-association-prompt">Type your association word</p>
            <div className="floword-association-input-wrap">
              <input
                type="text"
                className="floword-association-input"
                placeholder="Association word"
                value={myGuess}
                onChange={(e) => setMyGuess(e.target.value)}
                autoComplete="off"
                autoFocus
              />
              <Sparkles className="floword-association-input-icon" size={20} aria-hidden />
            </div>
            <button type="submit" className="floword-association-btn" disabled={!myGuess.trim()}>
              Submit
              <SendHorizontal size={20} className="floword-association-btn-icon" aria-hidden />
            </button>
          </form>
        </section>
      )}

      {phase === PHASE.RESULT && (
        <>
          {room.result === 'win' && <Celebration />}
          <section className="floword-result-card">
            <p className="floword-result-badge">Result</p>
            {room.result === 'win' ? (
              <>
                <p className="floword-result-title floword-win-title">You matched!</p>
                <p className="floword-result-word">Association: {room.player1Guess}</p>
                {room.lastQuote && (
                  <p className="floword-result-quote">{room.lastQuote}</p>
                )}
              </>
            ) : (
              <>
                <p className="floword-gameover-title">Game over</p>
                <p className="floword-result-sub">Better luck next time.</p>
                <p className="floword-result-answers">
                  P1: {room.player1Guess} · P2: {room.player2Guess}
                </p>
                {room.lastQuote && (
                  <p className="floword-result-quote">{room.lastQuote}</p>
                )}
              </>
            )}
            <button type="button" className="floword-result-play-btn" onClick={handlePlayAgain}>
              Play again
            </button>
          </section>
        </>
      )}

      {view === 'game' && room && (
        <button type="button" className="floword-leave-btn" onClick={leaveRoom}>
          <LogOut size={18} aria-hidden />
          Leave room
        </button>
      )}
    </div>
  )
}

export default App
