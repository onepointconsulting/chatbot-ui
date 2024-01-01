function clear() {
  const myDialog: any | null = document.getElementById('clear-dialog');
  if (myDialog) {
    myDialog.showModal();
  }
}

export default function ClearButton() {
  return (
    <button
      className="flex-none h-10 ml-1 mr-2 my-auto hover:transform rounded-2xl hover:bg-scale-100 hover:duration-200 outline-0"
      onClick={clear}
    >
      <img
        src="/clear.svg"
        alt="Clear"
        title="clear the chat"
        style={{ width: '38px' }}
      />
    </button>
  );
}
