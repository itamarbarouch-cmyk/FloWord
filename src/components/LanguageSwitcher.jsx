import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18nContext'

const OPTIONS = [
  { locale: 'en', flag: '🇺🇸', labelKey: 'lang.english', code: 'EN' },
  { locale: 'he', flag: '🇮🇱', labelKey: 'lang.hebrew', code: 'HE' },
]

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const current = OPTIONS.find((o) => o.locale === locale) || OPTIONS[0]

  return (
    <div className="floword-lang-switcher" ref={ref}>
      <button
        type="button"
        className="floword-lang-trigger-pill"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${t('lang.choose')}: ${t(current.labelKey)}`}
      >
        <span className="floword-lang-trigger-flag" aria-hidden>
          {current.flag}
        </span>
        <span className="floword-lang-code">{current.code}</span>
      </button>
      {open && (
        <ul className="floword-lang-menu floword-lang-menu-pill" role="listbox">
          {OPTIONS.map((opt) => (
            <li key={opt.locale} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={locale === opt.locale}
                aria-label={t(opt.labelKey)}
                className={`floword-lang-option-pill ${locale === opt.locale ? 'floword-lang-option-pill-active' : ''}`}
                onClick={() => {
                  setLocale(opt.locale)
                  setOpen(false)
                }}
              >
                <span className="floword-lang-option-flag" aria-hidden>
                  {opt.flag}
                </span>
                <span className="floword-lang-option-code">{opt.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
