import * as pusu from 'pusu';
import React, { useEffect, useRef } from 'react';

export { createPublication, publish, subscribe } from 'pusu';

export type { TCreatePublication, TPublication, TPublish, TSubscribe } from 'pusu';

export type TUseSubscribe = () => pusu.TSubscribe;

export const useSubscribe: TUseSubscribe = () => {
  const ref = useRef<{ subscriptions: (() => void)[] }>({ subscriptions: [] });

  const subscribe: pusu.TSubscribe = (publication, subscriber) => {
    const unsubscribe = pusu.subscribe(publication, subscriber);
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

export type TWithSubscribe = <P, S>(
  Component: React.ComponentClass<P & { subscribe: pusu.TSubscribe }, S>
    | React.FunctionComponent<P & { subscribe: pusu.TSubscribe }>
) => React.FC<P>;

export const withSubscribe: TWithSubscribe = <P, S>(
  Component: React.ComponentClass<P & { subscribe: pusu.TSubscribe }, S>
    | React.FunctionComponent<P & { subscribe: pusu.TSubscribe }>
) => {
  const Subscribe: React.FC<P> = (props) => {
    const subscribe = useSubscribe();

    return <Component {...props} subscribe={subscribe} />;
  };

  return Subscribe;
}
