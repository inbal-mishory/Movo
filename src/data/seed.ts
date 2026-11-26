import type { Alert, Employee, Order, PickupMethod, ShiftOverrides, ShiftType } from '../types';
import { DEMO_TODAY } from '../lib/dates';

type Shift = Exclude<ShiftType, 'off'>;

const roster = (
  prefix: string,
  department: Employee['department'],
  people: [name: string, role: string, shift: Shift][],
): Employee[] =>
  people.map(([name, role, defaultShift], i) => ({ id: `${prefix}-${i + 1}`, name, role, department, defaultShift }));

export const EMPLOYEES: Employee[] = [
  ...roster('cl', 'cleaning', [
    ['אבי טספאי', 'מנקה רכבים', 'morning'],
    ['מריה גונזלס', 'מנקה רכבים', 'afternoon'],
    ['סמיר חטיב', 'מנקה רכבים', 'morning'],
    ['עידן פרץ', 'מנקה רכבים', 'night'],
    ['טטיאנה קוזנצוב', 'מנקה רכבים', 'afternoon'],
    ['מורן דהן', 'מנקה רכבים', 'morning'],
    ['רותם אלקיים', 'מנקה רכבים', 'night'],
    ['מוחמד נאסר', 'מנקה רכבים', 'night'],
    ['אולגה שפירא', 'מנקה רכבים', 'afternoon'],
  ]),
  ...roster('co', 'counter', [
    ['מאיה רוזנברג', 'ראש צוות', 'morning'],
    ['אחמד מסארווה', 'נציג שירות', 'afternoon'],
    ['שירה כהן', 'נציג שירות', 'night'],
    ['דניאל פרידמן', 'נציג שירות', 'afternoon'],
    ['ליאת אוחנה', 'נציג שירות', 'night'],
    ["גיוליה ברקוביץ'", 'נציג שירות', 'morning'],
    ['הילה בן דוד', 'נציג שירות', 'morning'],
    ['סאמר עבדי', 'נציג שירות', 'night'],
    ['מיכאל שטרן', 'נציג שירות', 'afternoon'],
  ]),
  ...roster('ma', 'maintenance', [
    ['אלכס פטרוב', 'טכנאי', 'morning'],
    ['רועי מזרחי', 'טכנאי', 'afternoon'],
    ['יוסי לוי', 'טכנאי', 'night'],
    ['נועה אביטל', 'טכנאי', 'morning'],
    ['עומר קדוש', 'טכנאי', 'afternoon'],
    ['תמר שלום', 'טכנאי', 'night'],
    ['בנימין אזולאי', 'טכנאי', 'morning'],
    ['חאלד עיסא', 'טכנאי', 'afternoon'],
    ['לילך ברק', 'טכנאי', 'night'],
  ]),
];

export const VEHICLES = ['102', '118', '125', '129', '155', '204', '233', '275', '307', '312', '326', '388', '412'];

// Gaps in the staffing of the week shown in the design (Wed morning/afternoon, Thu night).
export const INITIAL_SHIFT_OVERRIDES: ShiftOverrides = {
  'ma-4|2026-10-28': 'off',
  'ma-5|2026-10-28': 'off',
  'ma-6|2026-10-29': 'off',
  'ma-9|2026-10-29': 'off',
};

type AlertSeed = Omit<Alert, 'id'>;

