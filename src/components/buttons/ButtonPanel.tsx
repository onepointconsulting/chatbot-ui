export default function ButtonPanel({
  onOk,
  okText,
  disabled = false,
}: {
  onOk: () => void;
  okText: string;
  disabled: boolean;
}) {
  return (
    <div className="companion-dialogue-buttons">
      <button
        data-close-modal={true}
        onClick={onOk}
        className="button-ok"
        disabled={disabled}
      >
        {okText}
      </button>
    </div>
  );
}
