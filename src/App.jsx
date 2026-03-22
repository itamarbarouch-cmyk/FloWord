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
  JoinRoomError,
} from './room'
import { Lock, Eye, Zap, Copy, Sparkles, SendHorizontal, LogOut } from 'lucide-react'
import { Celebration } from './Celebration'
import { LandingScreen } from './components/LandingScreen'
import { WaitingForPlayer } from './components/WaitingForPlayer'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { FlowordHeaderMark } from './components/FlowordMark'
import { useI18n } from './i18n/I18nContext'
import './App.css'

const JOIN_ERROR_I18N = {
  [JoinRoomError.NOT_FOUND]: 'errors.roomNotFound',
  [JoinRoomError.FULL]: 'errors.roomFull',
  [JoinRoomError.ALREADY_CREATOR]: 'errors.alreadyCreator',
}

const PHASE = {
  SECRET: 'secret',
  REVEAL: 'reveal',
  ASSOCIATION: 'association',
  RESULT: 'result',
}

const REVEALED_PHASES = [PHASE.REVEAL, PHASE.ASSOCIATION, PHASE.RESULT]

/** Same trimmed text → show once; different text but still a game match → "p1/p2". */
function formatWinAssociationWords(p1, p2) {
  const a = (p1 ?? '').trim()
  const b = (p2 ?? '').trim()
  if (a === b) return a || b
  if (!a) return b
  if (!b) return a
  return `${a}/${b}`
}

