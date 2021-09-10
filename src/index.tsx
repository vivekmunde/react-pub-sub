import React from 'react';
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
      return <Component {...this.props} subscribe={this.rpSubscribe} />;
    }
  }
}
