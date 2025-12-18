import React, { memo, ChangeEvent } from 'react';
import type { TabId } from '../types/tabs';

interface TabPanelProps {
  tabId: TabId;
  inputValue: string;
  onInputChange: (tabId: TabId, value: string) => void;
}

// タブパネルコンポーネント（純粋関数コンポーネント）
export const TabPanel = memo<TabPanelProps>(({ tabId, inputValue, onInputChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange(tabId, e.target.value);
  };

  return (
    <div className="tab-panel">
      <h3>{tabId.toUpperCase()} コンテンツ</h3>
      <div className="tab-content">
        <label htmlFor={`${tabId}-input`}>
          テスト入力（状態保持確認用）:
        </label>
        <input
          id={`${tabId}-input`}
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={`${tabId}の入力...`}
          className="tab-input"
        />
        <p className="tab-info">
          現在の値: <strong>{inputValue || '（空）'}</strong>
        </p>
      </div>
    </div>
  );
});

TabPanel.displayName = 'TabPanel';
