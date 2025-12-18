// ベアリング予測システムの型定義（immutable）

// ベアリング仕様の入力（React → FastAPI）
export interface BearingInput {
  readonly D_i: number;
  readonly Omega: number;
  readonly L: number;
  readonly K_a: number;
  readonly theta: number;
  readonly Power: string;
  readonly Lubrication: string;
  readonly width: string;
  readonly Cool: string;
  readonly Ring: string;
  readonly Ball: string;
  readonly Arrangement: string;
  readonly height: string;
  readonly Standard: string;
  readonly Seal: string;
  readonly Cage: string;
}

// FastAPIからの生レスポンス形式
export interface SectionPrediction {
  readonly Probabilities: readonly string[];  // ['0.015', '0.985', '0.000']
  readonly Classes: readonly string[];        // ['SHX', 'SUJ2', 'SUJ2EP']
}

export interface PredictionResponse {
  readonly Ring: SectionPrediction;
  readonly Ball: SectionPrediction;
  readonly Arrangement: SectionPrediction;
}

// 確率とクラス名のペア（表示用）
export interface PredictionItem {
  readonly probability: number;  // 0.015（数値化）
  readonly className: string;    // 'SHX'
}

// セクション単位の結果（表示用）
export interface SectionResult {
  readonly sectionName: string;              // 'Ring'
  readonly items: readonly PredictionItem[]; // 3件
  readonly recommendedIndex: number;         // 最大確率のインデックス
}

// セクション名の型（型安全性）
export type SectionName = 'Ring' | 'Ball' | 'Arrangement';
