import { useState, useCallback, useMemo } from 'react';
import type { TabId, TabMachineState, TabEvent, TabContext } from '../types/tabs';

// 初期コンテキストを生成（純粋関数）
const createInitialContext = (): TabContext => ({ inputValue: '' });

// 初期状態を生成（純粋関数）
const createInitialState = (): TabMachineState => ({
  state: 'tab1',
  context: {
    tab1: createInitialContext(),
    tab2: createInitialContext(),
    tab3: createInitialContext(),
    tab4: createInitialContext(),
  },
});

// State Machine風の状態遷移関数（純粋関数）
const transition = (current: TabMachineState, event: TabEvent): TabMachineState => {
  if (event.type === 'SWITCH_TAB') {
    return { ...current, state: event.tabId };
  }
  if (event.type === 'UPDATE_CONTEXT') {
    return {
      ...current,
      context: {
        ...current.context,
        [event.tabId]: { ...current.context[event.tabId], inputValue: event.inputValue },
      },
    };
  }
  return current;
};

export const useTabs = () => {
  const [machineState, setMachineState] = useState<TabMachineState>(createInitialState);

  const switchTab = useCallback((tabId: TabId) => {
    setMachineState(current => transition(current, { type: 'SWITCH_TAB', tabId }));
  }, []);

  const updateTabContext = useCallback((tabId: TabId, inputValue: string) => {
    setMachineState(current => transition(current, { type: 'UPDATE_CONTEXT', tabId, inputValue }));
  }, []);

  const currentTabContext = useMemo(
    () => machineState.context[machineState.state],
    [machineState]
  );

  return {
    activeTab: machineState.state,
    allContexts: machineState.context,
    currentTabContext,
    switchTab,
    updateTabContext,
  };
};
