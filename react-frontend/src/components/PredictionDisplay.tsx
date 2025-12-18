import React, { memo, useMemo } from 'react';
import { PredictionResult } from '../hooks/usePrediction';

interface PredictionDisplayProps {
  prediction: PredictionResult;
}

// 純粋関数: 信頼度をパーセンテージに変換
const formatConfidence = (confidence: number): string =>
  `${(confidence * 100).toFixed(2)}%`;

// 純粋関数: 信頼度バーの幅を計算
const calculateBarWidth = (confidence: number): string =>
  `${confidence * 100}%`;

// 純粋なプレゼンテーショナルコンポーネント（memo化）
export const PredictionDisplay = memo<PredictionDisplayProps>(({ prediction }) => {
  // メモ化された値（再計算を避ける）
  const confidenceText = useMemo(
    () => formatConfidence(prediction.confidence),
    [prediction.confidence]
  );

  const barWidth = useMemo(
    () => calculateBarWidth(prediction.confidence),
    [prediction.confidence]
  );

  return (
    <div className="prediction-result">
      <h3>予測結果</h3>
      <div className="result-details">
        <div className="result-item">
          <span className="label">予測クラス:</span>
          <span className="value prediction-class">{prediction.prediction}</span>
        </div>
        <div className="result-item">
          <span className="label">信頼度:</span>
          <span className="value confidence">{confidenceText}</span>
        </div>
      </div>
      <div className="confidence-bar">
        <div
          className="confidence-fill"
          style={{ width: barWidth }}
        />
      </div>
    </div>
  );
});

PredictionDisplay.displayName = 'PredictionDisplay';
