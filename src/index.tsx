import React, { useEffect, useRef } from 'react';
import {
  TSubscribe,
  createPublication as pusuCreatePublication,
  publish as pusuPublish,
  subscribe as pusuSubscribe,
} from 'pusu';

export type TUseSubscribe = () => TSubscribe;

export const createPublication = pusuCreatePublication;

export const publish = pusuPublish;

export const subscribe = pusuSubscribe;

export const useSubscribe: TUseSubscribe = () => {
  const ref = useRef<{ subscriptions: (() => void)[] }>({ subscriptions: [] });

  const rpSubscribe: TSubscribe = (publication, subscriber) => {
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

  return rpSubscribe;
};

export type TWithSubscribe = (Component: React.ComponentType<{ subscribe: TSubscribe }>) => React.ComponentType;

export const withSubscribe: TWithSubscribe = (Component) => {

  return class Subscribe extends React.Component {

    subscriptions: (() => void)[] = []

    rpSubscribe: TSubscribe = (publication, subscriber) => {
      const unsubscribe = pusuSubscribe(publication, subscriber);
      this.subscriptions.push(unsubscribe);
      return unsubscribe;
    }

    unsubscribeAll = () => {
      this.subscriptions.forEach(it => it());
    }

    componentWillUnmount() {
      this.unsubscribeAll();
    }

    render() {
      return <Component subscribe={this.rpSubscribe} />;
    }
  }

}
