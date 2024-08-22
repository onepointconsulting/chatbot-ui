import { useContext } from 'react';
import { MessageContext } from '../context/MessageContext.tsx';
import { getSession, SESSION_KEY } from '../lib/sessionFunctions.ts';
import {
  addToHistory,
  clearLocalStorage,
  HISTORY_KEY,
} from '../lib/history.ts';
import onCloseDialogue from '../lib/dialogFunctions.ts';
import { RESTART_DIALOGUE_ID } from '../components/dialogs/RestartDialogue.tsx';

export default function useRestart() {
  const { dispatch } = useContext(MessageContext);
  function onRestart() {
    dispatch({
      type: 'clear',
    });

    const sessionId = getSession()?.id;
    if (!!sessionId) {
      addToHistory(sessionId);
    }

    clearLocalStorage(SESSION_KEY);
    clearLocalStorage(HISTORY_KEY);
    onCloseDialogue(RESTART_DIALOGUE_ID);
    location.reload();
  }
  return { dispatch, onRestart };
}
