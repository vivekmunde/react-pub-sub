import React from 'react';
import _subscribe from './subscribe';

const withSubscribe = Component => {

    class Subscribe extends React.Component {

        subscriptions = []

        subscribe = (publication, subscriber) => {
            this.subscriptions.push(_subscribe(publication, subscriber));
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

    return Subscribe;
}

export default withSubscribe;
