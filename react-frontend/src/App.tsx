import React, { useState, FormEvent, ChangeEvent } from 'react';
import './App.css';

interface PredictionResult {
  prediction: number;
  confidence: number;
}

const DEFAULT_FEATURES = ['1.0', '2.0', '3.0', '4.0', '5.0'];

function App() {
  const [features, setFeatures] = useState<string[]>(DEFAULT_FEATURES);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (index: number, value: string): void => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      // 文字列を数値に変換
      const numericFeatures = features.map(feature => {
        const num = parseFloat(feature);
        if (isNaN(num)) {
          throw new Error('すべての値は数値である必要があります');
        }
        return num;
      });

      const response = await fetch('http://127.0.0.1:8100/predict', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: numericFeatures
        }),
      });

      if (!response.ok) {
        throw new Error('予測の取得に失敗しました');
      }

      const result: PredictionResult = await response.json();
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (): void => {
    setFeatures(DEFAULT_FEATURES);
    setPrediction(null);
    setError('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>機械学習予測システム</h1>
        <p>5つの特徴量を入力して予測を取得</p>
      </header>

      <main className="main-content">
        <form onSubmit={handleSubmit} className="prediction-form">
          <h2>特徴量入力</h2>
          <div className="feature-inputs">
            {features.map((feature, index) => (
              <div key={index} className="input-group">
                <label htmlFor={`feature-${index}`}>
                  特徴量 {index + 1}:
                </label>
                <input
                  id={`feature-${index}`}
                  type="number"
                  step="any"
                  value={feature}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(index, e.target.value)}
                  placeholder={`特徴量${index + 1}を入力`}
                  required
                />
              </div>
            ))}
          </div>

          <div className="button-group">
            <button
              type="submit"
              disabled={loading || features.some(f => f === '')}
              className="predict-button"
            >
              {loading ? '予測中...' : '予測実行'}
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

        {error && (
          <div className="error-message">
            <h3>エラー</h3>
            <p>{error}</p>
          </div>
        )}

        {prediction && (
          <div className="prediction-result">
            <h3>予測結果</h3>
            <div className="result-details">
              <div className="result-item">
                <span className="label">予測クラス:</span>
                <span className="value prediction-class">{prediction.prediction}</span>
              </div>
              <div className="result-item">
                <span className="label">信頼度:</span>
                <span className="value confidence">
                  {(prediction.confidence * 100).toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{ width: `${prediction.confidence * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
