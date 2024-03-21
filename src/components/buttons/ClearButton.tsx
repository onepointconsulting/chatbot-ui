import { CLEAR_DIALOG_ID } from '../dialogs/ClearDialog.tsx';

function showClearDialog() {
  const myDialog: any | null = document.getElementById(CLEAR_DIALOG_ID);
  if (myDialog) {
    myDialog.showModal();
  }
}

export default function ClearButton() {
  return (
    <button
      className="flex-none h-10 ml-1 mr-2 my-auto hover:transform rounded-2xl hover:bg-scale-100 outline-0 hover:duration-200"
      onClick={showClearDialog}
    >
      <img src="/start.svg" alt="Clear" title="clear the chat" />
    </button>
  );
}
