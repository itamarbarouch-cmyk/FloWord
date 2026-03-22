import React from 'react'
import { Loader2, Check } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

export function WaitingForPlayer() {
  const { t } = useI18n()
  return (
    <section className="floword-waiting-card">
      <Loader2 className="floword-waiting-spinner" size={40} strokeWidth={2} aria-hidden />
      <h2 className="floword-waiting-title">{t('waiting.title')}</h2>
      <p className="floword-waiting-subtitle">{t('waiting.subtitle')}</p>
      <div className="floword-waiting-inner">
        <div className="floword-waiting-check-wrap">
          <Check className="floword-waiting-check" size={28} strokeWidth={2.5} aria-hidden />
        </div>
        <p className="floword-waiting-locked">{t('waiting.locked')}</p>
        <p className="floword-waiting-continue">{t('waiting.continue')}</p>
      </div>
    </section>
  )
}