const ALERT_SEEDS: AlertSeed[] = [
  {
    title: 'רכב 155 – ניקיון דחוף נדרש',
    description: 'הרכב מיועד להשכרה בעוד 30 דקות וטרם נוקה.',
    severity: 'operational',
    icon: 'clock',
    vehicle: '155',
    audience: 'cleaning',
    timeLabel: '12:20',
  },
  {
    title: 'רכב 204 – נדרשת התערבות אנושית',
    description: 'הרכב נעצר במהלך נסיעה ולא יכול להמשיך באופן עצמאי. יש להעביר את האירוע לצוות הטכני ולעקוב.',
    severity: 'critical',
    icon: 'alert',
    vehicle: '204',
    audience: 'maintenance',
    timeLabel: '11:15',
  },
  {
    title: 'רכב 125 – אובדן תקשורת',
    description: 'הקשר עם הרכב נותק ולא מתקבלים עדכוני מיקום ומצב. יש לדווח לצוות הטכני ולוודא שהתקלה נמצאת',
    severity: 'critical',
    icon: 'wifi-off',
    vehicle: '125',
    audience: 'maintenance',
    timeLabel: '10:30',
  },
  {
    title: 'הזמנה 4521 – אין רכב זמין בקטגוריה המבוקשת',
    description: 'לא נמצא רכב זמין בקטגוריה שהלקוח הזמין. יש לבדוק אפשרות לשיבוץ רכב חלופי או לאשר שדרוג ללא',
    severity: 'operational',
    icon: 'calendar-x',
    vehicle: '',
    audience: 'counter',
    timeLabel: '09:45',
  },
  {
    title: 'רכב 118 – תאונה זוהתה',
    description: 'מערכת הביטחות זיהתה אירוע תאונה במהלך נסיעה. יש להפעיל את נוהל החירום, לעדכן את הגורמים',
    severity: 'critical',
    icon: 'car',
    vehicle: '118',
    audience: 'all',
    timeLabel: '09:00',
  },
  {
    title: 'רכב 307 – תקלה במערכת החיישנים',
    description: 'זוהתה תקלה באחד מחיישני הרכב, המונעת המשך נסיעה אוטונומית. יש להעביר לבדיקה טכנית ולוודא',
    severity: 'critical',
    icon: 'wrench',
    vehicle: '307',
    audience: 'maintenance',
    timeLabel: '08:30',
  },
  {
    title: 'הזמנה 4589 – בקשת שדרוג חריגה',
    description: 'לקוח ביקש לשדרג את הרכב שהוזמן ללא תוספת תשלום. הבקשה חורגת מתנאי ההזמנה וממתינה לאישור',
    severity: 'operational',
    icon: 'calendar-x',
    vehicle: '',
    audience: 'counter',
    timeLabel: "25 באוק'",
  },
  {
    title: 'דלפק השירות – עומס חריג',
    description: 'מספר הלקוחות הממתינים בדלפק חורג מהיעד שהוגדר. יש לבדוק את זמינות נציגי השירות ולתגבר את',
    severity: 'operational',
    icon: 'clipboard',
    vehicle: '',
    audience: 'counter',
    timeLabel: "25 באוק'",
  },
  {
    title: 'צוות הניקיון – משימה בעיכוב',
    description: 'זמן הכנת הרכב להזמנה הבאה חורג מהיעד שנקבע. המשימה טרם הושלמה ונדרש בירור מול צוות',
    severity: 'operational',
    icon: 'clock',
    vehicle: '',
    audience: 'cleaning',
    timeLabel: "25 באוק'",
  },
  {
    title: 'רכב 326 – עצירת חירום בלתי צפויה',
    description: 'הרכב ביצע עצירת חירום במהלך נסיעה ללא מכשול מזוהה. הנסיעה הופסקה והרכב ממתין לבדיקה. יש',
    severity: 'critical',
    icon: 'alert',
    vehicle: '326',
    audience: 'maintenance',
    timeLabel: '08:16',
  },
  {
    title: 'רכב 275 – דלת נפתחה במהלך נסיעה',
    description: 'חיישני הרכב זיהו פתיחה בלתי צפויה של אחת הדלתות בזמן נסיעה. מערכת הבטיחות עצרה את הרכב. יש',
    severity: 'critical',
    icon: 'alert',
    vehicle: '275',
    audience: 'maintenance',
    timeLabel: '06:45',
  },
  {
    title: 'רכב 412 – תקלה במערכת הבלמים',
    description: 'מערכת האבחון זיהתה תקלה במערכת הבלימה במהלך נסיעה. הרכב נעצר ואינו כשיר להמשך פעילות. יש',
    severity: 'critical',
    icon: 'alert',
    vehicle: '412',
    audience: 'maintenance',
    timeLabel: "25 באוק'",
  },
  {
    title: 'תלונת לקוח 1032 – נדרש אישור מנהלת',
    description: 'בקשה לביטול חיוב בגין נזק קל שנרשם ברכב. הלקוח טוען שהנזק היה קיים לפני תחילת ההשכרה.',
    severity: 'operational',
    icon: 'user-x',
    vehicle: '',
    audience: 'counter',
    timeLabel: "25 באוק'",
  },
  {
    title: 'משמרת ערב – מחסור בכוח אדם',
    description: 'עובד לא התייצב ונדרש שינוי בשיבוץ. יש לאתר עובד מחליף או לתגבר ממחלקה אחרת.',
    severity: 'operational',
    icon: 'users',
    vehicle: '',
    audience: 'all',
    timeLabel: "25 באוק'",
  },
  {
    title: 'רכב 129 – החזרה באיחור',
    description: 'הרכב טרם הוחזר לחניון והזמנה הבאה ממתינה לו בעוד שעה. יש ליצור קשר עם הלקוח.',
    severity: 'operational',
    icon: 'clock',
    vehicle: '129',
    audience: 'counter',
    timeLabel: "25 באוק'",
  },
  {
    title: 'רכב 233 – סוללה נמוכה',
    description: 'מצב הטעינה של הרכב נמוך מ-15%. יש לחבר לעמדת טעינה לפני ההשכרה הבאה.',
    severity: 'operational',
    icon: 'wrench',
    vehicle: '233',
    audience: 'maintenance',
    timeLabel: "25 באוק'",
  },
  {
    title: 'הזמנה 4571 – תשלום נכשל',
    description: 'חיוב כרטיס האשראי של הלקוח נדחה. יש ליצור קשר ולעדכן אמצעי תשלום לפני האיסוף.',
    severity: 'operational',
    icon: 'calendar-x',
    vehicle: '',
    audience: 'counter',
    timeLabel: "24 באוק'",
  },
  {
    title: 'רכב 388 – לחץ אוויר נמוך בגלגל',
    description: 'חיישן הלחץ מדווח על ירידה בגלגל קדמי ימני. יש לתקן לפני ההשכרה הבאה.',
    severity: 'operational',
    icon: 'wrench',
    vehicle: '388',
    audience: 'maintenance',
    timeLabel: "24 באוק'",
  },
  {
    title: 'צוות התחזוקה – כלי עבודה חסרים',
    description: 'נדרש השלמת ציוד בארגז הכלים של המשמרת. יש לפנות למחסן.',
    severity: 'operational',
    icon: 'clipboard',
    vehicle: '',
    audience: 'maintenance',
    timeLabel: "24 באוק'",
  },
  {
    title: 'תלונת לקוח 1029 – ריח חריג ברכב',
    description: 'לקוח דיווח על ריח חריג בעת האיסוף. הרכב הוחלף וטרם נבדק.',
    severity: 'operational',
    icon: 'user-x',
    vehicle: '',
    audience: 'cleaning',
    timeLabel: "24 באוק'",
  },
  {
    title: 'משמרת לילה – כיסוי חלקי',
    description: 'חסר עובד אחד בדלפק במשמרת הלילה של יום חמישי.',
    severity: 'operational',
    icon: 'users',
    vehicle: '',
    audience: 'all',
    timeLabel: "23 באוק'",
  },
  {
    title: 'רכב 155 – התראת תחזוקה תקופתית',
    description: 'הרכב הגיע לקילומטראז׳ שמחייב טיפול תקופתי.',
    severity: 'operational',
    icon: 'wrench',
    vehicle: '155',
    audience: 'maintenance',
    timeLabel: "23 באוק'",
  },
  {
    title: 'הזמנה 4480 – הלקוח לא הגיע לאיסוף',
    description: 'עברו 45 דקות ממועד האיסוף ואין מענה. יש להחליט על ביטול או המתנה.',
    severity: 'operational',
    icon: 'calendar-x',
    vehicle: '',
    audience: 'counter',
    timeLabel: "22 באוק'",
  },
];

