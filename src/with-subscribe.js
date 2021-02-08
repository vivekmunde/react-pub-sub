import React from 'react';
import { subscribe as _subscribe } from 'pusu';

export default function withSubscribe(Component) {

  return class Subscribe extends React.Component {

    subscriptions = []

    subscribe = (publication, subscriber) => {
      const unsubscribe = _subscribe(publication, subscriber);
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
      return (
        <Component
          {...this.props}
          subscribe={this.subscribe}
        />
      );
    }
  }

}
