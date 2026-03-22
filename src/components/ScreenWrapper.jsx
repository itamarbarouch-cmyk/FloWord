import React from 'react'
import { FlowordMark } from './FlowordMark'

export function ScreenWrapper({ children, showLogo, brandLabel }) {
  return (
    <div className={`floword${showLogo ? ' floword-landing-page' : ''}`}>
      {showLogo && (
        <div className="floword-top-brand">
          <FlowordMark size={36} className="floword-mark--bar" />
          <span className="floword-wordmark" aria-hidden="true">
            FLOWORD
          </span>
          {brandLabel && <span className="sr-only">{brandLabel}</span>}
        </div>
      )}
      {children}
    </div>
  )
}
