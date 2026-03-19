import React from 'react'

export function ScreenWrapper({ title, subtitle, children, showLogo }) {
  return (
    <div className={`floword${showLogo ? ' floword-landing-page' : ''}`}>
      {showLogo && (
        <div className="floword-logo">
          <span className="floword-logo-flo">FLO</span>
          <span className="floword-logo-word">WORD</span>
        </div>
      )}
      {!showLogo && title && <h1 className="floword-title">{title}</h1>}
      {!showLogo && subtitle && <p className="floword-tagline">{subtitle}</p>}
      {children}
    </div>
  )
}