export const SEED_ALERTS: Alert[] = ALERT_SEEDS.map((alert, i) => ({ ...alert, id: `a${i + 1}` }));

type OrderSeed = [
  time: string,
  customer: string,
  model: string,
  category: string,
  method: PickupMethod,
  notes: string,
];

// The first rows are the orders shown in the design; the rest continue the day.
const ORDER_SEEDS: OrderSeed[] = [
  ['09:30', 'מיכל אברהמי', 'Tesla Model S', 'סדאן', 'lot', 'הלקוחה ביקשה לוודא שהרכב מוכן לאיסוף בשעה שנקבעה.'],
  ['10:15', 'יניב לוי', 'Waymo Pacifica', 'SUV', 'delivery', ''],
  ['11:00', 'שירה כהן', 'Zoox', 'מסחרי', 'lot', ''],
  ['12:00', 'אברהם חושן', 'Waymo Pacifica', 'SUV', 'delivery', 'הלקוח מבקש שישלחו לכתובת העבודה'],
  ['12:30', 'רוני אבוטבול', 'Tesla Model X', 'מסחרי', 'lot', ''],
  ['13:00', 'שירה כהן', 'Zoox', 'מסחרי', 'delivery', ''],
  ['14:30', 'ירדן מליחי', 'Zoox', 'מסחרי', 'delivery', 'הערה'],
  ['14:00', 'אייל מזרחי', 'Waymo Pacifica', 'SUV', 'delivery', ''],
  ['15:00', 'נועה גולן', 'Tesla Model S', 'סדאן', 'lot', ''],
  ['15:30', 'תומר ביטון', 'Tesla Model X', 'מסחרי', 'lot', 'לקוח פרימיום'],
  ['16:00', 'דנה רוזנברג', 'Waymo Pacifica', 'SUV', 'delivery', ''],
  ['16:15', 'עומר שמעוני', 'Zoox', 'מסחרי', 'lot', ''],
  ['16:45', 'ליאור אדרי', 'Tesla Model S', 'סדאן', 'lot', 'הלקוח ביקש מושב ילד'],
  ['17:00', 'מאיה פרידמן', 'Waymo Pacifica', 'SUV', 'delivery', ''],
  ['17:30', 'גיא סבן', 'Tesla Model X', 'מסחרי', 'lot', ''],
  ['18:00', 'הדס כץ', 'Zoox', 'מסחרי', 'lot', ''],
  ['18:15', 'אור ממן', 'Tesla Model S', 'סדאן', 'delivery', 'חשבונית על שם חברה'],
  ['18:45', 'שני אלבז', 'Waymo Pacifica', 'SUV', 'lot', ''],
  ['19:00', 'איתי דהן', 'Tesla Model X', 'מסחרי', 'lot', ''],
  ['19:30', 'רונית חביב', 'Zoox', 'מסחרי', 'delivery', ''],
  ['20:00', 'אלון נחום', 'Tesla Model S', 'סדאן', 'lot', ''],
  ['20:15', 'טל ברוך', 'Waymo Pacifica', 'SUV', 'lot', ''],
  ['20:30', 'יעל סויסה', 'Tesla Model X', 'מסחרי', 'delivery', 'יש להכין את הרכב מראש'],
  ['21:00', 'אמיר שחר', 'Zoox', 'מסחרי', 'lot', ''],
  ['21:15', 'לימור נבו', 'Tesla Model S', 'סדאן', 'lot', ''],
  ['21:30', 'בן אלמוג', 'Waymo Pacifica', 'SUV', 'delivery', ''],
  ['08:00', 'רותם אשכנזי', 'Tesla Model S', 'סדאן', 'lot', ''],
  ['08:15', 'דור מלכה', 'Zoox', 'מסחרי', 'lot', ''],
  ['08:30', 'ענת פרלמן', 'Waymo Pacifica', 'SUV', 'delivery', ''],
  ['08:45', 'יובל סגל', 'Tesla Model X', 'מסחרי', 'lot', ''],
  ['09:00', 'מורן אליהו', 'Tesla Model S', 'סדאן', 'lot', ''],
  ['09:15', 'אסף וקנין', 'Zoox', 'מסחרי', 'delivery', ''],
  ['09:45', 'ספיר חזן', 'Waymo Pacifica', 'SUV', 'lot', ''],
  ['10:00', 'עידו בראון', 'Tesla Model X', 'מסחרי', 'lot', ''],
  ['10:30', 'קרן זכאי', 'Tesla Model S', 'סדאן', 'delivery', ''],
  ['10:45', 'נדב אילוז', 'Zoox', 'מסחרי', 'lot', ''],
  ['11:15', 'שלי ביטון', 'Waymo Pacifica', 'SUV', 'lot', ''],
  ['11:30', 'אריאל טובול', 'Tesla Model X', 'מסחרי', 'delivery', ''],
  ['11:45', 'גלית מימון', 'Tesla Model S', 'סדאן', 'lot', ''],
  ['12:15', 'אביב ששון', 'Zoox', 'מסחרי', 'lot', ''],
  ['12:45', 'רינת עמר', 'Waymo Pacifica', 'SUV', 'delivery', ''],
  ['13:30', 'יהב סלומון', 'Tesla Model X', 'מסחרי', 'lot', ''],
];

