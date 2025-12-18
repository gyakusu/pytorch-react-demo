import React, { memo } from 'react';

interface ErrorDisplayProps {
  error: string;
}

// 純粋なプレゼンテーショナルコンポーネント（memo化）
export const ErrorDisplay = memo<ErrorDisplayProps>(({ error }) => (
  <div className="error-message">
    <h3>エラー</h3>
    <p>{error}</p>
  </div>
));

ErrorDisplay.displayName = 'ErrorDisplay';
