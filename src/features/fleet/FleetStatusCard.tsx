import { DONUT_ORDER, FLEET_STATUS, FLEET_TOTAL, FLEET_TYPES } from '../../data/fleet';
import { useChartTooltip } from './useChartTooltip';

const SIZE = 227;
const STROKE = 43;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const AXIS_MAX = 60;
const AXIS_TICKS = [0, 20, 40, 60];

const percent = (value: number, total: number) => `${Math.round((value / total) * 100)}%`;

export function FleetStatusCard() {
  const { containerRef, bind, tooltipNode } = useChartTooltip();
  const available = FLEET_STATUS.find((s) => s.key === 'available')!;
  const slices = DONUT_ORDER.map((key) => FLEET_STATUS.find((s) => s.key === key)!);
  let offset = 0;

  return (
    <section className="card fleet" aria-labelledby="fleet-title">
      <h2 id="fleet-title" className="card__title">
        סטטוס רכבים
      </h2>

      <div className="fleet__body" ref={containerRef}>
        <div className="fleet__summary">
          <h3 className="fleet__subtitle">מצב צי הרכב</h3>
          <ul className="legend">
            {FLEET_STATUS.map((slice) => (
              <li
                key={slice.key}
                className="legend__item"
                tabIndex={0}
                {...bind(<TooltipText label={slice.label} value={slice.count} total={FLEET_TOTAL} />)}
              >
                <span className="legend__swatch" style={{ background: slice.color }} aria-hidden />
                <span className="legend__label">{slice.label}</span>
                <span className="legend__count">{slice.count}</span>
              </li>
            ))}
          </ul>
          <p className="fleet__total">
            <strong>סה"כ {FLEET_TOTAL} רכבים</strong>
            <span>{percent(available.count, FLEET_TOTAL)} זמינים להשכרה</span>
          </p>
        </div>

        <div className="donut" role="img" aria-label={`${available.count} רכבים פנויים להשכרה מתוך ${FLEET_TOTAL}`}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
              {slices.map((slice) => {
                const length = (slice.count / FLEET_TOTAL) * CIRCUMFERENCE;
                const circle = (
                  <circle
                    key={slice.key}
                    className="donut__segment"
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={STROKE}
                    strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                    strokeDashoffset={-offset}
                    tabIndex={0}
                    aria-label={`${slice.label}: ${slice.count}`}
                    {...bind(<TooltipText label={slice.label} value={slice.count} total={FLEET_TOTAL} />)}
                  />
                );
                offset += length;
                return circle;
              })}
            </g>
          </svg>
          <div className="donut__center">
            <strong>{available.count}</strong>
            <span>פנויים להשכרה</span>
          </div>
        </div>

        <div className="types">
          <h3 className="fleet__subtitle">סוגי רכב</h3>
          <ul className="types__list">
            {FLEET_TYPES.map((row) => {
              const unavailable = row.total - row.available;
              return (
                <li key={row.name} className="types__row">
                  <span className="types__label">
                    {row.name} ({row.total} רכבים)
                  </span>
                  <div className="types__bar" style={{ width: `${(row.total / AXIS_MAX) * 100}%` }}>
                    <span
                      className="types__segment types__segment--available"
                      style={{ flexGrow: row.available }}
                      tabIndex={0}
                      {...bind(<TooltipText label={`${row.name} · פנויים להשכרה`} value={row.available} total={row.total} />)}
                    >
                      {row.available}
                    </span>
                    <span
                      className="types__segment types__segment--unavailable"
                      style={{ flexGrow: unavailable }}
                      tabIndex={0}
                      {...bind(<TooltipText label={`${row.name} · לא פנויים`} value={unavailable} total={row.total} />)}
                    >
                      {unavailable}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="types__axis" aria-hidden>
            {AXIS_TICKS.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
          <div className="types__legend">
            <span>
              <i className="types__swatch types__swatch--available" />
              פנויים להשכרה
            </span>
            <span>
              <i className="types__swatch types__swatch--unavailable" />
              לא פנויים
            </span>
          </div>
        </div>
        {tooltipNode}
      </div>
    </section>
  );
}

function TooltipText({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <>
      <strong>{label}</strong>
      <span>{value} רכבים</span>
      <span>{percent(value, total)}</span>
    </>
  );
}
