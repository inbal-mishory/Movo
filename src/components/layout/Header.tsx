import { DEMO_NOW, formatClock, formatSlashedDate } from '../../lib/dates';
import { MovoLogo } from './MovoLogo';

export function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <MovoLogo className="header__logo" />
        <h1 className="header__title">מערכת ניהול משמרת</h1>
      </div>
      <div className="header__user" aria-label="משתמש ותאריך">
        <span className="header__greeting">
          שלום, <u>רבקה כהן</u>
        </span>
        <span className="header__divider" aria-hidden>
          |
        </span>
        <time className="header__time" dateTime={DEMO_NOW.toISOString()} dir="ltr">
          <span>{formatSlashedDate(DEMO_NOW)}</span>
          <span>{formatClock(DEMO_NOW)}</span>
        </time>
      </div>
    </header>
  );
}
