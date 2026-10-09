import { View } from 'react-native';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { colors } from '@/theme/tokens';

interface Bar {
  h: number; // 0-100 relative height, or px — caller decides via maxHeight
  color: string;
}

interface BarChartProps {
  bars: Bar[];
  height?: number;
  gap?: number;
  radius?: number;
  /** if true, `h` is treated as already-in-px; otherwise scaled against the tallest bar */
  absolute?: boolean;
}

/** Simple vertical bar row — load bars, weight trend bars, sleep-stage hypnogram bars, week-shape bars. */
export function BarChart({ bars, height = 64, gap = 3, radius = 2, absolute = false }: BarChartProps) {
  const max = absolute ? height : Math.max(...bars.map((b) => b.h), 1);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap, height }}>
      {bars.map((b, i) => {
        const h = absolute ? b.h : (b.h / max) * height;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: Math.max(2, h),
              borderRadius: radius,
              backgroundColor: b.color,
            }}
          />
        );
      })}
    </View>
  );
}

interface SparklineProps {
  values: number[];
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
  fillColor?: string;
  dotAtEnd?: boolean;
}

/** Line/area chart for body-trend curves. Values are auto-scaled to the given box. */
export function Sparkline({
  values,
  width,
  height,
  color = colors.primary,
  strokeWidth = 2.5,
  filled = false,
  fillColor,
  dotAtEnd = true,
}: SparklineProps) {
  if (values.length < 2) return <View style={{ width, height }} />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  const last = points[points.length - 1];

  return (
    <Svg width={width} height={height}>
      {filled && <Path d={areaPath} fill={fillColor ?? color} fillOpacity={0.12} />}
      <Path d={linePath} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {dotAtEnd && <Circle cx={last.x} cy={last.y} r={strokeWidth * 1.6} fill={color} />}
    </Svg>
  );
}

interface RangeBarProps {
  /** Fixed px width, or a percentage string (e.g. '100%') to fill the parent. */
  width: number | `${number}%`;
  height?: number;
  pct: number; // 0-100
  trackColor?: string;
  fillColor?: string;
  radius?: number;
}

/** Horizontal progress track — macro bars, factor-weight bars. */
export function RangeBar({ width, height = 6, pct, trackColor = colors.track, fillColor = colors.primary, radius = 999 }: RangeBarProps) {
  return (
    <View style={{ width, height, borderRadius: radius, backgroundColor: trackColor, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: '100%', backgroundColor: fillColor, borderRadius: radius }} />
    </View>
  );
}

interface ConnectorLineProps {
  height: number;
  color: string;
}

/** Vertical connector used in staged/timeline lists (return-to-run protocol, phases). */
export function ConnectorLine({ height, color }: ConnectorLineProps) {
  return <View style={{ width: 2, height, backgroundColor: color, marginLeft: 11 }} />;
}
