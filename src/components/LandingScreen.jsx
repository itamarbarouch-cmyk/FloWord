import React, { useState } from 'react'
import { Play, ArrowRight } from 'lucide-react'
import { ScreenWrapper } from './ScreenWrapper'
import { FlowordMark } from './FlowordMark'
import { InfoModal } from './InfoModal'
import { useI18n } from '../i18n/I18nContext'

export function LandingScreen({
  onCreateRoom,
  onJoinRoom,
  inputCode,
  setInputCode,
  errorKey,
  isCreating,
}) {
  const { t } = useI18n()
  const [infoPanel, setInfoPanel] = useState(null)

  return (
    <ScreenWrapper showLogo brandLabel={t('app.title')}>
      <section className="floword-landing-card">
        <div className="floword-landing-hero">
          <FlowordMark size={72} className="floword-mark--hero" />
          <p className="floword-landing-card-subtitle floword-landing-subtitle-line">
            {t('landing.subtitleLine1')}
            <br />
            {t('landing.subtitleLine2')}
          </p>
        </div>

        <button
          type="button"
          className="floword-btn floword-btn-create"
          onClick={onCreateRoom}
          disabled={isCreating}
        >
          <Play size={20} className="floword-btn-icon" aria-hidden />
          {isCreating ? t('landing.creating') : t('landing.createRoom')}
        </button>

        <div className="floword-landing-divider">
          <span className="floword-landing-divider-line" />
          <span className="floword-landing-divider-text">{t('landing.orJoin')}</span>
          <span className="floword-landing-divider-line" />
        </div>

        <form onSubmit={onJoinRoom} className="floword-landing-form">
          <input
            type="text"
            className="floword-landing-input"
            placeholder={t('landing.enterCode')}
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
            {t('landing.joinGame')}
            <ArrowRight size={20} className="floword-btn-icon" aria-hidden />
          </button>
        </form>

        {errorKey && <p className="floword-error floword-landing-error">{t(errorKey)}</p>}
      </section>

      <nav className="floword-landing-footer" aria-label={t('footer.navLabel')}>
        <button type="button" className="floword-landing-footer-link" onClick={() => setInfoPanel('how')}>
          {t('footer.howToPlay')}
        </button>
        <span className="floword-landing-footer-dot" aria-hidden>
          ·
        </span>
        <button type="button" className="floword-landing-footer-link" onClick={() => setInfoPanel('about')}>
          {t('footer.about')}
        </button>
        <span className="floword-landing-footer-dot" aria-hidden>
          ·
        </span>
        <button type="button" className="floword-landing-footer-link" onClick={() => setInfoPanel('privacy')}>
          {t('footer.privacy')}
        </button>
      </nav>

      <InfoModal type={infoPanel} onClose={() => setInfoPanel(null)} />
    </ScreenWrapper>
  )
}
