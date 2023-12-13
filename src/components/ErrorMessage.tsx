function pad(num: number): string {
  return String(num).padStart(2, '0');
}

function printTime(): string {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds(),
  )}`;
}

function handleErrorMessage(message: string): string {
  if (message.includes('xhr poll error')) {
    return 'The server is not available. Please try again later ...';
  }
  return message;
}

export default function ErrorMessage({
  message,
  clearFunc,
  isError = true,
}: {
  message: string;
  clearFunc: () => void;
  isError?: boolean;
}) {
  const ool = isError ? 'red' : 'green';
  return (
    <div
      className={`bg-${ool}-100 border-l-4 border-${ool}-500 text-${ool}-700 p-4`}
      role="alert"
    >
      <div className="flex justify-between">
        <div>
          <span className="text-xs">{printTime()}</span>
          <br />
          <span className="font-bold">
            {isError ? 'Error' : 'Message'}
          </span>: {handleErrorMessage(message)}
        </div>
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              clearFunc();
            }}
            className="text-xs"
            title="close"
          >
            &#10006;
          </a>
        </div>
      </div>
    </div>
  );
}
