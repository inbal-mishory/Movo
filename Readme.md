# MOVO – מערכת ניהול משמרות ורכבים אוטונומיים

MOVO היא **לוח בקרה ניהול משמרות ורכבים** מקיף המיועד לצי רכבים אוטונומיים. היא מספקת ניטור בזמן אמת, ניהול התרעות, תכנון משמרות ועקבוץ הזמנות לתפעול שירותי השכרת רכבים.

## מה אפשר לעשות ב-MOVO

### 📊 **לוח בקרה**
- צפייה בהתרעות תפעוליות וקוריאות בזמן אמת (קריטיות, תפעוליות, וידיעות)
- ניטור בריאות הצי עם עדכוני מצב רכבים ומשמרות
- גישה מהירה למדדי מפתח: השכרות פעילות, הזמנות ממתינות, ופערי כוח אדם
- סינון התרעות לפי חומרה וחטיבה (ניקיון, דלפק, טכנאים)

### 🗓️ **תכנית עבודה (תצוגת שבוע)**
- ניהול משמרות של עובדים למשך שבוע בשלוש חטיבות:
  - **ניקיון**: צוות הכנת רכבים וניקיון
  - **דלפק**: נציגי שירות לקוחות
  - **טכנאים**: טכנאי תחזוקת רכבים
- הקצאת סוגי משמרות (בוקר, אחר צהריים, לילה, יום חופש)
- זיהוי וכיסוי של פערי כוח אדם
- צפייה בתפקידי עובדים והקצאה לחטיבות

### 🚗 **צי וקבוצות הזמנות**
- מעקב אחר שיבוץ רכבים ומצב
- ניהול הזמנות וזיכוי הלקוחות
- ניטור שיטות איסוף והחזרה
- טיפול בדיווחי תחזוקה ונזקים לרכבים

### ⚠️ **ניהול התרעות**
- התרעות תפעוליות בזמן אמת כולל:
  - חרום לרכבים (תאונות, כשל בחיישנים, עצירות חירום)
  - מצב הצי (טעינה, עיכובי ניקיון, עיכובי החזרה)
  - בעיות לקוחות (בקשות שדרוג, תלונות)
  - אירועי כוח אדם (אי-הופעות, עומס בדלפק)
- רמות חומרה עוזרות לתעדוף תגובות
- ניתוב התרעות לחטיבות הרלוונטיות

## פרטים טכניים

אפליקציית Front-end בלבד (React + TypeScript + Vite) שנבנתה מעיצוב MOVO ב-Figma: לוח בקרה בעברית RTL ותכנית עבודה שבועית.
אין שרת, אימות או תשלומים; כל הנתונים הם נתונים דמו שמתודרים ב- `localStorage` של הדפדפן (מפתח `movo:state`).

## Scripts

```bash
npm install
npm run dev      # local development
npm test         # unit tests (Vitest)
npm run build    # type-check + production build into dist/
```

## Notes

- The UI is laid out for a 1920px-wide desktop and scales proportionally on narrower desktops (root `font-size` is `1vw`, clamped); tablet and mobile get stacked layouts.
- The app clock is fixed to 26/10/2026 10:30, the date shown in the design, so the "today" column of the schedule and the shift staffing card line up with the mock data.
- Only the dashboard and work schedule have screens in the design; the other sidebar items are inert. The day and month views in the schedule are shown but disabled.
- Create/edit order forms, the edit-alert form, shift editing and the delete/assign/order toasts have no Figma frames and reuse the existing modal, select and toast styles.
- To reset the demo data, clear `localStorage` for the site.

## Deployment (GitHub Pages)

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and deploys `dist/` on every push to `main`.
In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**. Push the changes to `main`, then check the workflow under **Actions**. Once deployment succeeds, the app is available at [https://inbal-mishory.github.io/Movo/](https://inbal-mishory.github.io/Movo/).

Vite uses `/Movo/` as its base path. The app uses hash routing (for example, `/#/schedule`) so routes can be refreshed on GitHub Pages.
