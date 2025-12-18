import React, { memo, ChangeEvent } from 'react';
import type { ParamKey, ParamMeta } from '../types/params';
import { PARAM_METAS } from '../types/params';

interface ParameterSelectorProps {
  selectedParams: ParamKey[];
  paramValues: Record<string, string>;
  onToggleParam: (paramKey: ParamKey) => void;
  onValueChange: (paramKey: string, value: string) => void;
}

// チェックボックス行コンポーネント（ネスト1）
const ParamCheckboxRow = memo<{
  param: ParamMeta;
  isSelected: boolean;
  value: string;
  onToggle: () => void;
  onValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
}>(({ param, isSelected, value, onToggle, onValueChange }) => (
  <div className="param-row">
    <label className="param-checkbox-label">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
      />
      <span className="param-label">{param.label}</span>
    </label>
    {isSelected && (
      <div className="param-input-wrapper">
        <span className="param-input-label">入力:</span>
        <input
          type="text"
          value={value}
          onChange={onValueChange}
          placeholder="値を入力"
          className="param-input"
        />
      </div>
    )}
  </div>
));

ParamCheckboxRow.displayName = 'ParamCheckboxRow';

// パラメータセレクターコンポーネント（ネスト1、純粋関数）
export const ParameterSelector = memo<ParameterSelectorProps>(({
  selectedParams,
  paramValues,
  onToggleParam,
  onValueChange,
}) => (
  <div className="parameter-selector">
    <h4>パラメータ選択</h4>
    <div className="param-list">
      {PARAM_METAS.map(param => (
        <ParamCheckboxRow
          key={param.key}
          param={param}
          isSelected={selectedParams.includes(param.key)}
          value={paramValues[param.key] || ''}
          onToggle={() => onToggleParam(param.key)}
          onValueChange={(e) => onValueChange(param.key, e.target.value)}
        />
      ))}
    </div>
  </div>
));

ParameterSelector.displayName = 'ParameterSelector';
