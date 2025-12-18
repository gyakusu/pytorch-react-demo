import React, { memo, ChangeEvent } from 'react';
import type { TabId } from '../types/tabs';
import { HorizontalBarChart } from './HorizontalBarChart';

interface TabPanelProps {
  tabId: TabId;
  inputValue: string;
  onInputChange: (tabId: TabId, value: string) => void;
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

// タブパネルコンポーネント（純粋関数コンポーネント）
export const TabPanel = memo<TabPanelProps>(({ tabId, inputValue, onInputChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange(tabId, e.target.value);
  };

  const isTab1 = tabId === 'tab1';

  return (
    <div className="tab-panel">
      <h3>{tabId.toUpperCase()} コンテンツ</h3>
      <div className={`tab-content ${isTab1 ? 'two-column-layout' : ''}`}>
        <InputSection tabId={tabId} inputValue={inputValue} onChange={handleChange} />
        {isTab1 && <HorizontalBarChart />}
      </div>
    </div>
  );
});

TabPanel.displayName = 'TabPanel';
