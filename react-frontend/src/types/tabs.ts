// State Machine互換のタブ型定義

export type TabId = 'tab1' | 'tab2' | 'tab3' | 'tab4';

// タブごとのコンテキスト（将来的にState Machineのcontextになる）
export interface TabContext {
  inputValue: string;
  // 将来的に追加するデータをここに定義
}

// State Machine形式の状態構造
export interface TabMachineState {
  state: TabId;  // 現在アクティブなタブ（State Machineのstate）
  context: Record<TabId, TabContext>;  // 各タブのコンテキスト
}

// 状態遷移イベント（State Machineのevent）
export type TabEvent =
  | { type: 'SWITCH_TAB'; tabId: TabId }
  | { type: 'UPDATE_CONTEXT'; tabId: TabId; inputValue: string };

// タブメタデータ
export interface TabMeta {
  id: TabId;
  label: string;
}
