import { Session } from '../model/session.ts';

export const SESSION_KEY = 'session';
export function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  const session = localStorage.getItem(SESSION_KEY);
  if (session) {
    const sessionObj = JSON.parse(session);
    if (typeof sessionObj.timestamp === 'string') {
      sessionObj.timestamp = new Date(sessionObj.date);
      return sessionObj as Session;
    }
  }
  return null;
}
