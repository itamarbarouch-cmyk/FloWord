import React from 'react'
import { Loader2, Check } from 'lucide-react'

export function WaitingForPlayer() {
  return (
    <section className="floword-waiting-card">
      <Loader2 className="floword-waiting-spinner" size={40} strokeWidth={2} aria-hidden />
      <h2 className="floword-waiting-title">Hold On...</h2>
      <p className="floword-waiting-subtitle">Waiting for the other player to submit</p>
      <div className="floword-waiting-inner">
        <div className="floword-waiting-check-wrap">
          <Check className="floword-waiting-check" size={28} strokeWidth={2.5} aria-hidden />
        </div>
        <p className="floword-waiting-locked">Your word is locked in!</p>
        <p className="floword-waiting-continue">
          The game will continue as soon as your partner is ready.
        </p>
      </div>
    </section>
  )
}
