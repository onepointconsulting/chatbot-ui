import { getSessionHistory } from '../lib/history.ts';
import { extractIdParam } from '../lib/urlParamExtraction.ts';
import { useContext, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext.tsx';

export default function useShouldRegister(func: (b: boolean) => void) {
  const { tokenValidationUrl } = useContext(ChatContext);

  useEffect(() => {
    if (getSessionHistory().length > 0) {
      const idParam = extractIdParam();
      if (!idParam) {
        // No id. Should register
        console.info('No id param found. Should register');
        func(true);
      } else {
        fetch(tokenValidationUrl, {
          method: 'POST',
          body: JSON.stringify({ token: idParam }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.info('Token data', data);
            // All good, token was validated
            func(false);
          })
          .catch((error) => {
            console.error('Error validating JWT token', error);
            // Failed to validate token. Should register
            func(true);
          });
      }
    } else {
      // No session history. Can use tool for one session
      func(false);
    }
  }, []);
}
