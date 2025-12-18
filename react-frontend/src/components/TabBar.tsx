import React, { memo } from 'react';
import type { TabId, TabMeta } from '../types/tabs';

interface TabBarProps {
  tabs: readonly TabMeta[];
  activeTab: TabId;
  onTabClick: (tabId: TabId) => void;
}

// タブボタンコンポーネント（純粋関数コンポーネント）
const TabButton = memo<{ tab: TabMeta; isActive: boolean; onClick: () => void }>(
  ({ tab, isActive, onClick }) => (
    <button
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {tab.label}
    </button>
  )
);

TabButton.displayName = 'TabButton';

// タブバーコンポーネント（純粋関数コンポーネント）
export const TabBar = memo<TabBarProps>(({ tabs, activeTab, onTabClick }) => (
  <div className="tab-bar">
    {tabs.map(tab => (
      <TabButton
        key={tab.id}
        tab={tab}
        isActive={tab.id === activeTab}
        onClick={() => onTabClick(tab.id)}
      />
    ))}
  </div>
));

TabBar.displayName = 'TabBar';
