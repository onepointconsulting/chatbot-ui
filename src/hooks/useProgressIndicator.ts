import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.tsx';
import { MessageContext } from '../context/MessageContext.tsx';
import { getSession } from '../lib/sessionFunctions.ts';

export default function useProgressIndicator() {
  const { chartProgressUrl, barchartProgressUrl } = useContext(ChatContext);
  const { state } = useContext(MessageContext);
  const { data } = state;
  const session = getSession();
  const spiderChartUrl = `${chartProgressUrl}/${session?.id}?count=${data.length}`;
  const barChartUrl = `${barchartProgressUrl}/${session?.id}?count=${data.length}`;
  const progressImages = [
    {
      url: spiderChartUrl,
      title: 'Spider Chart',
    },
    {
      url: barChartUrl,
      title: 'Bar Chart',
    },
  ];
  return {
    data,
    session,
    progressImages,
  };
}
