import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STRINGS } from './strings'

const STORAGE_KEY = 'floword-locale'

const I18nContext = createContext(null)

function interpolate(template, vars) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{${k}}`))
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s === 'he' || s === 'en') return s
    } catch {
      /* ignore */
    }
    return 'en'
  })

  const setLocale = useCallback((next) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'he' ? 'he' : 'en'
    document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr'
  }, [locale])

  const t = useCallback(
    (key, vars) => {
      const table = STRINGS[locale] || STRINGS.en
      const fallback = STRINGS.en[key]
      const raw = table[key] ?? fallback ?? key
      return interpolate(raw, vars)
    },
    [locale]
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
