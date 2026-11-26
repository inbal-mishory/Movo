import { useRef, useState, type ReactNode } from 'react';

interface TooltipState {
  x: number;
  y: number;
  content: ReactNode;
}

// Tracks a tooltip position relative to a chart container so it can follow the pointer or a focused element.
export function useChartTooltip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const place = (clientX: number, clientY: number, content: ReactNode) => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    setTooltip({ x: clientX - box.left, y: clientY - box.top, content });
  };

  const bind = (content: ReactNode) => ({
    onMouseEnter: (e: React.MouseEvent) => place(e.clientX, e.clientY, content),
    onMouseMove: (e: React.MouseEvent) => place(e.clientX, e.clientY, content),
    onMouseLeave: () => setTooltip(null),
    onFocus: (e: React.FocusEvent<Element>) => {
      const r = e.currentTarget.getBoundingClientRect();
      place(r.left + r.width / 2, r.top, content);
    },
    onBlur: () => setTooltip(null),
  });

  const node = tooltip && (
    <div className="chart-tooltip" role="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
      {tooltip.content}
    </div>
  );

  return { containerRef, bind, tooltipNode: node };
}
