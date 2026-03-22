import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

export function InfoModal({ type, onClose }) {
  const { t } = useI18n()

  useEffect(() => {
    if (!type) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [type, onClose])

  if (!type) return null

  const titleKey = `info.${type}.title`
  const title = t(titleKey)

  return (
    <div className="floword-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="floword-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="floword-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="floword-modal-header">
          <h2 id="floword-modal-title" className="floword-modal-title">
            {title}
          </h2>
          <button
            type="button"
            className="floword-modal-close"
            onClick={onClose}
            aria-label={t('info.modal.close')}
          >
            <X size={22} aria-hidden />
          </button>
        </header>
        <div className="floword-modal-body">
          {type === 'how' && <HowToPlayBody t={t} />}
          {type === 'about' && <AboutBody t={t} />}
          {type === 'privacy' && <PrivacyBody t={t} />}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="floword-modal-section">
      {title && <h3 className="floword-modal-section-title">{title}</h3>}
      {children}
    </section>
  )
}

function HowToPlayBody({ t }) {
  return (
    <>
      <Section title={t('info.how.s1Title')}>
        <p>{t('info.how.s1Body')}</p>
      </Section>
      <Section title={t('info.how.s2Title')}>
        <p>{t('info.how.s2Body')}</p>
      </Section>
      <Section title={t('info.how.s3Title')}>
        <p>{t('info.how.s3Body')}</p>
      </Section>
      <Section title={t('info.how.s4Title')}>
        <p>{t('info.how.s4Intro')}</p>
        <ul className="floword-modal-list">
          <li>{t('info.how.s4Match')}</li>
          <li>{t('info.how.s4NoMatch')}</li>
        </ul>
      </Section>
    </>
  )
}

function AboutBody({ t }) {
  return (
    <>
      <p>{t('info.about.p1')}</p>
      <p>{t('info.about.p2')}</p>
    </>
  )
}

function PrivacyBody({ t }) {
  return (
    <>
      <p>{t('info.privacy.p1')}</p>
      <p>{t('info.privacy.p2')}</p>
      <p>{t('info.privacy.p3')}</p>
      <p>{t('info.privacy.p4')}</p>
      <p>{t('info.privacy.p5')}</p>
      <p>{t('info.privacy.p6')}</p>
      <p>{t('info.privacy.p7')}</p>
      <p className="floword-modal-muted">{t('info.privacy.p8')}</p>
    </>
  )
}
