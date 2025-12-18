import React, { memo, ChangeEvent, useCallback } from 'react';
import type { TabId } from '../types/tabs';
import type { ParamKey } from '../types/params';
import { HorizontalBarChart } from './HorizontalBarChart';
import { ParameterSelector } from './ParameterSelector';

interface TabPanelProps {
  tabId: TabId;
  inputValue: string;
  selectedParams: ParamKey[];
  paramValues: Record<string, string>;
  onInputChange: (tabId: TabId, value: string) => void;
  onParamSelectionChange: (tabId: TabId, selectedParams: ParamKey[]) => void;
  onParamValueChange: (tabId: TabId, paramKey: string, value: string) => void;
}

// 入力セクション（純粋関数コンポーネント、ネスト1）
const InputSection = memo<{ tabId: TabId; inputValue: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void }>(
  ({ tabId, inputValue, onChange }) => (
    <div className="input-section">
      <label htmlFor={`${tabId}-input`}>
        テスト入力（状態保持確認用）:
      </label>
      <input
        id={`${tabId}-input`}
        type="text"
        value={inputValue}
        onChange={onChange}
        placeholder={`${tabId}の入力...`}
        className="tab-input"
      />
      <p className="tab-info">
        現在の値: <strong>{inputValue || '（空）'}</strong>
      </p>
    </div>
  )
);

InputSection.displayName = 'InputSection';

// タブパネルコンポーネント（純粋関数コンポーネント、ネスト2）
export const TabPanel = memo<TabPanelProps>(({
  tabId,
  inputValue,
  selectedParams,
  paramValues,
  onInputChange,
  onParamSelectionChange,
  onParamValueChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange(tabId, e.target.value);
  };

  // パラメータ選択のトグル（純粋関数的アプローチ）
  const handleToggleParam = useCallback((paramKey: ParamKey) => {
    const newSelection = selectedParams.includes(paramKey)
      ? selectedParams.filter(p => p !== paramKey)
      : [...selectedParams, paramKey];
    onParamSelectionChange(tabId, newSelection);
  }, [selectedParams, onParamSelectionChange, tabId]);

  const handleParamValueChange = useCallback((paramKey: string, value: string) => {
    onParamValueChange(tabId, paramKey, value);
  }, [onParamValueChange, tabId]);

  const isTab1 = tabId === 'tab1';

  return (
    <div className="tab-panel">
      <h3>{tabId.toUpperCase()} コンテンツ</h3>
      <div className={`tab-content ${isTab1 ? 'two-column-layout' : ''}`}>
        <div className="left-column">
          {isTab1 && (
            <ParameterSelector
              selectedParams={selectedParams}
              paramValues={paramValues}
              onToggleParam={handleToggleParam}
              onValueChange={handleParamValueChange}
            />
          )}
          <InputSection tabId={tabId} inputValue={inputValue} onChange={handleChange} />
        </div>
        {isTab1 && (
          <div className="right-column">
            <HorizontalBarChart />
          </div>
        )}
      </div>
    </div>
  );
});

TabPanel.displayName = 'TabPanel';
