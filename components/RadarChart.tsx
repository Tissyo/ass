
import React from 'react';

interface RadarData {
  label: string;
  value: number; 
}

interface Props {
  data: RadarData[];
  size?: number;
}

const RadarChart: React.FC<Props> = ({ data, size = 300 }) => {
  const center = size / 2;
  const radius = (size / 2) * 0.75;
  const numAxes = data.length;

  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const r = (radius * d.value) / 100;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* 背景环 */}
        {[20, 40, 60, 80, 100].map(level => (
          <polygon
            key={level}
            points={data.map((_, i) => {
              const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
              const r = (radius * level) / 100;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}

        {/* 轴线 */}
        {data.map((_, i) => {
          const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center} y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#F1F5F9"
              strokeWidth="1"
            />
          );
        })}

        {/* 数据多边形 */}
        <polygon
          points={polygonPath}
          fill="rgba(13, 148, 136, 0.15)"
          stroke="#0d9488"
          strokeWidth="2.5"
          className="transition-all duration-1000 ease-out"
        />

        {/* 数据点 */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0d9488" stroke="white" strokeWidth="2" />
        ))}

        {/* 标签 */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
          const labelR = radius + 30;
          const x = center + labelR * Math.cos(angle);
          const y = center + labelR * Math.sin(angle);
          return (
            <text
              key={i} x={x} y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-[10px] font-black fill-slate-400 tracking-widest uppercase"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
