import { UploadedFile } from '../lib/model.ts';
import { injectSourceLinks } from '../lib/sourceFunctions.ts';
import { ChatContext } from '../context/ChatContext.tsx';
import { useContext } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { Message } from '../model/message.ts';

function uploadedFilesAdapter(data?: UploadedFile[]): string[] {
  return data?.map((file) => file.name) ?? [];
}

export default function Sources({ message }: { message: Message }) {
  const { uploadedFilesUrl } = useContext(ChatContext);

  async function fetchFileNames() {
    if (!uploadedFilesUrl) return Promise.resolve([]);
    const res = await fetch(uploadedFilesUrl);
    return await res.json();
  }

  const res: UseQueryResult<UploadedFile[]> = useQuery(
    'sourceFileNames',
    fetchFileNames,
  );
  const uploadedFiles = uploadedFilesAdapter(res.data);

  if (!!message.sources) {
    return (
      <div className="text-sm text-gray-400 mt-2">
        Sources:{' '}
        <span
          dangerouslySetInnerHTML={{
            __html: injectSourceLinks(message.sources, uploadedFiles),
          }}
        />
      </div>
    );
  }
  return <></>;
}
