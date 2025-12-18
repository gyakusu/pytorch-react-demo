// Result型のような関数型エラーハンドリング
export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

// 純粋関数: 文字列が空でないかチェック
export const isNonEmpty = (str: string): boolean => str !== '';

// 純粋関数: すべての特徴量が有効かチェック
export const areAllFeaturesValid = (features: string[]): boolean =>
  features.every(isNonEmpty);

// 純粋関数: 文字列を数値に変換（安全）
export const parseNumber = (str: string): Result<number, string> => {
  const num = parseFloat(str);
  return isNaN(num)
    ? { success: false, error: `"${str}" は有効な数値ではありません` }
    : { success: true, data: num };
};

// 純粋関数: 文字列配列を数値配列に変換（Result型で安全に）
export const parseFeatures = (features: string[]): Result<number[], string> => {
  const results = features.map(parseNumber);

  // 失敗した結果を探す
  const firstError = results.find(result => !result.success);

  if (firstError && !firstError.success) {
    return { success: false, error: firstError.error };
  }

  // すべて成功した場合、データを抽出
  const data = results
    .filter((result): result is { success: true; data: number } => result.success)
    .map(result => result.data);

  return { success: true, data };
};

// 純粋関数: 配列の特定のインデックスを更新（不変）
export const updateAtIndex = <T>(array: T[], index: number, value: T): T[] =>
  array.map((item, i) => i === index ? value : item);
