import React from 'react'
import { Play, ArrowRight } from 'lucide-react'
import { ScreenWrapper } from './ScreenWrapper'

export function LandingScreen({
  onCreateRoom,
  onJoinRoom,
  inputCode,
  setInputCode,
  error,
  isCreating,
}) {
  return (
    <ScreenWrapper
      title="FloWord"
      subtitle="Connect your minds. Find the same word."
      showLogo
    >
      <section className="floword-landing-card">
        <h1 className="floword-landing-card-title">FloWord</h1>
        <p className="floword-landing-card-subtitle">
          Connect your minds. Find the same word.
        </p>

        <button
          type="button"
          className="floword-btn floword-btn-create"
          onClick={onCreateRoom}
          disabled={isCreating}
        >
          <Play size={20} className="floword-btn-icon" aria-hidden />
          {isCreating ? 'Creating…' : 'Create Room'}
        </button>

        <div className="floword-landing-divider">
          <span className="floword-landing-divider-line" />
          <span className="floword-landing-divider-text">OR JOIN</span>
          <span className="floword-landing-divider-line" />
        </div>

        <form onSubmit={onJoinRoom} className="floword-landing-form">
          <input
            type="text"
            className="floword-landing-input"
            placeholder="6-LETTER CODE"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            maxLength={6}
            autoComplete="off"
          />
          <button
            type="submit"
            className="floword-btn floword-btn-join"
            disabled={!inputCode.trim()}
          >
            Join Game
            <ArrowRight size={20} className="floword-btn-icon" aria-hidden />
          </button>
        </form>

        {error && <p className="floword-error floword-landing-error">{error}</p>}
      </section>
    </ScreenWrapper>
  )
}
