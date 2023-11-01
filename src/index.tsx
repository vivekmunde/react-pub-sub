import * as pusu from 'pusu';
import React from 'react';

export { createPublication, publish, subscribe } from 'pusu';

export type { TCreatePublication, TPublication, TPublish, TSubscribe } from 'pusu';

export type TWithSubscribe = (Component: React.ComponentType<{ subscribe: pusu.TSubscribe }>) => React.ComponentType;

export const withSubscribe: TWithSubscribe = (Component) => {

  return class Subscribe extends React.Component {

    subscriptions: (() => void)[] = []

    subscribe: pusu.TSubscribe = (publication, subscriber) => {
      const unsubscribe = pusu.subscribe(publication, subscriber);
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
      return <Component {...this.props} subscribe={this.subscribe} />;
    }
  }
}
