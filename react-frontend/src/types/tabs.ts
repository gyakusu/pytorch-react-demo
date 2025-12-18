// State Machine互換のタブ型定義

import type { ParamKey } from './params';

export type TabId = 'tab1' | 'tab2' | 'tab3' | 'tab4';

// タブごとのコンテキスト（将来的にState Machineのcontextになる）
export interface TabContext {
  inputValue: string;
  selectedParams?: ParamKey[];
  paramValues?: Record<string, string>;
}

// State Machine形式の状態構造
export interface TabMachineState {
  state: TabId;  // 現在アクティブなタブ（State Machineのstate）
  context: Record<TabId, TabContext>;  // 各タブのコンテキスト
}

// 状態遷移イベント（State Machineのevent）
export type TabEvent =
  | { type: 'SWITCH_TAB'; tabId: TabId }
  | { type: 'UPDATE_CONTEXT'; tabId: TabId; inputValue: string }
  | { type: 'UPDATE_PARAM_SELECTION'; tabId: TabId; selectedParams: ParamKey[] }
  | { type: 'UPDATE_PARAM_VALUE'; tabId: TabId; paramKey: string; value: string };

// タブメタデータ
export interface TabMeta {
  id: TabId;
  label: string;
}
