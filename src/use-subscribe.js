import { useEffect, useRef } from 'react';
import { subscribe as pusuSubscribe } from 'pusu';

const useSubscribe = () => {
  const ref = useRef({ subscriptions: [] });

  const subscribe = (publication, subscriber) => {
    const unsubscribe = pusuSubscribe(publication, subscriber);
    ref.current.subscriptions.push(unsubscribe);
    return unsubscribe;
  };

  const unsubscribeAll = () => {
    ref.current.subscriptions.forEach(it => it());
  }

  useEffect(() => {
    return unsubscribeAll;
  }, []);

  return subscribe;
};

export default useSubscribe;
