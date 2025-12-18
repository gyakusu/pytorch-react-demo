import React, { memo, ChangeEvent, useCallback, useState, useEffect } from 'react';
import type { TabId } from '../types/tabs';
import type { ParamKey } from '../types/params';
import type { SectionResult } from '../types/bearing';
import { MultiSectionBarChart } from './MultiSectionBarChart';
import { ParameterSelector } from './ParameterSelector';
import { mockPredictAPI, transformResponse, SAMPLE_BEARING_INPUT } from '../utils/bearingPrediction';

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
  const [sections, setSections] = useState<readonly SectionResult[]>([]);
  const [loading, setLoading] = useState(false);

  // モックAPIからデータ取得（Tab1のみ）
  useEffect(() => {
    if (tabId !== 'tab1') return;

    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const response = await mockPredictAPI(SAMPLE_BEARING_INPUT);
        const transformed = transformResponse(response);
        setSections(transformed);
      } catch (error) {
        console.error('予測データの取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [tabId]);

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
            {loading ? (
              <div>読み込み中...</div>
            ) : (
              <MultiSectionBarChart sections={sections} />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

TabPanel.displayName = 'TabPanel';
