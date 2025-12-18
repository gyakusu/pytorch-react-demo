// ベアリング予測のユーティリティ関数（純粋関数）

import type { BearingInput, PredictionResponse, SectionResult, SectionName } from '../types/bearing';

// FastAPIレスポンス → 表示用データ（純粋関数、15行、ネスト2）
export const transformResponse = (res: PredictionResponse): readonly SectionResult[] =>
  (['Ring', 'Ball', 'Arrangement'] as const).map(name => {
    const section = res[name];
    const items = section.Classes.map((cls, i) => ({
      probability: parseFloat(section.Probabilities[i]),
      className: cls,
    }));

    const recommendedIndex = items.reduce(
      (maxIdx, item, idx, arr) =>
        item.probability > arr[maxIdx].probability ? idx : maxIdx,
      0
    );

    return { sectionName: name, items, recommendedIndex };
  });

// 開発用モックAPI（FastAPIの代わり、10行）
export const mockPredictAPI = async (input: BearingInput): Promise<PredictionResponse> => {
  // 実際のAPIコールをシミュレート（200ms遅延）
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    Ring: {
      Probabilities: ['0.015', '0.985', '0.000'],
      Classes: ['SHX', 'SUJ2', 'SUJ2EP'],
    },
    Ball: {
      Probabilities: ['0.900', '0.065', '0.035'],
      Classes: ['CERAMIC', 'SUJ2', 'SUJ2(EQTF)'],
    },
    Arrangement: {
      Probabilities: ['0.925', '0.065', '0.010'],
      Classes: ['DB', 'DBB', 'DBD'],
    },
  };
};

// サンプル入力データ（開発用）
export const SAMPLE_BEARING_INPUT: BearingInput = {
  D_i: 55,
  Omega: 10000.0,
  L: 9.371849,
  K_a: 119.146737,
  theta: 18,
  Power: 'Motor Built-in',
  Lubrication: 'OIL AIR',
  width: '10/20',
  Cool: 'Jacket Cooling',
  Ring: 'SUJ2',
  Ball: 'CERAMIC',
  Arrangement: 'DB',
  height: '19/10/02',
  Standard: 'Robust',
  Seal: 'TYN',
  Cage: 'TYN',
};
