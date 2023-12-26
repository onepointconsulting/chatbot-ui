import { useContext } from 'react';
import { MessageContext } from '../context/MessageContext.tsx';
import { signal } from '@preact/signals-react';

const deleteHistory = signal<boolean>(false);

const deleteHistoryCheckId = 'delete-history-check';

export default function ClearDialog({}) {
  const { dispatch } = useContext(MessageContext);

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
    if (deleteHistory.value) {
      localStorage.removeItem('history');
    }
    onClose();
  }

  return (
    <dialog data-model={true} id="clear-dialog">
      <div>Would you really like to delete the chat contents?</div>
      <input
        type="checkbox"
        checked={deleteHistory.value}
        onChange={() => (deleteHistory.value = !deleteHistory.value)}
        id={deleteHistoryCheckId}
      />{' '}
      <label htmlFor={deleteHistoryCheckId} className="cursor-pointer">
        Delete history
      </label>
      <div className="flex justify-between mt-2">
        <button data-close-modal={true} onClick={onClose}>
          Close
        </button>
        <button onClick={onOk}>Ok</button>
      </div>
    </dialog>
  );
}
