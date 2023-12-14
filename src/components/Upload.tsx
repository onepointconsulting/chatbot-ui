import { effect, Signal, signal } from '@preact/signals-react';
import { useDropzone } from 'react-dropzone';
import { useCallback, useContext } from 'react';
import { SpinnerUpload } from './Spinner.tsx';
import { ChatContext } from '../context/ChatContext.tsx';
import axios from 'axios';
import ErrorMessage from './ErrorMessage.tsx';

const TOKEN_LOCAL_STORAGE_KEY = 'TOKEN_LOCAL_STORAGE_KEY';

const webserverUploadToken = signal(
  window.localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY) ?? '',
);

const uploadFile: Signal<File | null> = signal(null);

const isUploading = signal(false);

const error = signal('');

const successMessage = signal('');

effect(() => {
  window.localStorage.setItem(
    TOKEN_LOCAL_STORAGE_KEY,
    webserverUploadToken.value,
  );
});

export default function Upload() {
  const { uploadUrl } = useContext(ChatContext);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(
      'acceptedFiles',
      acceptedFiles,
      typeof acceptedFiles,
      acceptedFiles.length,
    );
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        uploadFile.value = file;
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const labelClass =
    'flex flex-col px-4 py-6 bg-white text-blue shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue';

  const disabledStyle =
    'disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-50';

  const disabled = useCallback(() => {
    return (
      uploadFile.value === null ||
      webserverUploadToken.value.trim().length === 0 ||
      isUploading.value
    );
  }, []);

  function onClear() {
    uploadFile.value = null;
    isUploading.value = false;
    error.value = '';
  }

  async function onUpload() {
    isUploading.value = true;
    const formData = new FormData();
    formData.append('token', webserverUploadToken.value);
    formData.append('file', uploadFile.value as File);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    try {
      await axios.post(uploadUrl, formData, config);
      onClear();
      successMessage.value = 'Upload successful';
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        error.value = e.toString();
      } else {
        error.value = 'Unknown error';
      }
      isUploading.value = false;
    }
  }

  return (
    <div className="flex flex-col h-screen w-full px-4 py-4">
      {isUploading.value && <SpinnerUpload />}
      {!!error.value && (
        <ErrorMessage
          message={error.value}
          clearFunc={() => (error.value = '')}
        />
      )}
      {!!successMessage.value && (
        <ErrorMessage
          message={successMessage.value}
          clearFunc={() => (successMessage.value = '')}
          isError={false}
        />
      )}
      <form>
        <label htmlFor="token" className={labelClass}>
          Webserver Upload Token
        </label>
        <input
          id="token"
          name="token"
          type="text"
          className="w-full px-5 py-3"
          placeholder="Enter your webserver upload token"
          value={webserverUploadToken.value}
          onChange={(e) => (webserverUploadToken.value = e.target.value)}
        />
        <label htmlFor="file" className={labelClass}>
          File
        </label>
        <div
          {...getRootProps()}
          className="w-full px-5 py-3 bg-white h-56 flex flex-col justify-around"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-center">Drop the PDF file here ...</p>
          ) : (
            <p className="text-center">
              {uploadFile.value ? (
                <>
                  <span className="font-bold">{uploadFile.value.name}</span>{' '}
                  ready for upload.
                </>
              ) : (
                "Drag 'n' drop some PDF file here, or click to select file"
              )}
            </p>
          )}
        </div>
        <div className="flex mt-2 w-full">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-3/4 mr-2 ${disabledStyle}`}
            disabled={disabled()}
            onClick={onUpload}
          >
            Upload
          </button>
          <button
            className={`bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded w-1/4 ${disabledStyle}`}
            disabled={disabled()}
            onClick={onClear}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
