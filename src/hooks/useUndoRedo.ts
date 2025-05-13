
import { useState, useCallback } from 'react';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoRedo<T>(initialPresent: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: []
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  // Save a new present state
  const saveState = useCallback((newPresent: T) => {
    setState(prevState => ({
      past: [...prevState.past, prevState.present],
      present: newPresent,
      future: []
    }));
  }, []);

  // Undo to the previous state
  const undo = useCallback(() => {
    if (!canUndo) return;

    setState(prevState => {
      const previous = prevState.past[prevState.past.length - 1];
      const newPast = prevState.past.slice(0, prevState.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prevState.present, ...prevState.future]
      };
    });
  }, [canUndo]);

  // Redo to the next state
  const redo = useCallback(() => {
    if (!canRedo) return;

    setState(prevState => {
      const next = prevState.future[0];
      const newFuture = prevState.future.slice(1);

      return {
        past: [...prevState.past, prevState.present],
        present: next,
        future: newFuture
      };
    });
  }, [canRedo]);

  return {
    state: state.present,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo
  };
}
