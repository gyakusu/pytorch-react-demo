import React, { ChangeEvent, memo } from 'react';

interface FeatureInputProps {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
}

// 純粋なプレゼンテーショナルコンポーネント（memo化）
export const FeatureInput = memo<FeatureInputProps>(({ index, value, onChange }) => {
  // イベントハンドラを関数型で定義
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(index, e.target.value);
  };

  return (
    <div className="input-group">
      <label htmlFor={`feature-${index}`}>
        特徴量 {index + 1}:
      </label>
      <input
        id={`feature-${index}`}
        type="number"
        step="any"
        value={value}
        onChange={handleChange}
        placeholder={`特徴量${index + 1}を入力`}
        required
      />
    </div>
  );
});

FeatureInput.displayName = 'FeatureInput';