export const FLEET_MODELS: { model: string; category: string; dailyRate: number; prefix: string }[] = [
  { model: 'Tesla Model S', category: 'סדאן', dailyRate: 480, prefix: 'MOVO-0' },
  { model: 'Waymo Pacifica', category: 'SUV', dailyRate: 560, prefix: 'MOVO-1' },
  { model: 'Zoox', category: 'מסחרי', dailyRate: 690, prefix: 'MOVO-2' },
  { model: 'Tesla Model X', category: 'מסחרי', dailyRate: 620, prefix: 'MOVO-3' },
];

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function buildOrders(): Order[] {
  const orders = ORDER_SEEDS.map(([time, customer, model, category, method, notes], i): Order => {
    const fleet = FLEET_MODELS.find((m) => m.model === model)!;
    const days = 1 + ((i * 7) % 6);
    return {
      id: i === 0 ? 4582 : 4583 + i * 3 - (i % 2),
      customer,
      vehicleModel: model,
      category,
      internalNumber: `${fleet.prefix}${String(40 + ((i * 13) % 55)).padStart(2, '0')}`,
      pickupDate: DEMO_TODAY,
      pickupTime: time,
      returnDate: addDaysIso(DEMO_TODAY, days),
      returnTime: time,
      pickupMethod: method,
      returnMethod: i % 4 === 3 ? 'delivery' : 'lot',
      paymentStatus: i % 6 === 4 ? 'pending' : 'paid',
      total: days * fleet.dailyRate,
      status: i % 9 === 8 ? 'pending' : 'approved',
      notes,
    };
  });
  // The first order mirrors the order-details screen in the design.
  orders[0] = {
    ...orders[0],
    internalNumber: 'MOVO-042',
    returnDate: '2026-10-29',
    returnMethod: 'lot',
    paymentStatus: 'paid',
    total: 1440,
    status: 'approved',
  };
  return orders;
}

export const SEED_ORDERS: Order[] = buildOrders();
