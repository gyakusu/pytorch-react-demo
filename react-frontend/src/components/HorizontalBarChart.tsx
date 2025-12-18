import React, { memo } from 'react';

// ダミーデータ型定義（immutable）
interface BarData {
  readonly label: string;
  readonly value: number;
}

// ダミーデータ（読み取り専用配列）
const DUMMY_DATA: readonly BarData[] = [
  { label: 'Feature A', value: 75 },
  { label: 'Feature B', value: 45 },
  { label: 'Feature C', value: 90 },
  { label: 'Feature D', value: 60 },
  { label: 'Feature E', value: 30 },
] as const;

// 棒グラフアイテム（純粋関数コンポーネント、ネスト1）
const BarItem = memo<BarData>(({ label, value }) => (
  <div className="bar-item">
    <span className="bar-label">{label}</span>
    <div className="bar-track">
      <div className="bar-fill" style={{ width: `${value}%` }}>
        <span className="bar-value">{value}%</span>
      </div>
    </div>
  </div>
));

BarItem.displayName = 'BarItem';

// 横向き棒グラフコンポーネント（純粋関数コンポーネント）
export const HorizontalBarChart = memo(() => (
  <div className="horizontal-bar-chart">
    <h4>ダミーデータグラフ</h4>
    <div className="chart-container">
      {DUMMY_DATA.map((data) => (
        <BarItem key={data.label} label={data.label} value={data.value} />
      ))}
    </div>
  </div>
));

HorizontalBarChart.displayName = 'HorizontalBarChart';