function App() {
  const { t } = useI18n()
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
  const [linkCopied, setLinkCopied] = useState(false)

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

  // Prefill join input from ?room=CODE in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const room = params.get('room')
    if (room && typeof room === 'string') {
      setJoinInput(room.trim().toUpperCase().slice(0, 6))
    }
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
      setJoinError(e?.message === 'Could not sign in' ? 'errors.signIn' : 'errors.createRoom')
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
        setJoinError(JOIN_ERROR_I18N[result.error] || 'errors.joinRoom')
        return
      }
      setRoomCode(result.roomCode)
      setJoinInput('')
      setView('game')
    } catch (err) {
      setJoinError(
        err?.message === 'Could not sign in' ? 'errors.signIn' : 'errors.joinRoom'
      )
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
      setJoinError('errors.generic')
    }
  }

  const handleStartRound = async () => {
    try {
      await startRound(roomCode)
    } catch (err) {
      setJoinError('errors.generic')
    }
  }

  const handleAssociationSubmit = async (e) => {
    e.preventDefault()
    if (!myGuess.trim() || !(isPlayer1 || isPlayer2)) return
    try {
      await submitAssociation(roomCode, isPlayer1 ? 'p1' : 'p2', myGuess)
      setMyGuess('')
    } catch (err) {
      setJoinError('errors.generic')
    }
  }

  const handlePlayAgain = async () => {
    try {
      await roomPlayAgain(roomCode)
    } catch (err) {
      setJoinError('errors.generic')
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
      <>
        <LanguageSwitcher />
        <div className="floword">
          <FlowordHeaderMark size={40} />
          <p className="floword-loading">{t('app.loading')}</p>
        </div>
      </>
    )
  }

  if (view === 'landing') {
    return (
      <>
        <LanguageSwitcher />
        <LandingScreen
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          inputCode={joinInput}
          setInputCode={(value) => {
            setJoinInput(value)
            setJoinError('')
          }}
          errorKey={joinError || null}
          isCreating={isCreating}
        />
      </>
    )
  }

  if (view === 'game' && !room) {
    return (
      <>
        <LanguageSwitcher />
        <div className="floword">
          <FlowordHeaderMark size={40} />
          <p className="floword-loading">{t('app.connectingRoom')}</p>
        </div>
      </>
    )
  }

  if (view === 'game' && room && !room.player2Id && isPlayer1) {
    return (
      <>
        <LanguageSwitcher />
        <div className="floword">
          <FlowordHeaderMark size={40} />
          <section className="floword-roomcode-card">
            <h2 className="floword-roomcode-heading">{t('roomCode.heading')}</h2>
            <div className="floword-roomcode-row">
              <p className="floword-roomcode-value" aria-label={`${t('roomCode.heading')}: ${roomCode}`}>
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
                aria-label={t('roomCode.copyCodeAria')}
                title={roomCodeCopied ? t('roomCode.copied') : t('roomCode.copyCodeTitle')}
              >
                <Copy size={20} aria-hidden />
                {roomCodeCopied && <span className="floword-roomcode-copied">{t('roomCode.copied')}</span>}
              </button>
            </div>
            <div className="floword-roomcode-share">
              <p className="floword-roomcode-share-label">{t('roomCode.shareLink')}</p>
              <p className="floword-roomcode-share-url" title={`${window.location.origin}${window.location.pathname}?room=${roomCode}`}>
                {`${window.location.origin}${window.location.pathname}?room=${roomCode}`}
              </p>
              <button
                type="button"
                className="floword-roomcode-copy floword-roomcode-copy-link"
                onClick={() => {
                  const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`
                  navigator.clipboard.writeText(url).then(() => {
                    setLinkCopied(true)
                    setTimeout(() => setLinkCopied(false), 2000)
                  })
                }}
                aria-label={t('roomCode.copyLinkAria')}
                title={linkCopied ? t('roomCode.copied') : t('roomCode.copyLink')}
              >
                <Copy size={20} aria-hidden />
                {linkCopied ? <span className="floword-roomcode-copied">{t('roomCode.copied')}</span> : t('roomCode.copyLink')}
              </button>
            </div>
            <p className="floword-roomcode-hint">{t('roomCode.hint')}</p>
            <button type="button" className="floword-roomcode-cancel" onClick={leaveRoom}>
              {t('roomCode.cancel')}
            </button>
          </section>
        </div>
      </>
    )
  }

  if (view === 'game' && room && !room.player2Id && isPlayer2) {
    return (
      <>
        <LanguageSwitcher />
        <div className="floword">
          <FlowordHeaderMark size={40} />
          <p className="floword-loading">{t('app.waitingRoom')}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <LanguageSwitcher />
      <div className={`floword ${phase === PHASE.ASSOCIATION || phase === PHASE.RESULT ? 'floword-association-bg' : ''}`}>
      <FlowordHeaderMark size={40} />
      <p className="floword-room-badge">{t('app.roomBadge', { code: roomCode })}</p>

      {joinError && <p className="floword-error floword-error-inline">{t(joinError)}</p>}

      {phase === PHASE.SECRET && ((isPlayer1 && room.player1SecretDone) || (isPlayer2 && room.player2SecretDone)) && (
        <WaitingForPlayer />
      )}

      {phase === PHASE.SECRET && !(isPlayer1 && room.player1SecretDone) && !(isPlayer2 && room.player2SecretDone) && (
        <section className="floword-secret-card">
          <Lock className="floword-secret-icon" size={40} strokeWidth={1.5} aria-hidden />
          <h2 className="floword-secret-title">{t('secret.title')}</h2>
          <p className="floword-secret-subtitle">{t('secret.subtitle')}</p>
          <form onSubmit={handleSecretSubmit} className="floword-secret-form">
              <input
                type="text"
                className="floword-secret-input"
                placeholder={t('secret.placeholder')}
                value={mySecret}
                onChange={(e) => setMySecret(e.target.value)}
                autoComplete="off"
                autoFocus
              />
              <button type="submit" className="floword-secret-btn" disabled={!mySecret.trim()}>
                {t('secret.submit')}
              </button>
            </form>
        </section>
      )}

      {phase === PHASE.REVEAL && (
        <section className="floword-reveal-card">
          <Eye className="floword-reveal-icon" size={40} strokeWidth={1.5} aria-hidden />
          <h2 className="floword-reveal-title">{t('reveal.title')}</h2>
          <p className="floword-reveal-subtitle">{t('reveal.subtitle')}</p>
          <div className="floword-reveal-rows">
            <div className="floword-reveal-row">
              <span className="floword-reveal-label">{t('reveal.player1')}</span>
              <span className="floword-reveal-word">{player1Word || '—'}</span>
            </div>
            <div className="floword-reveal-row">
              <span className="floword-reveal-label">{t('reveal.player2')}</span>
              <span className="floword-reveal-word">{player2Word || '—'}</span>
            </div>
          </div>
          <button type="button" className="floword-reveal-cta" onClick={handleStartRound}>
            {t('reveal.cta')}
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
            {room.attempt === 1 ? t('assoc.attempt1') : t('assoc.attempt2')}
          </h2>
          <p className="floword-association-words">
            {promptWord1 || '—'} · {promptWord2 || '—'}
          </p>
          <form onSubmit={handleAssociationSubmit} className="floword-association-form">
            <p className="floword-association-prompt">{t('assoc.prompt')}</p>
            <div className="floword-association-input-wrap">
              <input
                type="text"
                className="floword-association-input"
                placeholder={t('assoc.placeholder')}
                value={myGuess}
                onChange={(e) => setMyGuess(e.target.value)}
                autoComplete="off"
                autoFocus
              />
              <Sparkles className="floword-association-input-icon" size={20} aria-hidden />
            </div>
            <button type="submit" className="floword-association-btn" disabled={!myGuess.trim()}>
              {t('assoc.submit')}
              <SendHorizontal size={20} className="floword-association-btn-icon" aria-hidden />
            </button>
          </form>
        </section>
      )}

      {phase === PHASE.RESULT && (
        <>
          {room.result === 'win' && <Celebration />}
          <section className="floword-result-card">
            <p className="floword-result-badge">{t('result.badge')}</p>
            {room.result === 'win' ? (
              <>
                <p className="floword-result-title floword-win-title">{t('result.winTitle')}</p>
                <p className="floword-result-word">
                  {t('result.associationLabel', {
                    word: formatWinAssociationWords(room.player1Guess, room.player2Guess),
                  })}
                </p>
                {(room.lastQuoteKey || room.lastQuote) && (
                  <p className="floword-result-quote">
                    {room.lastQuoteKey
                      ? t(`quotes.${room.lastQuoteKey}`)
                      : room.lastQuote}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="floword-result-title floword-gameover-title">{t('result.lossTitle')}</p>
                <p className="floword-result-sub">{t('result.lossSub')}</p>
                <p className="floword-result-answers">
                  {t('result.answers', { p1: room.player1Guess, p2: room.player2Guess })}
                </p>
                {(room.lastQuoteKey || room.lastQuote) && (
                  <p className="floword-result-quote">
                    {room.lastQuoteKey
                      ? t(`quotes.${room.lastQuoteKey}`)
                      : room.lastQuote}
                  </p>
                )}
              </>
            )}
            <button type="button" className="floword-result-play-btn" onClick={handlePlayAgain}>
              {t('result.playAgain')}
            </button>
          </section>
        </>
      )}

      {view === 'game' && room && (
        <button type="button" className="floword-leave-btn" onClick={leaveRoom}>
          <LogOut size={18} aria-hidden />
          {t('leaveRoom')}
        </button>
      )}
    </div>
    </>
  )
}

export default App
