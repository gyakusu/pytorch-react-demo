import React, { useState, FormEvent, useCallback, useMemo } from 'react';
import './App.css';
import { FeatureInput, ErrorDisplay, PredictionDisplay, TabBar, TabPanel } from './components';
import { usePrediction } from './hooks/usePrediction';
import { useTabs } from './hooks/useTabs';
import { updateAtIndex, parseFeatures, areAllFeaturesValid } from './utils/featureValidation';
import type { TabMeta } from './types/tabs';

const DEFAULT_FEATURES = ['1.0', '2.0', '3.0', '4.0', '5.0'];

// タブメタデータ定義（純粋データ）
const TAB_METAS: readonly TabMeta[] = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
  { id: 'tab4', label: 'Tab 4' },
] as const;

function App() {
  const [features, setFeatures] = useState<string[]>(DEFAULT_FEATURES);
  const { result: prediction, loading, error, predict, reset: resetPrediction, setError } = usePrediction();
  const {
    activeTab,
    currentTabContext,
    switchTab,
    updateTabContext,
    updateParamSelection,
    updateParamValue,
  } = useTabs();

  // 純粋関数を使った不変な配列更新（useCallbackで安定化）
  const handleInputChange = useCallback((index: number, value: string): void => {
    setFeatures(current => updateAtIndex(current, index, value));
  }, []);

  // フォーム送信ハンドラ（関数型エラーハンドリング）
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // 純粋関数を使って検証と変換
    const result = parseFeatures(features);

    // Result型のパターンマッチング風の処理
    if (!result.success) {
      setError(result.error);
      return;
    }

    // 成功の場合は予測を実行
    await predict(result.data);
  }, [features, predict, setError]);

  // リセットハンドラ（複数の状態を一度にリセット）
  const handleReset = useCallback((): void => {
    setFeatures(DEFAULT_FEATURES);
    resetPrediction();
  }, [resetPrediction]);

  // ボタンの無効化状態をメモ化（再計算を避ける）
  const isSubmitDisabled = useMemo(
    () => loading || !areAllFeaturesValid(features),
    [loading, features]
  );

  // ボタンのテキストをメモ化
  const submitButtonText = useMemo(
    () => loading ? '予測中...' : '予測実行',
    [loading]
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>機械学習予測システム</h1>
        <p>5つの特徴量を入力して予測を取得（タブ機能付き）</p>
      </header>

      <main className="main-content">
        {/* タブバー */}
        <TabBar tabs={TAB_METAS} activeTab={activeTab} onTabClick={switchTab} />

        {/* タブパネル */}
        <TabPanel
          tabId={activeTab}
          inputValue={currentTabContext.inputValue}
          selectedParams={currentTabContext.selectedParams || []}
          paramValues={currentTabContext.paramValues || {}}
          onInputChange={updateTabContext}
          onParamSelectionChange={updateParamSelection}
          onParamValueChange={updateParamValue}
        />

        {/* 既存の機械学習予測機能 */}
        <form onSubmit={handleSubmit} className="prediction-form">
          <h2>特徴量入力</h2>
          <div className="feature-inputs">
            {features.map((feature, index) => (
              <FeatureInput
                key={index}
                index={index}
                value={feature}
                onChange={handleInputChange}
              />
            ))}
          </div>

          <div className="button-group">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="predict-button"
            >
              {submitButtonText}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="reset-button"
            >
              リセット
            </button>
          </div>
        </form>

        {error && <ErrorDisplay error={error} />}
        {prediction && <PredictionDisplay prediction={prediction} />}
      </main>
    </div>
  );
}

export default App;
