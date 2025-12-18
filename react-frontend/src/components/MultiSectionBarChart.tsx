import React, { memo } from 'react';
import type { SectionResult, PredictionItem } from '../types/bearing';

// 確率バー（8行、ネスト1）
const BarItem = memo<PredictionItem & { isRecommended: boolean }>(
  ({ className, probability, isRecommended }) => (
    <div className={`prediction-bar-item ${isRecommended ? 'recommended' : ''}`}>
      <span className="prediction-bar-label">{className}</span>
      <div className="prediction-bar-track">
        <div
          className="prediction-bar-fill"
          style={{ width: `${probability * 100}%` }}
        >
          <span className="prediction-bar-value">
            {(probability * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
);

BarItem.displayName = 'BarItem';

// 推奨表示バッジ（6行、ネスト1）
const RecommendationBadge = memo<{ className: string; probability: number }>(
  ({ className, probability }) => (
    <div className="recommendation-badge">
      <span className="checkmark">✓</span>
      推奨: {className} ({(probability * 100).toFixed(1)}%)
    </div>
  )
);

RecommendationBadge.displayName = 'RecommendationBadge';

// セクションブロック（15行、ネスト2）
const SectionBlock = memo<{ section: SectionResult }>(({ section }) => {
  const recommended = section.items[section.recommendedIndex];

  return (
    <div className="prediction-section-block">
      <h4 className="prediction-section-title">{section.sectionName}</h4>
      <div className="prediction-bars-container">
        {section.items.map((item, idx) => (
          <BarItem
            key={item.className}
            {...item}
            isRecommended={idx === section.recommendedIndex}
          />
        ))}
      </div>
      <RecommendationBadge
        className={recommended.className}
        probability={recommended.probability}
      />
    </div>
  );
});

SectionBlock.displayName = 'SectionBlock';

// マルチセクション棒グラフ（親コンポーネント、10行、ネスト1）
export const MultiSectionBarChart = memo<{ sections: readonly SectionResult[] }>(
  ({ sections }) => (
    <div className="multi-section-chart">
      {sections.map(section => (
        <SectionBlock key={section.sectionName} section={section} />
      ))}
    </div>
  )
);

MultiSectionBarChart.displayName = 'MultiSectionBarChart';
