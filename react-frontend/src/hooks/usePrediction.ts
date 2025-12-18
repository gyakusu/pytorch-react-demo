import { useState, useCallback } from 'react';

export interface PredictionResult {
  prediction: number;
  confidence: number;
}

interface PredictionState {
  result: PredictionResult | null;
  loading: boolean;
  error: string;
}

// API呼び出しを行う純粋な関数（副作用を返す）
const fetchPrediction = async (features: number[]): Promise<PredictionResult> => {
  const response = await fetch('http://127.0.0.1:8100/predict', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ features }),
  });

  if (!response.ok) {
    throw new Error('予測の取得に失敗しました');
  }

  return response.json();
};

// 副作用を管理するカスタムフック
export const usePrediction = () => {
  const [state, setState] = useState<PredictionState>({
    result: null,
    loading: false,
    error: '',
  });

  // predict関数を安定化（useCallback）
  const predict = useCallback(async (features: number[]): Promise<void> => {
    // ローディング開始状態に更新
    setState({
      result: null,
      loading: true,
      error: '',
    });

    try {
      const result = await fetchPrediction(features);
      // 成功状態に更新
      setState({
        result,
        loading: false,
        error: '',
      });
    } catch (err) {
      // エラー状態に更新
      setState({
        result: null,
        loading: false,
        error: err instanceof Error ? err.message : 'エラーが発生しました',
      });
    }
  }, []);

  // リセット関数
  const reset = useCallback((): void => {
    setState({
      result: null,
      loading: false,
      error: '',
    });
  }, []);

  // エラー設定関数（バリデーションエラーなどに使用）
  const setError = useCallback((errorMessage: string): void => {
    setState({
      result: null,
      loading: false,
      error: errorMessage,
    });
  }, []);

  return {
    ...state,
    predict,
    reset,
    setError,
  };
};
