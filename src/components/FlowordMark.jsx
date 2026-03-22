import { useI18n } from '../i18n/I18nContext'

/**
 * Brand mark: sunflower + W (matches public/floword-mark.svg).
 */
export function FlowordMark({ className = '', size = 48, ...imgProps }) {
  return (
    <img
      src="/floword-mark.svg"
      alt=""
      width={size}
      height={size}
      className={`floword-mark ${className}`.trim()}
      decoding="async"
      draggable={false}
      {...imgProps}
    />
  )
}

/** Replaces the text “FloWord” title in game flows (decorative + accessible label). */
export function FlowordHeaderMark({ size = 40, className = '' }) {
  const { t } = useI18n()
  return (
    <div
      className={`floword-header-mark ${className}`.trim()}
      role="img"
      aria-label={t('app.title')}
    >
      <FlowordMark size={size} className="floword-mark--header" aria-hidden="true" />
    </div>
  )
}
