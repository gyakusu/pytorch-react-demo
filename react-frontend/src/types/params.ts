// パラメータ選択機能の型定義

export type ParamKey = 'D_i' | 'Omega' | 'K_a';

export interface ParamMeta {
  key: ParamKey;
  label: string;
}

export interface ParamState {
  selectedParams: ParamKey[];
  paramValues: Record<string, string>;
}

// パラメータメタデータ（定数）
export const PARAM_METAS: readonly ParamMeta[] = [
  { key: 'D_i', label: 'D_i' },
  { key: 'Omega', label: 'Omega' },
  { key: 'K_a', label: 'K_a' },
] as const;
