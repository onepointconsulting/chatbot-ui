import {useContext} from 'react';
import {MessageContext} from '../context/MessageContext.tsx';
import {Signal, signal} from '@preact/signals-react';
import {SESSION_KEY} from "../lib/sessionFunctions.ts";
import {HISTORY_KEY} from "../lib/history.ts";
import {ChatContext} from "../context/ChatContext.tsx";

const deleteHistory = signal<boolean>(false);

const deleteSession = signal<boolean>(false);

const deleteHistoryCheckId = 'delete-history-check';
const deleteSessionCheckId = 'delete-session-check';

export function DeleteCheckbox({labelText, memberId, boolSignal}: {labelText: string, memberId: string, boolSignal: Signal<boolean>}) {
  return (
    <div className="mb-1">
      <input
        type="checkbox"
        checked={boolSignal.value}
        onChange={() => (boolSignal.value = !boolSignal.value)}
        id={memberId}
      />{' '}
      <label htmlFor={memberId} className="cursor-pointer">{labelText}</label>
    </div>
  )
}

function clearLocalStorage(key: string, boolSignal: Signal<boolean>) {
  if (boolSignal.value) {
    localStorage.removeItem(key);
    boolSignal.value = false;
    if (key === SESSION_KEY) {
      location.reload();
    }
  }
}


export default function ClearDialog({}) {
  const {supportsSession} = useContext(ChatContext);
  const {dispatch} = useContext(MessageContext);

  function onClose() {
    const myDialog: any | null = document.getElementById('clear-dialog');
    if (myDialog) {
      myDialog.close();
    }
  }

  function onOk() {
    dispatch({
      type: 'clear',
    });
    clearLocalStorage(SESSION_KEY, deleteSession)
    clearLocalStorage(HISTORY_KEY, deleteHistory)
    onClose();
  }

  return (
    <dialog data-model={true} id="clear-dialog">
      <div className="my-2">
        Would you really like to delete the chat contents?
      </div>
      <DeleteCheckbox boolSignal={deleteHistory} labelText="Delete history" memberId={deleteHistoryCheckId} />
      {supportsSession && <DeleteCheckbox boolSignal={deleteSession} labelText="Delete session" memberId={deleteSessionCheckId}/>}
      <div className="flex justify-between mt-4">
        <button
          data-close-modal={true}
          onClick={onClose}
          className="button-cancel"
        >
          Close
        </button>
        <button onClick={onOk} className="button-ok">
          Ok
        </button>
      </div>
    </dialog>
  );
}
