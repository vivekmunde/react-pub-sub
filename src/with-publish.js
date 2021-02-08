import React from 'react';
import { publish as _publish } from 'pusu';

export default function withPublish(Component) {

  return class Publish extends React.Component {

    publish = (publication, ...args) => {
      _publish(publication, ...args);
    }

    render() {
      return (
        <Component
          {...this.props}
          publish={this.publish}
        />
      );
    }

  }

}